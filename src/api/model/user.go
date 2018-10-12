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
	"encoding/gob"
)

func init() {
	gob.Register(&User{})
}

// User defines user information.
type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	DepID    int    `json:"depId"`
	Email    string `json:"email"`
	NickName string `json:"nickname"`
	Password string `json:"password"`
}

// MockUsers stores some fake users.
var MockUsers = map[string]User{
	"admin": {
		ID:       1,
		Name:     "admin",
		Password: "admin",
	},
	"user": {
		ID:       2,
		Name:     "user",
		Password: "user",
	},
	"test-01": {
		ID:       3,
		Name:     "test-01",
		Password: "test-01",
	},
	"test-02": {
		ID:       4,
		Name:     "test-02",
		Password: "test-02",
	},
}
