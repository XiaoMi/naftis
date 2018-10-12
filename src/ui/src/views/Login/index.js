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
import { Input, Button, Checkbox } from '@hi-ui/hiui/es'
import '@hi-ui/hiui/es/input/style'
import '@hi-ui/hiui/es/button/style'
import '@hi-ui/hiui/es/checkbox/style'
import { connect } from 'react-redux'
import * as Actions from '../../redux/actions/login'
import './index.scss'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      type: 'account'
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render () {
    let { username = '', password = '' } = this.props
    return (
      <div className={'login-user'} >
        <div className='login-shadow'>
          <div className={'login-pannel'} >
            <h2>Naftis</h2>
            <div className='form'>
              <div className='form-item'>
                <Input
                  name='username'
                  value={username}
                  placeholder={T('app.common.signInUsername')}
                  onInput={this.handleChange}
                />
              </div>
              <div className='form-item'>
                <Input
                  type='password'
                  name='password'
                  placeholder={T('app.common.signInPwd')}
                  value={password}
                  onInput={this.handleChange}
                />
              </div>
              <div className='form-item'>
                <Checkbox onChange={(val, isCheck) => {
                  // todo AutoSignIn
                }
                }>{T('app.common.signInAutoSignIn')}</Checkbox>
                <div className='lost-password' onClick={this.handleSubmit}>{T('app.common.signInForgotPwd')}</div>
              </div>
              <div className='form-item'>
                <Button type='primary' onClick={this.handleSubmit}>{T('app.common.signIn')}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  handleChange (e) {
    this.props.changeInput(e.target.name, e.target.value)
  }

  handleSubmit () {
    this.props.userLogin({
      username: this.props.username,
      password: this.props.password,
      type: this.state.type,
      success: () => {
      }
    })
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.login.username,
    password: state.login.password
  }
}

export default connect(mapStateToProps, Actions)(Login)
