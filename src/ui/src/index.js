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
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import App from './App'
import Login from './views/Login'
import configureStore from './redux/store'
import { getLocaleLanguage } from './commons/languages'
import './commons/common.scss'
import * as socketAction from './redux/actions/socket'

export const store = configureStore()

if (window.localStorage.getItem('isLogin')) {
  socketAction.connectSocket()
}

if (module.hot) {
  module.hot.accept()
}

// initializes language components
const { appLocaleData, locale, messages } = getLocaleLanguage()
addLocaleData(appLocaleData)

ReactDOM.render((
  <Provider store={store}>
    <IntlProvider
      locale={locale}
      messages={messages}
    >
      {window.localStorage.getItem('isLogin') === 'true' ? <App /> : <Login />}
    </IntlProvider>
  </Provider>
), document.getElementById('app'))
