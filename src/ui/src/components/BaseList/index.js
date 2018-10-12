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

import React, { Component } from 'react'
import './index.scss'

class BaseList extends Component {
  render () {
    const {list, onClick} = this.props
    return (
      <div className='menu-wrap'>
        {
          list.length ? list.map((item, index) => {
            return (
              <div className={item.disabled ? 'menu-item menu-item-disabled' : 'menu-item'} key={item.id} onClick={() => {
                if (item.disabled) return
                onClick(item, index)
              }}>
                {item.prefix}
                <span className='menu-item-title'>{item.title}</span>
              </div>
            )
          }) : null
        }
      </div>
    )
  }
}

export default BaseList
