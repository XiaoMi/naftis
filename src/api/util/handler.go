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

package util

import (
	"errors"
	"net/http"

	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
	"github.com/gin-gonic/gin"
)

// BindFailFn defines function that handle payload-binding failure.
var BindFailFn = func(c *gin.Context, e error) {
	log.Info("[BindFailFn]", "err", e)
	c.JSON(http.StatusBadRequest, gin.H{
		"code": 1,
		"data": e.Error(),
	})
}

// OpFailFn defines function that handle internal error.
var OpFailFn = func(c *gin.Context, e error) {
	log.Info("[OpFailFn]", "err", e)
	c.JSON(http.StatusInternalServerError, gin.H{
		"code": 2,
		"data": e.Error(),
	})
}

// RetOK defines JSON response of successful HTTP response.
var RetOK = map[string]interface{}{"code": 0, "data": struct{}{}}

const (
	// JWTSecret defines default JWT secret
	JWTSecret = "istioIsAwesome"
)

var (
	// ErrJWTUnauthorized is returned when the token isn't authorized.
	ErrJWTUnauthorized = errors.New("unauthorized")
)

// Authentication authenticates incoming request.
var Authentication = func(r *http.Request) (model.User, error) {
	t, e := request.ParseFromRequest(r, request.OAuth2Extractor, func(token *jwt.Token) (interface{}, error) {
		b := []byte(JWTSecret)
		return b, nil
	})
	if e != nil {
		return model.User{}, ErrJWTUnauthorized
	}

	username := t.Claims.(jwt.MapClaims)["username"].(string)
	u, ok := model.MockUsers[username]
	if !ok {
		return model.User{}, ErrJWTUnauthorized
	}
	return u, nil
}
