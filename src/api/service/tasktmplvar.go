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

package service

import (
	"strings"

	"github.com/xiaomi/naftis/src/api/model"
	"github.com/xiaomi/naftis/src/api/storer/db"
)

// TaskTmplVar wraps task service for easily use.
var TaskTmplVar taskTmplVar

type taskTmplVar struct{}

var mockVersions = []string{
	"v1", "v2", "v3",
}

func (taskTmplVar) Get(name, title, comment, dataSource string, formType, tasktmplID uint, ids []uint) []model.TaskTmplVar {
	vars := db.GetTaskTmplVar(name, title, comment, dataSource, formType, tasktmplID, ids)
	for i := range vars {
		// parse datasource variable, return specific datasource map
		switch strings.ToLower(vars[i].DataSource) {
		case "host":
			data := make(map[string]string)
			svcs := ServiceInfo.Services("").Exclude("kube-system", "istio-system", "naftis")
			for _, s := range svcs {
				data[s.Name] = s.Name
			}
			vars[i].Data = data
		case "namespace":
			data := make(map[string]string)
			ns := ServiceInfo.Namespaces("").Exclude("kube-system", "istio-system", "naftis")
			for _, s := range ns {
				data[s.Name] = s.Name
			}
			vars[i].Data = data
		case "version":
			vars[i].Data = mockVersions
		}
	}
	return vars
}

func (taskTmplVar) Add(name, title, comment, dataSource string, taskTmplID, formType uint) (model.TaskTmplVar, error) {
	return db.AddTaskTmplVar(name, title, comment, dataSource, taskTmplID, formType)
}

func (taskTmplVar) Update(name, title, comment, dataSource string, id, formType uint) error {
	return db.UpdateTaskTmplVar(name, title, comment, dataSource, id, formType)
}

func (taskTmplVar) Delete(id int) error {
	return db.DelTaskTmplVar(id)
}
