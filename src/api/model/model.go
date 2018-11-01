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

package model

import (
	"time"
)

// TaskTmpl defines fields of table `task_tmpls`.
type TaskTmpl struct {
	ID        uint          `json:"id" gorm:"primary_key"`
	CreatedAt time.Time     `json:"createAt"`
	UpdatedAt time.Time     `json:"updateAt"`
	DeletedAt *time.Time    `json:"deleteAt" sql:"index"`
	Name      string        `json:"name"`
	Content   string        `json:"content"`
	Brief     string        `json:"brief"`
	Revision  uint          `json:"revision"`
	Operator  string        `json:"operator"`
	Icon      string        `json:"icon"`
	VarMap    []TaskTmplVar `json:"varMap" gorm:"-"`
}

// Var defines template variable fields.
type Var struct {
	Name       string      `json:"name"`
	Title      string      `json:"comment" gorm:"column:title"`
	Type       string      `json:"type" gorm:"column:form_type"`
	DataSource interface{} `json:"value" gorm:"column:data_source"`
}

// TaskTmplVar defines template variable fields.
type TaskTmplVar struct {
	TaskTmplID uint        `json:"taskTmplID" gorm:"task_tmpl_id"`
	Name       string      `json:"name"`
	Title      string      `json:"title"`
	Comment    string      `json:"comment"`
	FormType   uint        `json:"formType"`
	DataSource string      `json:"dataSource" gorm:"column:data_source"`
	Default    string      `json:"default"`
	Data       interface{} `json:"data" gorm:"-"`
}

const (
	// TaskStatusDefault means task is currently created.
	TaskStatusDefault uint = iota
	// TaskStatusProcessing means task is under processing.
	TaskStatusProcessing
	// TaskStatusSucc means task is executed success.
	TaskStatusSucc
	// TaskStatusFail means task is executed fail.
	TaskStatusFail
)

// TaskCmd defines istioctl subcommand.
type TaskCmd int

const (
	// Apply combines Create command and Replace Command,
	// Apply command will try "replace" command first, if the command goes wrong, we try "Create" command later.
	Apply TaskCmd = iota + 1
	// Create represents istioctl "create" subcommand.
	Create
	// Replace represents istioctl "create" subcommand.
	Replace
	// Delete represents istioctl "delete" subcommand.
	Delete
	// Rollback rollbacks task with prev istio resource yaml.
	Rollback
)

// Task defines fields of table `tasks`.
type Task struct {
	ID         uint       `json:"id" gorm:"primary_key"`
	CreatedAt  time.Time  `json:"createAt"`
	UpdatedAt  time.Time  `json:"updateAt"`
	DeletedAt  *time.Time `json:"deleteAt" sql:"index"`
	Content    string     `json:"content"`
	Revision   uint       `json:"revision"`
	Operator   string     `json:"operator"`
	TaskTmplID uint       `json:"taskTmplID"`
	ServiceUID string     `json:"serviceUID"`
	Status     uint       `json:"status"`
	TaskTmpl   TaskTmpl   `gorm:"ForeignKey:TaskTmplID"`
	Command    TaskCmd    `json:"command"`
	PrevState  string     `json:"prevState"`
	Namespace  string     `json:"namespace"`
}
