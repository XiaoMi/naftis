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

package handler

import (
	"github.com/xiaomi/naftis/src/api/model"
	"github.com/xiaomi/naftis/src/api/service"
	"github.com/xiaomi/naftis/src/api/util"

	"github.com/gin-gonic/gin"
	"github.com/spf13/cast"
)

type taskTmplPayload struct {
	ID      uint                `json:"id"`
	Name    string              `json:"name"`
	Command int                 `json:"command"`
	Content string              `json:"content"`
	Brief   string              `json:"brief"`
	Vars    []model.TaskTmplVar `json:"vars"`
	Icon    string              `json:"icon"`
	Default string              `string:"default"`
}

// ListTaskTmpls returns specified task template.
func ListTaskTmpls(c *gin.Context) {
	ids := make([]uint, 0, 1)
	if idStr := c.Param("id"); idStr != "" {
		ids = append(ids, cast.ToUint(idStr))
	}
	c.JSON(200, gin.H{
		"code": 0,
		"data": service.TaskTmpl.Get("", "", "", ids, 0, 0, 0, 0),
	})
}

// ListTaskTmplVars returns variable map of specific task template.
func ListTaskTmplVars(c *gin.Context) {
	var taskTmplID = cast.ToUint(c.Param("id"))
	c.JSON(200, gin.H{
		"code": 0,
		"data": service.TaskTmplVar.Get("", "", "", "", 0, taskTmplID, []uint{}),
	})
}

// AddTaskTmpls adds a task template.
func AddTaskTmpls(c *gin.Context) {
	var p taskTmplPayload
	if e := c.BindJSON(&p); e != nil {
		util.BindFailFn(c, e)
		return
	}
	t, e := service.TaskTmpl.Add(p.Name, p.Content, p.Brief, util.User(c).Name, p.Icon, p.Vars)
	if e != nil {
		util.OpFailFn(c, e)
		return
	}
	c.JSON(200, gin.H{
		"code": 0,
		"data": []interface{}{t},
	})
}

// UpdateTaskTmpls updates a task template.
func UpdateTaskTmpls(c *gin.Context) {
	var id = cast.ToUint(c.Param("id"))
	var p taskTmplPayload
	if e := c.BindJSON(&p); e != nil {
		util.BindFailFn(c, e)
		return
	}
	if e := service.TaskTmpl.Update(p.Name, p.Content, p.Brief, util.User(c).Name, p.Icon, id); e != nil {
		util.OpFailFn(c, e)
		return
	}
	c.JSON(200, util.RetOK)
}

// DeleteTaskTmpls soft deletes a task template.
func DeleteTaskTmpls(c *gin.Context) {
	var id = cast.ToInt(c.Param("id"))
	if e := service.TaskTmpl.Delete(id); e != nil {
		util.OpFailFn(c, e)
	}
	c.JSON(200, util.RetOK)
}
