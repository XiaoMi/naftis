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

import 'whatwg-fetch'
import { handleNotificate } from '@hi-ui/hiui/es/notification'
import base64 from './../utils/base64'
import md5 from './../utils/md5'

const baseApi = {
  appid: '',
  appkey: ''
}
const $$ = {}
/**
 * global letiable（Data stored on the global level）manage getter&setter
 * @type {{getItem: $$.storage.getItem, setItem: $$.storage.setItem, removeItem: $$.storage.removeItem}}
 */
const storage = {}
$$.storage = {
  getItem: function (key) {
    return storage[key]
  },
  setItem: function (key, obj) {
    storage[key] = obj
    return obj
  },
  removeItem: function (key) {
    return delete storage[key]
  }
}
Object.freeze($$.storage)

/**
 * Object extension
 * @returns {*}
 */

$$.extend = (...obj) => {
  if (typeof Object.assign === 'function') {
    return Object.assign(...obj)
  } else {
    const target = Object(obj[0])
    for (let index = 1; index < obj.length; index++) {
      const source = obj[index]
      if (source != null) {
        for (let key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }
    }
    return target
  }
}

/**
 * Object deep copy
 * @param {*} source
 */
const objectDeepCopy = function (source) {
  let sourceCopy = source instanceof Array ? [] : {}
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objectDeepCopy(source[item]) : source[item]
  }
  return sourceCopy
}
$$.objectDeepCopy = objectDeepCopy

/**
 * Judge whether it is an empty object.
 * @param obj
 * @returns {boolean}
 */
$$.isEmptyObject = (obj) => {
  return !(Object.getOwnPropertyNames(obj).length > 0)
}

/**
 * get cookie
 * @returns ''
 * @param name
 */
$$.getCookie = (name) => {
  let nameEQ = name + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

/**
 * Conversion of objects to request paraments string
 * @param obj
 * @param prefix
 */
$$.param = (obj, prefix) => {
  let str = []
  let p
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[' + p + ']' : p
      let v = obj[p]
      str.push((v !== null && typeof v === 'object') ? $$.param(v, k)
        : encodeURIComponent(k) + '=' + encodeURIComponent(v))
    }
  }
  return str.join('&')
}
/**
 * The request entity is encapsulated into the X5 protocol.
 * @param body
 */
$$.getEncodeData = (body) => {
  let sign = $$.getSign(body)
  let data = {
    header: {
      appid: baseApi.appid,
      sign: sign
    },
    body: JSON.stringify(body)
  }
  return base64.base64.encoder(JSON.stringify(data))
}

$$.getSign = (body) => {
  let jsonstr = JSON.stringify(body)
  let md5str = md5(baseApi.appid + jsonstr + baseApi.appkey)
  return md5str.toUpperCase()
}
$$.handleNotificate = (msg, type, title, autoClose) => {
  handleNotificate({
    autoClose: autoClose || true,
    title: title || 'Notification',
    message: msg,
    type: type,
    onClose: () => {}
  })
}

$$.transformTime = (time) => {
  if (!time || typeof (time) !== 'number') return
  const newTime = new Date(Number(String(time * 1000).slice(0, 13)))
  const dd = t => (`0${t}`).slice(-2)

  const YYYY = newTime.getFullYear()
  const MM = dd(newTime.getMonth() + 1)
  const DD = dd(newTime.getDate())

  const hh = dd(newTime.getHours())
  const mm = dd(newTime.getMinutes())
  const ss = dd(newTime.getSeconds())
  if (hh === '00' && mm === '00' && ss === '00') {
    return `${YYYY}-${MM}-${DD}`
  }
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}
$$.getSubTime = (time1, time2) => {
  let date1 = new Date(time1) // begin time
  let date2 = new Date(time2) // end time
  let date3 = date2.getTime() - new Date(date1).getTime() // Millisecond of time difference

  // ------------------------------

  // Calculate the difference days
  let days = Math.floor(date3 / (24 * 3600 * 1000))

  // Calculated hours
  let leave1 = date3 % (24 * 3600 * 1000)
  let hours = Math.floor(leave1 / (3600 * 1000))
  let leave2 = leave1 % (3600 * 1000)
  let minutes = Math.floor(leave2 / (60 * 1000))

  days = days < 0 ? 0 : days
  hours = hours < 0 ? 0 : hours
  minutes = minutes < 0 ? 0 : minutes
  if (days) {
    return days + 'day' + hours + 'hour' + minutes + 'min'
  } else {
    return hours + 'hour' + minutes + 'min'
  }
}

$$.parseSearchToString = (json) => {
  const paramsArr = JSON.parse(JSON.stringify(json))
  let paramsStr = '&'
  Object.keys(paramsArr).map((key) => {
    let item = paramsArr[key]
    paramsStr += key + '=' + item + '&'
  })
  return paramsStr
}

export default $$
