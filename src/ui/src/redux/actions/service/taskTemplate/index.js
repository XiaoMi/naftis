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
  SERVICE_TEMPLATE_LIST_DATA: 'SERVICE_TEMPLATE_LIST_DATA',
  SERVICE_MODULE_LIST_DATA: 'SERVICE_MODULE_LIST_DATA',
  SERVICE_ADD_PARAM_DATA: 'SERVICE_ADD_PARAM_DATA',
  SET_ADD_DATA: 'SET_ADD_DATA'
}

const setModuleListData = moduleList => ({
  type: TYPE.SERVICE_MODULE_LIST_DATA,
  payload: moduleList
})

const setAddParamData = (key, value) => ({
  type: TYPE.SERVICE_ADD_PARAM_DATA,
  payload: { key, value }
})

const setAddData = submitParam => ({
  type: TYPE.SET_ADD_DATA,
  payload: submitParam
})

const getServiceTemplateDataAjax = () => {
  return dispatch => {
    axios
      .getAjax({
        url: 'api/tasktmpls',
        type: 'GET',
        data: ''
      })
      .then(response => {
        if (response.code === 0) {
          response.data.push({ type: 'add' })
          dispatch({
            type: TYPE.SERVICE_TEMPLATE_LIST_DATA,
            payload: response.data
          })
        }
      })
  }
}

const commitServiceTemplateDataAjax = (data, fn) => {
  return dispatch => {
    axios
      .getAjax({
        url: 'api/tasktmpls',
        type: 'POST',
        data: {
          name: data.name,
          brief: data.brief,
          content: data.content,
          vars: data.vars
        }
      })
      .then(response => {
        if (response.code === 0) {
          fn && fn()
        }
      })
  }
}

const deleteServiceTemplateDataAjax = (data, fn) => {
  return dispatch => {
    axios
      .getAjax({
        url: `api/tasktmpls/${data.tplID}`,
        type: 'DELETE'
      })
      .then(response => {
        if (response.code === 0) {
          fn && fn()
        }
      })
  }
}

const getTemplateDetailDataAjax = (data, fn) => {
  return dispatch => {
    axios
      .getAjax({
        url: 'api/tasktmpls',
        type: 'POST',
        data: {
          name: data.name,
          brief: data.brief,
          content: data.content,
          vars: data.vars
        }
      })
      .then(response => {
        if (response.code === 0) {
          fn && fn()
        }
      })
  }
}

export {
  getServiceTemplateDataAjax,
  commitServiceTemplateDataAjax,
  deleteServiceTemplateDataAjax,
  setAddData,
  setModuleListData,
  setAddParamData,
  getTemplateDetailDataAjax,
  TYPE
}
