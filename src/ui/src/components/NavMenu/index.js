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
import { Icon, Tooltip } from '@hi-ui/hiui/es'
import '@hi-ui/hiui/es/icon/style'
import '@hi-ui/hiui/es/tooltip/style'
import './index.scss'

class NavMenu extends React.Component {
  render () {
    return (
      <div className='nav-menu'>
        <a href='http://bbs.xiaomi.cn' key='1'><Icon name='search' /></a>
        <a href='https://github.com/xiaomi-info' key='2'><Tooltip title='Tutorial' placement='bottom'><Icon name='edit' /></Tooltip></a>
        <a href='http://www.mi.com' key='3'><Icon name='info-circle-o' /></a>
      </div>
    )
  }
}

export default NavMenu
