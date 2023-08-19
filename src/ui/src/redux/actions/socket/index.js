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

import Sockette from 'sockette'
import { handleNotificate } from '@hi-ui/hiui/es/notification'
import {store} from '../../../index'
import {getHost} from '../../../commons/axios.js'

const TIMEOUT1 = 3000
const TYPE = {
  SET_SOCKET_OBJECT: 'SET_SOCKET_OBJECT',
  SET_SOCKET_DATA: 'SET_SOCKET_DATA',
  SET_SOCKET_STATUS: 'SET_SOCKET_STATUS'
}

const setSocketData = (data) => {
  store.dispatch({
    type: TYPE.SET_SOCKET_DATA,
    payload: data
  })
}

const setSocketStatus = (data) => ({
  type: TYPE.SET_SOCKET_STATUS,
  payload: data
})

const connectSocket = () => {
  const authToken = window.localStorage.getItem('authToken')
  let host = getHost()
  if (host === '') {
    host = window.location.host
  }

  let matches = host.match(new RegExp('^(?:https?:)?(?:\/\/)?([^\/\?]+)'))
  const url = `ws://${matches[1]}/ws?access_token=${authToken}`
  const ws = new Sockette(url, {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => {
      setSocketStatus(true)
      window.timerPing = setInterval(() => {
        ws.send('ping')
      }, TIMEOUT1)
    },
    onmessage: e => { socketMessage(e) },
    onreconnect: e => {
      // console.log('Reconnecting...', e)
    },
    onmaximum: e => {
      // console.log('Stop Attempting!', e)
    },
    onclose: e => { setSocketStatus(false) },
    onerror: e => {
      clearInterval(window.timerReconnect)
      clearInterval(window.timerPing)
      window.timerReconnect = setInterval(() => {
        window.sockette && window.sockette.reconnect()
      }, TIMEOUT1)
      setSocketStatus(false)
    }
  })
  window.sockette = ws
}

const socketMessage = (e) => {
  let task = ''
  try {
    task = JSON.parse(e.data)
  } catch (e) {
    // console.log(e, task)
  }
  setSocketData(task)
  let type = ''
  let message = ''
  switch (task.status) {
    case 0:
      type = 'info'
      message = T('app.common.task.init')
      break
    case 1:
      type = 'info'
      message = T('app.common.task.executing')
      break
    case 2:
      type = 'success'
      message = T('app.common.task.executedSucc')
      break
    case 3:
      type = 'error'
      message = T('app.common.task.executedFail')
      break
    default:
      message = T('app.common.task.fetchInfoFail')
      break
  }

  handleNotificate({
    autoClose: true,
    title: 'Notification',
    message: message,
    type: type,
    onClose: () => { }
  })
}

export {
  setSocketData,
  setSocketStatus,
  connectSocket,
  TYPE
}
