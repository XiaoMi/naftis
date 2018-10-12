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

package db

import (
	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/model"

	"github.com/jinzhu/gorm"
)

// AddTask adds a record into `tasks`.
func AddTask(tmplID uint, content, operator, serviceUID, prevState string, status uint) error {
	if content == "" || operator == "" || serviceUID == "" {
		return ErrInvalidParams
	}

	// insert record into `tasks`
	var task = model.Task{
		TaskTmplID: tmplID,
		Content:    content,
		Operator:   operator,
		Revision:   1,
		Status:     status,
		ServiceUID: serviceUID,
		PrevState:  prevState,
	}
	if e := db.Create(&task).Error; e != nil {
		log.Error("[service] AddTask fail", "error", e.Error(), "record", task)
	}

	return nil
}

// DeleteTask deletes specific record of `tasks`.
// Deprecated: the function is already Deprecated.
func DeleteTask(id uint, operator string) error {
	if e := db.Where("id = ?", id).Delete(model.Task{}).Update("operator", operator).Error; e != nil {
		log.Info("[service] DeleteTask fail", "error", e.Error())
		return e
	}
	return nil
}

// UpdateTask updates specific record of `tasks`.
// Deprecated: the function is already Deprecated.
func UpdateTask(content, operator, serviceUID string, id, tmplID, status uint) error {
	if id == 0 {
		return ErrInvalidParams
	}

	udpates := map[string]interface{}{}
	if content != "" {
		udpates["content"] = content
	}
	if operator != "" {
		udpates["operator"] = operator
	}
	if serviceUID != "" {
		udpates["service_uid"] = serviceUID
	}
	if tmplID != 0 {
		udpates["task_tmpl_id"] = tmplID
	}
	if status != 0 {
		udpates["status"] = status
	}
	udpates["revision"] = gorm.Expr("revision + 1")

	// update record of `tasks`
	var t = model.Task{}
	if e := db.Model(&t).Where("id = ?", id).Updates(udpates).Error; e != nil {
		log.Info("[service] UpdateTask fail", "error", e.Error(), "record", udpates)
	}

	return nil
}

// GetTask queries records from `tasks` with provided fields.
func GetTask(name, content, operator, serviceUID string, id uint, ctmin, ctmax int, revision uint) []model.Task {
	var whereStr = "1=1 "
	var args = make([]interface{}, 0)
	var tasks = make([]model.Task, 0)

	if name != "" {
		whereStr += "and name like ?"
		args = append(args, name)
	}
	if content != "" {
		whereStr += "and content like ?"
		args = append(args, content)
	}
	if operator != "" {
		whereStr += "and operator like ?"
		args = append(args, operator)
	}
	if serviceUID != "" {
		whereStr += "and service_uid like ?"
		args = append(args, serviceUID)
	}
	if id != 0 {
		whereStr += "and id = ?"
		args = append(args, id)
	}
	if ctmin != 0 {
		whereStr += "and create_time > ?"
		args = append(args, ctmin)
	}
	if ctmax != 0 {
		whereStr += "and create_time < ?"
		args = append(args, ctmax)
	}
	if revision != 0 {
		whereStr += "and revision = ?"
		args = append(args, revision)
	}

	if e := db.Where(whereStr, args...).Order("created_at desc").Find(&tasks).Error; e != nil {
		log.Info("[service] GetTask fail", "error", e.Error())
	}

	return tasks
}
