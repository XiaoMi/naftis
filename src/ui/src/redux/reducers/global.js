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

import { SET_BREAD_CRUMBS } from '../actions/global'

const initState = {
  crumbsItems: [
    {title: 'Index', to: '/'}
  ]
}

export default (state = initState, action) => {
  const { type, crumbsItems } = action
  state = JSON.parse(JSON.stringify(state))

  switch (type) {
    case SET_BREAD_CRUMBS:
      return Object.assign({}, state, {crumbsItems})
    default:
      return state
  }
}
