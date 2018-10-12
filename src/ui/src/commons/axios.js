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

import axios from 'axios'
import CONFIG from '../config'
import $$ from './tools'
import { getLangFromCookie, setDefaultLanguageCookie } from './languages'
import { handleNotificate } from '@hi-ui/hiui/es/notification'
import '@hi-ui/hiui/es/notification/style/index.js'

const TIMEOUT = 20000

/**
 * only in development environment, mock API should be called.
 * and params.mock is necessary.
 * @param {*} params
 */
export const getHost = params => {
  if (NODE_ENV === 'development') {
    return (params && params.mock) ? CONFIG.MOCK_HOST : CONFIG.HOST
  } else {
    return CONFIG.HOST
  }
}

axios.interceptors.request.use(config => {
  if (window.localStorage.getItem('authToken')) {
    config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('authToken')
  }
  if (!getLangFromCookie()) {
    setDefaultLanguageCookie()
  }
  return config
}, error => {
  return Promise.reject(error)
})

export const getRequest = () => {
  let url = decodeURIComponent(window.location.search)
  // get rawQuery object from url string
  let rawQuery = {}
  if (url.indexOf('?') !== -1) {
    let str = url.substr(1)
    let strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      rawQuery[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return rawQuery
}

axios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = T('app.common.err400')
          break
        case 401:
          window.sockette && window.sockette.close()
          window.timerReconnect && clearInterval(window.timerReconnect)
          window.timerPing && clearInterval(window.timerPing)
          err.message = T('app.common.err401')
          window.localStorage.clear()
          window.location.href = '/'
          break
        case 403:
          err.message = T('app.common.err403')
          // window.location.href = '/403?msg=' + err.message
          break
        case 404:
          err.message = T('app.common.err404')
          notify(err.message)
          // window.location.href = '/404?msg=' + err.message
          break
        case 408:
          err.message = T('app.common.err408')
          break
        case 500:
          err.message = T('app.common.err500')
          break
        case 501:
          err.message = T('app.common.err501')
          break
        case 502:
          err.message = T('app.common.err502')
          break
        case 503:
          err.message = T('app.common.err503')
          break
        case 504:
          err.message = T('app.common.err504')
          break
        case 505:
          err.message = T('app.common.err505')
          break
        default:
          err.message = `${T('app.common.errOthers')}(${err.response.status})!`
      }
    } else {
      err.message = T('app.common.errOthers')
    }
    notify(err.message, 'error')
    return Promise.reject(err)
  }
)

const notify = (msg, type) => {
  handleNotificate({
    autoClose: true,
    title: 'Notification',
    message: msg,
    type: type,
    onClose: () => { }
  })
}

const get = params => {
  let url = ''
  let data = null

  if (params && typeof params === 'string') {
    url = CONFIG.HOST + params
  } else if (params && typeof params === 'object') {
    url = getHost(params) + params.url
    data = params.data || null
  }

  return axios({
    method: 'get',
    url: url,
    params: data,
    timeout: TIMEOUT
  })
    .then(response => {
      const result = response.data
      if (!result) {
        return {}
      }
      if (result.code === 200) {
        return result
      } else if (result.code === 401) {
        return {}
      }
    })
    .catch(error => {
      console.error(error.message)
      return {}
    })
}

const post = params => {
  let url = ''
  let data = null

  if (params && typeof params === 'string') {
    url = CONFIG.HOST + params
  } else if (params && typeof params === 'object') {
    url = getHost(params) + params.url
    data = params.data || null
  }
  return axios({
    method: 'post',
    url: url,
    data,
    timeout: TIMEOUT
  })
    .then(response => {
      const result = response.data
      if (!result) {
        // console.log('empty result')
        return {}
      }

      if (result.code === 200) {
        return result
      } else {
        return result.data
      }
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * it initiates multiple network requests and returns a sequential array At the same time
 * @param {Array} params
 */
const getAll = params => {
  if (!params) {
    // console.error(`Parameter can not be empty.`)
    return
  }

  let getList = []

  params.map(paramItem => {
    getList.push(get(paramItem))
  })

  return axios
    .all(getList)
    .then(
      axios.spread(() => {
        return Array.prototype.slice.call(arguments)
      })
    )
    .catch(error => {
      console.error(error.message)
      return {}
    })
}

const getAjax = ajaxOptions => {
  const { type = 'POST', data, contentType } = ajaxOptions
  const isGet = type.toLowerCase() === 'get'
  let req = {}
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key]
      req[key] = element
    }
  }
  const reqBody = JSON.stringify(req)
  let url = isGet && data ? ajaxOptions.url + '?' + $$.param(data) : ajaxOptions.url
  return axios({
    method: type || 'post',
    url: getHost(ajaxOptions) + url,
    headers: {
      'Content-Type': contentType || 'application/json'
    },
    data: reqBody
  })
    .then(function (response) {
      if (response.status === 200) {
        return response.data
      } else {
        return response
      }
    })
    .catch(function (err) {
      console.log(err)
      return 'error'
    })
}

const all = params => {
  if (!params) {
    console.error(`Parameter can not be empty.`)
    return
  }
  let requests = []
  params.map(item => {
    if (item.method === 'get') {
      requests.push(get(item))
    } else {
      requests.push(post(item))
    }
  })
  return axios.all(requests).then(
    axios.spread((...data) => {
      return data
    })
  )
}

export default {
  get,
  post,
  getAjax,
  getAll,
  getRequest,
  getHost,
  all
}
