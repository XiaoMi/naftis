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

package executor

import (
	"errors"
	"sync"

	"github.com/xiaomi/naftis/src/api/model"
)

// DefaultExecutor defines default task executor.
var DefaultExecutor Executor

// Init initializes executor package.
func Init() {
	DefaultExecutor = NewCrdExecutor()
}

// Executor will dispatch and execute task from channel.
type Executor interface {
	Execute(Task) error
}

// Task is an alias of model.Task
type Task = model.Task

type taskDbHandler = func(task *Task) error

var (
	// ErrUnknownCmd defines invalid command error
	ErrUnknownCmd = errors.New("unknown command")
)

var (
	// TaskStatusChM stores task execution result into a channel map
	TaskStatusChM    = make(map[string]chan Task)
	taskStatusChMMtx = new(sync.RWMutex)
)

// GetOrAddTaskStatusChM returns task channel from taskStatusChM group by operator,
// if channel is not exists, we makes a new one then return it.
func GetOrAddTaskStatusChM(name string) chan Task {
	taskStatusChMMtx.Lock()
	u, ok := TaskStatusChM[name]
	if !ok {
		u = make(chan Task, 1000)
		TaskStatusChM[name] = u
	}
	taskStatusChMMtx.Unlock()
	return u
}

// Push2TaskStatusCh pushes task into taskStatusChM.
func Push2TaskStatusCh(task Task) {
	GetOrAddTaskStatusChM(task.Operator) <- task
}
