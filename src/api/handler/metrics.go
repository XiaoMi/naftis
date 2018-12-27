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
	"github.com/gin-gonic/gin"
	"github.com/xiaomi/naftis/src/api/bootstrap"
	"github.com/xiaomi/naftis/src/api/service"
)

// ListMetrics returns some overview metrics of service mesh.
func ListMetrics(c *gin.Context) {
	c.JSON(200, gin.H{
		"code": 0,
		"data": map[string]interface{}{
			"serviceCount": len(service.ServiceInfo.Services("").Exclude("kube-system", bootstrap.Args.IstioNamespace, bootstrap.Args.Namespace)),
			"podCount":     len(service.ServiceInfo.Pods().Exclude("kube-system", bootstrap.Args.IstioNamespace, bootstrap.Args.Namespace)),
		},
	})
}
