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
	"time"

	"github.com/gin-gonic/gin"
	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/service"
)

// ListStatus returns all services and pod status of istio.
func ListStatus(c *gin.Context) {
	log.Info("[API] /api/diagnose start", "ts", time.Now())

	log.Info("[API] /api/diagnose Services start", "ts", time.Now())
	svcs := service.IstioInfo.Services("").Status()
	log.Info("[API] /api/diagnose Services end", "ts", time.Now())

	log.Info("[API] /api/diagnose Pods start", "ts", time.Now())
	pods := service.IstioInfo.Pods().Status()
	log.Info("[API] /api/diagnose Pods end", "ts", time.Now())

	c.JSON(200, gin.H{
		"code": 0,
		"data": map[string]interface{}{
			"components": svcs,
			"pods":       pods,
		},
	})
	log.Info("[API] /api/diagnose end", "ts", time.Now())
}
