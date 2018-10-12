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

package middleware

import (
	"net/http"

	"github.com/dvwright/xss-mw"
	"github.com/gin-gonic/gin"
	"github.com/xiaomi/naftis/src/api/util"
)

var (
	xssMw xss.XssMw
)

// Auth defines JWT authentication middleware.
var Auth = func() gin.HandlerFunc {
	return func(c *gin.Context) {
		u, e := util.Authentication(c.Request)
		if e != nil {
			c.AbortWithError(http.StatusUnauthorized, e)
			return
		}

		c.Set("user", u)
	}
}

// XSS defines Xss middleware.
var XSS = xssMw.RemoveXss
