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
	"errors"
	"net/http"
	"time"

	"github.com/xiaomi/naftis/src/api/model"
	"github.com/xiaomi/naftis/src/api/util"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// LoginUser returns current login user.
func LoginUser(c *gin.Context) {
	ret := struct {
		Name        string `json:"name"`
		Avatar      string `json:"avatar"`
		UserID      string `json:"userid"`
		NotifyCount int    `json:"notifyCount"`
	}{
		util.User(c).Name,
		"assets/mi-black.png",
		"001",
		12,
	}
	c.JSON(200, ret)
}

type accountPayload struct {
	Password string `json:"password"`
	Username string `json:"username"`
	Type     string `json:"type"`
}

func (a *accountPayload) validate() error {
	if a.Password == "" || a.Username == "" {
		return errors.New("empty username or password")
	}
	v, _ := model.MockUsers[a.Username]
	if v.Password != a.Password {
		return errors.New("invalid username or password")
	}
	return nil
}

// LoginAccount validates user account.
func LoginAccount(c *gin.Context) {
	var p accountPayload
	if e := c.BindJSON(&p); e != nil {
		util.BindFailFn(c, e)
		return
	}
	if e := p.validate(); e != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": 1,
			"data": e.Error(),
		})
		return
	}
	// gen token
	token := jwt.New(jwt.GetSigningMethod("HS256"))
	token.Claims = jwt.MapClaims{
		"username": p.Username,
		"exp":      time.Now().Add(time.Hour * 1).Unix(),
	}

	tokenString, err := token.SignedString([]byte(util.JWTSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code": 0,
			"data": "Could not generate token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": map[string]string{
			"status":           "ok",
			"type":             p.Type,
			"currentAuthority": "admin",
			"token":            tokenString,
		},
	})
}
