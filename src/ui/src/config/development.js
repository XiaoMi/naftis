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

// you can set environment variable ( name: HOST_ENV ) to set your host
module.exports = {
  MOCK_HOST: 'http://localhost:5200/',
  HOST: 'http://localhost:5200/',
  ISTIO_LANG_KEY: 'en-US',
  WEBPACK_PROXY: {
    '/api': 'http://www.naftis.com/',
    '/prometheus': 'http://www.naftis.com/'
  }
}
