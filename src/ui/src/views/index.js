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
import { connect } from 'react-redux'
import Terminal, { Logo, Login, BreadCrumb } from '@hi-ui/genuine-theme'
import { Icon, Dropdown } from '@hi-ui/hiui/es'
import siderConfig from './siderConfig'
import routes from './router'
import { setLanguageCookie, getIstioLangFromCookie } from '../commons/languages/index'
import NavMenu from '../components/NavMenu'
import BaseList from '../components/BaseList'
import logoImg from '../assets/logo-w-128.png'
import headImage from '../assets/mi-black.png'
import '@hi-ui/hiui/es/icon/style'
import './rewrite.scss'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ISTIO_LANG: 'zh-CN'
    }
  }

  componentDidMount () {
    const ISTIO_LANG = getIstioLangFromCookie()
    this.setState({
      ISTIO_LANG
    })
  }

  logout = (item) => {
    if (item.id === 3) {
      window.sockette && window.sockette.close()
      window.timerReconnect && clearInterval(window.timerReconnect)
      window.timerPing && clearInterval(window.timerPing)
      window.localStorage.clear()
      window.location.href = '/'
    }
  }

  render () {
    const {
      crumbsItems,
      username
    } = this.props

    // breadCrumb
    const breadCrumb = {
      items: crumbsItems,
      sign: '/' // bread crumb delimiter
    }

    // left top logo
    const top = (
      <Logo
        imgUrl={logoImg}
        text='Naftis'
      />
    )

    // sider menu
    const sider = {
      items: siderConfig,
      top
    }

    // right top dropdown menu
    const list = [{
      id: 1,
      title: 'Profile',
      prefix: <Icon name='list' />,
      disabled: true
    }, {
      id: 2,
      title: 'Settings',
      prefix: <Icon name='tool' />,
      disabled: true
    }, {
      id: 3,
      title: 'Sign Out',
      prefix: <Icon name='user' />
    }]
    const login = {
      headUrl: headImage,
      name: username,
      children: (<BaseList list={list} onClick={(item) => this.logout(item)} />)
    }

    // header
    const header = (
      <React.Fragment>
        <BreadCrumb
          style={{ float: 'left' }}
          {...breadCrumb}
        />
        <Login {...login} />
        <div style={{
          position: 'relative',
          float: 'right',
          marginRight: 20
        }}>
          <Dropdown
            list={[{
              title: '中文'
            }, {
              title: 'English'
            }]}
            title={this.state.ISTIO_LANG ? this.state.ISTIO_LANG === 'zh-CN' ? '中文' : 'English' : '中文'}
            type='button'
            onClick={(val) => {
              if (val === '中文') {
                setLanguageCookie('zh-CN')
                this.setState({
                  ISTIO_LANG: 'zh-CN'
                })
              } else {
                setLanguageCookie('en-US')
                this.setState({
                  ISTIO_LANG: 'en-US'
                })
              }
              window.location.reload()
            }}
            prefix={<Icon name='list' />}
          />
        </div>
        <NavMenu />
      </React.Fragment>
    )

    const footer = (
      <React.Fragment>
        <div className='footer-content'> Naftis Doc <i className='icon-github' /> HIUI Design</div>
      </React.Fragment>
    )

    return (
      <Terminal
        header={header}
        sider={sider}
        routes={routes}
        footer={footer}
      />
    )
  }
}

const mapStateToProps = state => ({
  crumbsItems: state.global.crumbsItems,
  username: state.login.username
})

export default connect(mapStateToProps)(Index)
