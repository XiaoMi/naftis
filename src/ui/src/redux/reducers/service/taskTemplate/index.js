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

import { TYPE } from '../../../actions/service/taskTemplate'

const initState = {
  templateList: [],
  moduleList: [],
  submitParam: {
    name: '',
    brief: '',
    content: '',
    vars: []
  }
}

export default (state = initState, action) => {
  switch (action.type) {
    case TYPE.SERVICE_TEMPLATE_LIST_DATA:
      let templateList = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {templateList})
    case TYPE.SERVICE_MODULE_LIST_DATA:
      let moduleList = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {moduleList})
    case TYPE.SERVICE_ADD_PARAM_DATA:
      const {key, value} = action.payload
      let submitParam = JSON.parse(JSON.stringify(state.submitParam))
      submitParam[key] = value
      return Object.assign({}, state, {submitParam})
    case TYPE.SET_ADD_DATA:
      let addData = JSON.parse(JSON.stringify(action.payload))
      return Object.assign({}, state, {submitParam: addData})
    default:
      return state
  }
}
