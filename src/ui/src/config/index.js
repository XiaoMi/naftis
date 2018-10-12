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

/**
 * frontend config entry file
 */

const DEVELOPMET = require('./development')
const PRODUCTION = require('./production')

let CONFIG = {}
let nodeEnv = ''
let hostEnv = ''
try {
  nodeEnv = NODE_ENV
  hostEnv = HOST_ENV
} catch (error) {
  // console.log('err', error)
}

if (!nodeEnv || nodeEnv === 'development') {
  if (hostEnv && hostEnv !== 'undefined') {
    for (let key in DEVELOPMET.WEBPACK_PROXY) {
      DEVELOPMET.WEBPACK_PROXY[key] = hostEnv
    }
  }
  CONFIG = DEVELOPMET
} else if (nodeEnv === 'production') {
  if (hostEnv && hostEnv !== 'undefined') {
    PRODUCTION.HOST = hostEnv
  }
  CONFIG = PRODUCTION
}

CONFIG.LANGUAGES = {
  'zh-CN': '中文',
  'en-US': 'EN'
}

module.exports = {
  ...CONFIG
}
