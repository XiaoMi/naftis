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
	"github.com/xiaomi/naftis/src/api/service"

	"github.com/gin-gonic/gin"
)

// D3Graph returns d3 graph data filtered by provided root service name.
func D3Graph(c *gin.Context) {
	graph := service.Prom.Generate(
		c.Query("time_horizon"),
		c.Query("filter_empty"),
	).Filter(c.Param("svcname"))
	c.JSON(200, service.GenerateD3JSON(graph))
}
