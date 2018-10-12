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

import React from 'react'
import Icon from '@hi-ui/hiui/es/icon'
import '@hi-ui/hiui/es/icon/style'
import { addLocaleData, IntlProvider } from 'react-intl'
import { getLocaleLanguage } from './../commons/languages'

const { appLocaleData, locale, messages } = getLocaleLanguage()

addLocaleData(appLocaleData)
const { intl } = new IntlProvider({ locale: locale, messages }, {}).getChildContext()
window.T = (id) => {
  return intl.formatMessage({ id })
}

// Two level menu is allowed at most.
export default [
  {
    key: 9,
    title: T('app.menu.worktop'),
    to: '',
    icon: <Icon name='refer' />,
    children: [
      {key: 21, title: T('app.menu.worktop.overview'), to: '/worktop/overview'}
    ]
  },
  {
    key: 10,
    title: T('app.menu.service'),
    to: '',
    icon: <Icon name='usergroup' />,
    children: [
      {key: 21, title: T('app.menu.service.manager'), to: '/service/serviceList'}
    ]
  },
  {
    key: 12,
    title: T('app.menu.istio'),
    to: '/istio',
    icon: <Icon name='tool' />
  }
]
