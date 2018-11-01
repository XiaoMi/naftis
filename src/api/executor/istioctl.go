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
	"fmt"
	"os/exec"

	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/model"
	"github.com/xiaomi/naftis/src/api/storer/db"

	"github.com/spf13/viper"
)

type istioctlExecutor struct {
	istioctl string
}

// NewCtlExecutor constructors a istioctl executor.
func NewCtlExecutor() Executor {
	return &istioctlExecutor{
		istioctl: viper.GetString("istioctl"),
	}
}

func buildCmd(subCommand string, content string) string {
	return fmt.Sprintf("cat << EOF | %s %s -f - \n%s\nEOF", "istioctl", subCommand, content)
}

var (
	createTask = func(task *Task) (e error) {
		e = db.AddTask(task.TaskTmplID, task.Content, task.Operator, task.ServiceUID, task.PrevState, task.Namespace, task.Status)
		Push2TaskStatusCh(*task)
		return
	}
	replaceTask = func(task *Task) (e error) {
		e = db.UpdateTask(task.Content, task.Operator, task.ServiceUID, task.ID, task.TaskTmplID, task.Status)
		Push2TaskStatusCh(*task)
		return
	}
	deleteTask = func(task *Task) (e error) {
		e = db.DeleteTask(task.ID, task.Operator)
		Push2TaskStatusCh(*task)
		return
	}
)

// IstioctlCmds defines a table of original istioctl commands.
var IstioctlCmds = map[model.TaskCmd]string{
	model.Create:  "create",
	model.Replace: "replace",
	model.Delete:  "delete",
}

// Execute1 implements Executor.Execute()
func (b *istioctlExecutor) Execute(task Task) error {
	// TODO prompt stdout via websocket
	switch task.Command {
	case model.Create:
		return b.run(task, createTask)
	case model.Replace:
		return b.run(task, replaceTask)
	case model.Apply:
		return b.apply(task, createTask)
	case model.Delete:
		return b.run(task, deleteTask)
	}
	return nil
}

func (b *istioctlExecutor) run(task Task, t taskDbHandler) (err error) {
	taskCmd, ok := IstioctlCmds[task.Command]
	if !ok {
		return ErrUnknownCmd
	}

	// try istioctl command
	task.Status = model.TaskStatusSucc
	cmd := buildCmd(taskCmd, task.Content)
	fmt.Printf("execute command %s\n", cmd)

	var out []byte
	out, err = exec.Command("bash", "-c", cmd).Output()
	if err != nil {
		log.Info("[Execute] command fail", "out", string(out), "err", err)
		task.Status = model.TaskStatusFail
	}
	return t(&task)
}

func (b *istioctlExecutor) apply(task Task, t taskDbHandler) (err error) {
	// try replace command
	task.Status = model.TaskStatusSucc
	var out []byte
	cmd := buildCmd("replace", task.Content)
	out, err = exec.Command("bash", "-c", cmd).Output()
	if err == nil {
		log.Info("[Execute] replace command succ", "out", string(out), "cmd", cmd)
		return t(&task)
	}
	log.Info("[Execute] replace command fail", "out", string(out), "err", err, "cmd", cmd)

	// try create command
	cmd = buildCmd("create", task.Content)
	out, err = exec.Command("bash", "-c", cmd).Output()
	if err == nil {
		log.Info("[Execute] create command succ", "out", string(out), "cmd", cmd)
		return t(&task)
	}
	log.Info("[Execute] create command fail", "out", string(out), "err", err, "cmd", cmd)
	task.Status = model.TaskStatusFail
	return t(&task)
}
