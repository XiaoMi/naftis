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

import { handleNotificate } from '@hi-ui/hiui/es/notification'
import axios from '../../../commons/axios'

const TYPE = {
  CHANGE_INPUT: 'CHANGE_INPUT'
}

const changeInput = (name, val) => ({
  type: TYPE.CHANGE_INPUT,
  payload: {
    [name]: val
  }
})

const userLogin = ({username, password, type, success}) => {
  return dispatch => {
    axios.getAjax({
      url: 'api/login/account',
      data: {
        username,
        password,
        type
      }
    }).then(response => {
      if (response.code === 0) {
        window.localStorage.setItem('isLogin', true)
        window.localStorage.setItem('authToken', response.data.token)
        window.localStorage.setItem('username', response.data.currentAuthority)
        // connetctSocket()
        window.location.href = '/'
        success && success()
      } else if (response.code === 1) {
        notify(response.data, 'error')
      }
    })
  }
}

const notify = (msg, type) => {
  handleNotificate({
    autoClose: true,
    title: 'Notification',
    message: msg,
    type: type,
    onClose: () => {}
  })
}

export {
  changeInput,
  userLogin,
  TYPE
}
