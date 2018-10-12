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
	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/model"
	"github.com/xiaomi/naftis/src/api/storer/db"
)

// TaskTmpl wraps task service for easily use.
var TaskTmpl taskTmpl

type taskTmpl struct{}

func (taskTmpl) Get(name, content, operator string, ids []uint, ctmin, ctmax int, revision, tp uint) []model.TaskTmpl {
	tmpls := db.GetTaskTmpl(name, content, operator, ids, ctmin, ctmax, revision, tp)
	var e error
	for i := range tmpls {
		tmpls[i].VarMap = TaskTmplVar.Get("", "", "", "", 0, tmpls[i].ID, nil)
		if e != nil {
			log.Error("[taskTmpl] Get taskTmpl fail", "err", e)
			return []model.TaskTmpl{}
		}
	}
	return tmpls
}

func (taskTmpl) Add(name, content, brief, operator, icon string, vars []model.TaskTmplVar) (model.TaskTmpl, error) {
	return db.AddTaskTmpl(name, content, brief, operator, vars, icon)
}

func (taskTmpl) Update(name, content, brief, operator, icon string, id uint) error {
	return db.UpdateTaskTmpl(name, content, brief, operator, id, icon)
}

func (taskTmpl) Delete(id int) error {
	return db.DelTaskTmpl(id)
}
