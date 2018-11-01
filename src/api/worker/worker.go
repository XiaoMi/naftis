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

package worker

import (
	"fmt"

	"github.com/xiaomi/naftis/src/api/executor"
	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/model"
)

type worker struct {
	jobs  chan executor.Task
	stop  func()
	done  chan bool
	block chan bool
}

const (
	// JobQueueSize defines max job queue size.
	JobQueueSize = 1000
)

var w = &worker{
	jobs:  make(chan executor.Task, JobQueueSize),
	block: make(chan bool, 1),
}

// Start starts task worker.
func Start() {
	for {
		select {
		case job := <-w.jobs:
			if job.Command != 0 {
				if e := executor.DefaultExecutor.Execute(job); e != nil {
					log.Error("[worker] execute fail", "error", e)
				}
			}
		}
	}
}

// Stop stops worker and close job queue.
func Stop() {
	fmt.Println(`terminating worker`)
	w.block <- true
	close(w.jobs)
}

// Feed adds new job to job queue.
func Feed(tmplID uint, command int, content string, operator string, serviceUID, namespace string, revision uint) error {
	select {
	case <-w.block:
		fmt.Println(`worker is terminating, cann't add job any more.'`)
		w.block <- true
	default:
		t := executor.Task{
			TaskTmplID: tmplID,
			Content:    content,
			Operator:   operator,
			ServiceUID: serviceUID,
			Revision:   revision,
			Command:    model.TaskCmd(command),
			Namespace:  namespace,
		}
		// push task with processing status into TaskStatusCh
		t.Status = model.TaskStatusProcessing
		executor.Push2TaskStatusCh(t)

		// push task into jobs channel
		t.Status = model.TaskStatusDefault
		w.jobs <- t
	}
	return nil
}
