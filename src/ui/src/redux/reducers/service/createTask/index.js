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

import { TYPE } from '../../../actions/service/createTask'

const initState = {
  currentStep: 0,
  createTaskList: [],
  createStatus: ''
}

export default (state = initState, action) => {
  switch (action.type) {
    case TYPE.SET_CURRENT_STEP:
      return Object.assign({}, state, {currentStep: action.payload})
    case TYPE.CREATE_TASK_LIST:
      let createTaskList = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {createTaskList})
    case TYPE.CREATE_TASK_STATUS_DATA:
      let createStatus = action.payload
      return Object.assign({}, state, {createStatus})
    default:
      return state
  }
}
