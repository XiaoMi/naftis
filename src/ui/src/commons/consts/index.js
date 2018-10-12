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

// Task defines some consts about creating task and notifacating executed status of task.
const Task = {
  command: {
    APPLY: 'apply',
    ROLLBACK: 'rollback'
  },
  status: {
    EXECUTING: 1,
    SUCCESS: 2,
    FAIL: 3,
    UNDEFINED: 4
  },
  varFormType: {
    STRING: 1,
    NUMBER: 2,
    PERCENTAGE: 3,
    SELECT: 4,
    DATETIME: 5
  },
  commandint: {
    APPLY: 1,
    ROLLBACK: 5
  }
}

export {
  Task
}
