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

import $$ from '../tools'
import CONFIG from '../../config'
import Cookies from 'js-cookie'
import { IntlProvider, addLocaleData } from 'react-intl'

const LANGUAGES = CONFIG.LANGUAGES

// get ISTIO_LANG_KEY from cookie
const getIstioLangFromCookie = () => {
  let ISTIO_LANG = $$.getCookie(CONFIG.ISTIO_LANG_KEY)
  if (!ISTIO_LANG) {
    ISTIO_LANG = 'en-US'
  }
  return ISTIO_LANG
}

const getLangFromCookie = () => {
  let ISTIO_LANG = $$.getCookie(CONFIG.ISTIO_LANG_KEY)
  if (!ISTIO_LANG) {
    return false
  }
  return true
}

const getLocaleLanguage = () => {
  const ISTIO_LANG = getIstioLangFromCookie()
  const language = require(`./lib/${ISTIO_LANG}`)
  return language && language.default
}

const setLanguageCookie = (lang) => {
  Cookies.set(CONFIG.ISTIO_LANG_KEY, lang)
}

const setDefaultLanguageCookie = () => {
  Cookies.set(CONFIG.ISTIO_LANG_KEY, getLocaleLanguage().locale)
}

const { appLocaleData, locale, messages } = getLocaleLanguage()
addLocaleData(appLocaleData)
const { intl } = new IntlProvider({ locale: locale, messages }, {}).getChildContext()
window.T = (id) => {
  return intl.formatMessage({ id })
}

export {
  getLangFromCookie,
  getIstioLangFromCookie,
  getLocaleLanguage,
  setLanguageCookie,
  setDefaultLanguageCookie,
  LANGUAGES
}
