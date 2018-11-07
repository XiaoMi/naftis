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

package db

import (
	"errors"
	"fmt"

	"github.com/xiaomi/naftis/src/api/bootstrap"
	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/model"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql" // import mysql driver
	"github.com/spf13/viper"
)

var (
	db *gorm.DB
)

// migrate migrates database schemas.
func migrate() {
	db.AutoMigrate(&model.Task{})
	db.AutoMigrate(&model.TaskTmpl{})
}

var (
	// ErrInvalidParams defines invalid params error.
	ErrInvalidParams = errors.New("invalid params")
	// ErrExecSQLFail defines sql execution error.
	ErrSQLExec = errors.New("sql executed fail")
)

// Init initializes db pkg.
func Init() {
	var err error
	db, err = gorm.Open("mysql", viper.GetString("db.default"))
	if err != nil {
		panic(fmt.Errorf("failed to connect database %s", err))
	}
	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(100)
	db.LogMode(bootstrap.Debug())

	log.Info("[db] init success")
}
