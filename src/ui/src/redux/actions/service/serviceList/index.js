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
  SERVICE_PODS_DATA: 'SERVICE_PODS_DATA',
  SERVICE_TASK_PAGE_LIST_DATA: 'SERVICE_TASK_PAGE_LIST_DATA',
  SET_SERVICE_KEY_PODS_DATA: 'SET_SERVICE_KEY_PODS_DATA',
  SERVICE_GRAPH_DATA: 'SERVICE_GRAPH_DATA',
  GET_LAST_SERVICE_ITEM: 'GET_LAST_SERVICE_ITEM',
  SET_GRAPH_DATA: 'SET_GRAPH_DATA',
  SET_SERVICE_KEY_DATA: 'SET_SERVICE_KEY_DATA',
  SET_TREE_LIST: 'SET_TREE_LIST'
}

const setPodsPageData = (podsInfo) => ({
  type: TYPE.SERVICE_PODS_DATA,
  payload: {
    page: podsInfo
  }
})

const setTaskPageListData = (taskInfo) => ({
  type: TYPE.SERVICE_TASK_PAGE_LIST_DATA,
  payload: taskInfo
})

const setKeyPodsPageListData = (keyPodsInfo) => ({
  type: TYPE.SET_SERVICE_KEY_PODS_DATA,
  payload: {
    page: keyPodsInfo
  }
})

const setTreeList = (treeList) => ({
  type: TYPE.SET_TREE_LIST,
  payload: treeList
})

const getLastServiceItem = (lastServiceItem) => ({
  type: TYPE.GET_LAST_SERVICE_ITEM,
  payload: lastServiceItem
})

const getServicePodsDataAjax = (title) => {
  return dispatch => {
    axios.getAjax({
      url: `api/pods/${title}`,
      type: 'GET',
      data: ''
    }).then(response => {
      if (response.code === 0) {
        let podsInfo = {
          page: {
            pageIndex: 0,
            pageSize: 10
          },
          podsList: []
        }
        let list = JSON.parse(JSON.stringify(response.data))
        if (list && list.length) {
          list.map(item => {
            podsInfo.podsList.push(item)
          })
        }
        dispatch({
          type: TYPE.SERVICE_PODS_DATA,
          payload: podsInfo
        })
      }
    })
  }
}

const getServiceTaskDataAjax = (key) => {
  return dispatch => {
    axios.getAjax({
      url: 'api/tasks',
      type: 'GET',
      data: {
        serviceUID: key
      }
    }).then(response => {
      if (response.code === 0) {
        let taskInfo = {
          page: {
            pageIndex: 0,
            pageSize: 10
          },
          taskList: []
        }
        let list = JSON.parse(JSON.stringify(response.data))
        if (list && list.length) {
          list.map((item, i) => {
            taskInfo.taskList.push({
              key: `task${i}`,
              operationType: item.tmpl.name,
              operationUser: item.operator,
              execResult: item.status,
              operationTime: item.createAt,
              prevState: item.prevState,
              serviceUID: item.serviceUID,
              content: item.content,
              namespace: item.namespace,
              operation: '',
              canRollback: true
            })
          })
        }
        dispatch({
          type: TYPE.SERVICE_TASK_PAGE_LIST_DATA,
          payload: taskInfo
        })
      }
    })
  }
}

const getServiceGraphDataAjax = (title) => {
  let titleArr = title.split('-')
  let detail = `${titleArr[0]}-${titleArr[1]}`
  return dispatch => {
    axios.getAjax({
      url: `api/graph/${detail}`,
      type: 'GET',
      data: ''
    }).then(response => {
      if (response.code === 0) {
        dispatch({
          type: TYPE.SERVICE_GRAPH_DATA,
          payload: response.data
        })
      }
    })
  }
}

const getServiceTreeListAjax = (fn) => {
  return dispatch => {
    axios.getAjax({
      url: 'api/services',
      type: 'GET',
      data: {
        t: 'tree'
      }
    }).then(response => {
      if (response.code === 0) {
        dispatch({
          type: TYPE.SET_TREE_LIST,
          payload: response.data
        })
        fn && fn(response.data)
      }
    })
  }
}

const getServiceKeyDataAjax = (key) => {
  return dispatch => {
    axios.getAjax({
      url: `api/services/${key}`,
      type: 'GET',
      data: ''
    }).then(response => {
      if (response.code === 0) {
        dispatch({
          type: TYPE.SET_SERVICE_KEY_DATA,
          payload: response.data
        })
      }
    })
  }
}

const getServiceKeyPodsDataAjax = (key) => {
  return dispatch => {
    axios.getAjax({
      url: `api/services/${key}/pods`,
      type: 'GET',
      data: ''
    }).then(response => {
      if (response.code === 0) {
        let keyPodsInfo = {
          page: {
            pageIndex: 0,
            pageSize: 10
          },
          podsList: []
        }
        keyPodsInfo.podsList = response.data
        dispatch({
          type: TYPE.SET_SERVICE_KEY_PODS_DATA,
          payload: keyPodsInfo
        })
      }
    })
  }
}

const getGraphDataAjax = (namespace, service, fn) => {
  return dispatch => {
    axios.getAjax({
      url: `api/d3graph?source_namespace=${namespace}&source_workload=${service}`,
      type: 'GET',
      data: ''
    }).then(response => {
      dispatch({
        type: TYPE.SET_GRAPH_DATA,
        payload: response
      })
      fn && fn(response)
    })
  }
}

export {
  getServicePodsDataAjax,
  getServiceTaskDataAjax,
  getServiceGraphDataAjax,
  getServiceTreeListAjax,
  setPodsPageData,
  setTaskPageListData,
  setKeyPodsPageListData,
  setTreeList,
  getLastServiceItem,
  getGraphDataAjax,
  getServiceKeyPodsDataAjax,
  getServiceKeyDataAjax,
  TYPE
}
