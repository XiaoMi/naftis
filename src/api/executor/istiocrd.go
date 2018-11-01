// Copyright 2018 Naftis Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package executor

import (
	"bytes"
	"errors"
	"fmt"

	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/model"
	"github.com/xiaomi/naftis/src/api/storer/db"
	"github.com/xiaomi/naftis/src/api/util"

	"github.com/ghodss/yaml"
	"github.com/hashicorp/go-multierror"
	"istio.io/istio/pilot/pkg/config/kube/crd"
	istiomodel "istio.io/istio/pilot/pkg/model"
)

var (
	// ErrTaskNotExists is returned when we can't find specific task from istio
	ErrTaskNotExists = errors.New("task isn't exists")
)

type istiocrdExecutor struct {
	client *crd.Client
}

// NewCrdExecutor returns a istiocrd executor.
func NewCrdExecutor() Executor {
	c, e := crd.NewClient(util.Kubeconfig(), "", istiomodel.IstioConfigTypes, "")
	if e != nil {
		log.Panic("[executor] init istiocrd fail", "error", e)
	}
	return &istiocrdExecutor{
		client: c,
	}
}

var (
	addTask = func(task *Task) (e error) {
		e = db.AddTask(task.TaskTmplID, task.Content, task.Operator, task.ServiceUID, task.PrevState, task.Namespace, task.Status)
		if e != nil {
			log.Error("[executor] addTask fail", "err", e)
		}
		Push2TaskStatusCh(*task)
		return
	}
)

// Execute implements Executor.Execute()
func (i *istiocrdExecutor) Execute(task Task) error {
	switch task.Command {
	case model.Create, model.Replace, model.Delete, model.Rollback:
		return i.crdExec(task, addTask)
	case model.Apply:
		return i.apply(task, addTask)
	}
	return nil
}

func (i *istiocrdExecutor) create(varr []istiomodel.Config, task *Task) (errs error) {
	for _, config := range varr {
		var err error
		if config.Namespace, err = handleNamespaces(task.Namespace); err != nil {
			return err
		}

		var rev string
		if rev, err = i.client.Create(config); err != nil {
			// if the config create fail, break loop and return error
			log.Info("Created config fail", "config", config.Key(), "error", err)
			return err
		}
		log.Info("Created config success", "config", config.Key(), "revision", rev)
	}
	return nil
}

func (i *istiocrdExecutor) replace(varr []istiomodel.Config, task *Task) (errs error) {
	currentCfgs := make([]istiomodel.Config, 0)
	defer func() {
		task.PrevState = i.yamlOutput(currentCfgs)
	}()

	for _, config := range varr {
		var err error
		// overwrite config.Namespace with user specified namespace
		if config.Namespace, err = handleNamespaces(task.Namespace); err != nil {
			return err
		}

		// fill up revision
		if config.ResourceVersion == "" {
			current, exists := i.client.Get(config.Type, config.Name, config.Namespace)
			if !exists {
				log.Error("Task not exists", "type", config.Type, "name", config.Name, "namespace", task.Namespace)
				return ErrTaskNotExists
			}
			config.ResourceVersion = current.ResourceVersion
			// clear resourceVersion for rollback
			current.ResourceVersion = ""
			currentCfgs = append(currentCfgs, *current)
		}
		var newRev string
		if newRev, err = i.client.Update(config); err != nil {
			// if the config create fail, break loop and return error
			log.Info("Replace config fail", "config", config.Key(), "error", err, "config", config)
			return err
		}
		log.Info("Replace config success", "config", config.Key(), "revision", newRev, "config", config)
	}

	return nil
}

func (i *istiocrdExecutor) delete(varr []istiomodel.Config, task *Task) (errs error) {
	for _, config := range varr {
		var err error
		if config.Namespace, err = handleNamespaces(config.Namespace); err != nil {
			return err
		}

		if err := i.client.Delete(config.Type, config.Name, config.Namespace); err != nil {
			log.Info("Delete config fail", "config", config.Key(), "error", err)
			// if the config delete fail, continue loop
			errs = multierror.Append(errs, fmt.Errorf("cannot delete %s: %v", config.Key(), err))
		} else {
			log.Info("Delete config success", "config", config.Key())
		}
	}
	return nil
}

func (i *istiocrdExecutor) crdExec(task Task, t taskDbHandler) (errs error) {
	task.Status = model.TaskStatusSucc
	defer func() {
		if errs != nil {
			task.Status = model.TaskStatusFail
		}
		t(&task)
	}()

	// ignore k8s configuration. TODO support k8s configuration
	varr, _, err := crd.ParseInputs(task.Content)
	if err != nil {
		return err
	}
	if len(varr) == 0 {
		return errors.New("nothing to execute")
	}

	switch task.Command {
	case model.Create:
		return i.create(varr, &task)
	case model.Delete:
		return i.delete(varr, &task)
	case model.Replace, model.Rollback: // NOTICE, task.Content should be prevState
		return i.replace(varr, &task)
	}

	return nil
}

var (
	namespace        string
	defaultNamespace = "default"
)

func handleNamespaces(objectNamespace string) (string, error) {
	if objectNamespace != "" && namespace != "" && namespace != objectNamespace {
		return "", fmt.Errorf(`the namespace from the provided object "%s" does `+
			`not match the namespace "%s". You must pass '--namespace=%s' to perform `+
			`this operation`, objectNamespace, namespace, objectNamespace)
	}

	if namespace != "" {
		return namespace, nil
	}

	if objectNamespace != "" {
		return objectNamespace, nil
	}
	return defaultNamespace, nil
}

func (i *istiocrdExecutor) apply(task Task, t taskDbHandler) (errs error) {
	task.Status = model.TaskStatusSucc
	defer func() {
		if errs != nil {
			task.Status = model.TaskStatusFail
		}
		t(&task)
	}()

	// ignore k8s configuration. TODO support k8s configuration
	varr, _, err := crd.ParseInputs(task.Content)
	if err != nil {
		return err
	}
	if len(varr) == 0 {
		return errors.New("nothing to execute")
	}

	if err := i.create(varr, &task); err != nil {
		return i.replace(varr, &task)
	}

	return
}

func (i *istiocrdExecutor) yamlOutput(configList []istiomodel.Config) string {
	buf := bytes.NewBuffer([]byte{})
	descriptor := i.client.ConfigDescriptor()
	for _, config := range configList {
		schema, exists := descriptor.GetByType(config.Type)
		if !exists {
			fmt.Printf("Unknown kind %q for %v", crd.ResourceName(config.Type), config.Name)
			continue
		}
		obj, err := crd.ConvertConfig(schema, config)
		if err != nil {
			fmt.Printf("Could not decode %v: %v", config.Name, err)
			continue
		}
		bytes, err := yaml.Marshal(obj)
		if err != nil {
			fmt.Printf("Could not convert %v to YAML: %v", config, err)
			continue
		}

		buf.Write(bytes)
		buf.WriteString("---")
	}

	return buf.String()
}
