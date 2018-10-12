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

import axios from '../../../../commons/axios'

const TYPE = {
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  CREATE_TASK_LIST: 'CREATE_TASK_LIST',
  CREATE_TASK_STATUS_DATA: 'CREATE_TASK_STATUS_DATA',
  SET_CREATE_TASK_ITEM: 'SET_CREATE_TASK_ITEM'
}

const setCurrentStepData = (currentStep) => ({
  type: TYPE.SET_CURRENT_STEP,
  payload: currentStep
})

const setCreateTaskListData = (createTaskList) => ({
  type: TYPE.CREATE_TASK_LIST,
  payload: createTaskList
})

const setCreateItemData = (createItem) => ({
  type: TYPE.SET_CREATE_TASK_ITEM,
  payload: createItem
})

const setCreateStatusData = (createStatus) => ({
  type: TYPE.CREATE_TASK_STATUS_DATA,
  payload: createStatus
})

const submitCreateTempAjax = (data, fn) => {
  return dispatch => {
    axios.getAjax({
      url: 'api/tasks',
      type: 'POST',
      data: data
    }).then(response => {
      fn && fn(response)
    })
  }
}

export {
  submitCreateTempAjax,
  setCurrentStepData,
  setCreateTaskListData,
  setCreateItemData,
  setCreateStatusData,
  TYPE
}
