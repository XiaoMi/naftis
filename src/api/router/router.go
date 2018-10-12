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

package router

import (
	"github.com/xiaomi/naftis/src/api/handler"
	"github.com/xiaomi/naftis/src/api/middleware"

	"github.com/gin-gonic/gin"
)

// Init initializes router pkg
func Init(e *gin.Engine) {
	e.Use(
		gin.Recovery(),
		// middleware.XSS(), // TODO fix XSS middleware leading to JSON Binding bugs.{"varMaps":[{&#34;Host&#34;:&#34;details&#34;,&#34;DestinationSubset&#34;:&#34;v3&#34;}],"command":"apply","tmplID":43,"serviceUID":"182dcf63-9a26-11e8-bd9d-525400c9c704"}
	)

	// public APIs
	e.GET("/api/probe/healthy", handler.Healthy)
	e.POST("/api/login/account", handler.LoginAccount)

	// private APIs
	api := e.Group("/api")
	api.Use(middleware.Auth())

	api.GET("/login_user", handler.LoginUser)
	api.GET("/diagnose", handler.ListStatus)
	api.GET("/metrics", handler.ListMetrics)
	api.GET("/d3graph/:svcname", handler.D3Graph)

	api.GET("/services", handler.Services)
	api.GET("/services/:uid", handler.Services)
	api.GET("/services/:uid/pods", handler.ServicePods)

	api.GET("/pods", handler.Pods)
	api.GET("/pods/:name", handler.Pods)

	api.GET("/tasks", handler.ListTasks)
	api.GET("/tasks/:id", handler.ListTasks)
	api.POST("/tasks", handler.AddTasks)

	api.GET("/tasktmpls", handler.ListTaskTmpls)
	api.GET("/tasktmpls/:id", handler.ListTaskTmpls)
	api.POST("/tasktmpls", handler.AddTaskTmpls)
	api.PUT("/tasktmpls/:id", handler.UpdateTaskTmpls)
	api.DELETE("/tasktmpls/:id", handler.DeleteTaskTmpls)
	api.GET("/tasktmpls/:id/vars", handler.ListTaskTmplVars)

	hub := handler.NewHub()
	go hub.Run()
	e.GET("/ws", func(c *gin.Context) {
		handler.ServeWS(hub, c.Writer, c.Request)
	})
}
