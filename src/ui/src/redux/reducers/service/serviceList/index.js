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

import { TYPE } from '../../../actions/service/serviceList'

const initState = {
  podsInfo: {
    page: {
      pageIndex: 0,
      pageSize: 10
    },
    podsList: []
  },
  taskInfo: {
    page: {
      pageIndex: 0,
      pageSize: 10
    },
    taskList: []
  },
  keyPodsInfo: {
    page: {
      pageIndex: 0,
      pageSize: 10
    },
    podsList: []
  },
  topology: {},
  lastServiceItem: {},
  graphData: '',
  treeList: [],
  podsKey: []
}

export default (state = initState, action) => {
  switch (action.type) {
    case TYPE.SERVICE_PODS_DATA:
      let podsInfo = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {podsInfo})
    case TYPE.SERVICE_TASK_PAGE_LIST_DATA:
      let taskInfo = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {taskInfo})
    case TYPE.SERVICE_GRAPH_DATA:
      let topology = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {topology})
    case TYPE.SET_TREE_LIST:
      let treeList = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {treeList})
    case TYPE.GET_LAST_SERVICE_ITEM:
      let lastServiceItem = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {lastServiceItem})
    case TYPE.SET_GRAPH_DATA:
      let graphData = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {graphData})
    case TYPE.SET_SERVICE_KEY_DATA:
      let podsKey = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {podsKey})
    case TYPE.SET_SERVICE_KEY_PODS_DATA:
      let keyPodsInfo = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {keyPodsInfo})
    default:
      return state
  }
}
