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
	"github.com/xiaomi/naftis/src/api/model"
	"github.com/xiaomi/naftis/src/api/storer/db"
	"github.com/xiaomi/naftis/src/api/worker"
)

// Task wraps task service for easily use.
var Task task

type task struct{}

func (task) Get(name, content, operator, serviceUID string, id uint, ctmin, ctmax int, revision uint) []model.Task {
	return db.GetTask(name, content, operator, serviceUID, id, ctmin, ctmax, revision)
}

func (task) Add(tmplID uint, command int, content, operator, serviceUID string) error {
	return worker.Feed(tmplID, command, content, operator, serviceUID, 1)
}

// Deprecated: the function is already Deprecated.
func (task) Update(content, operator, serviceUID string, id, tmplID uint) error {
	return db.UpdateTask(content, operator, serviceUID, id, tmplID, 0)
}

// Deprecated: the function is already Deprecated.
func (task) Delete(id uint, operator string) error {
	return db.DeleteTask(id, operator)
}
