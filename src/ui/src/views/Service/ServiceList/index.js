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
import { connect } from 'react-redux'
import { Input, Form } from '@hi-ui/hiui/es'
import Grid from '@hi-ui/hiui/es/grid'
import '@hi-ui/hiui/es/grid/style'
import '@hi-ui/hiui/es/form/style'
import '@hi-ui/hiui/es/input/style'
import { setBreadCrumbs } from '../../../redux/actions/global'
import * as Actions from '../../../redux/actions/service/serviceList'
import PodsAbout from './PodsAbout'
import ServiceAbout from './ServiceAbout'
import CTree from '../../../components/CTree'
import './index.scss'

const FormItem = Form.Item
const { Row, Col } = Grid

class ServiceList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      keyWord: '',
      filterTreeList: '',
      active: null
    }
  }

  componentDidMount () {
    this.props.getServiceTreeListAjax((treeList) => {
      const filterList = this.repeatGetKey(treeList, true, '')
      this.setState({
        keyWord: '',
        filterTreeList: filterList
      })

      const defaultItem = filterList[0]
      if (defaultItem) {
        this.props.getLastServiceItem(defaultItem)
        this.props.getServiceKeyDataAjax(defaultItem.key)
        this.props.getServiceKeyPodsDataAjax(defaultItem.key)
      }
    })

    const crumbsItems = [
      {title: T('app.menu.service'), to: '/'},
      {title: T('app.menu.service.manager'), to: '/service/serviceList'}
    ]
    setBreadCrumbs(crumbsItems)
  }

  repeatGetKey = (list, needCheck, value) => {
    let treeList = JSON.parse(JSON.stringify(list))
    let filterList = []
    treeList && treeList.length && treeList.map(item => {
      let titleArr = item.title.split(value)
      if (value) {
        item.name = titleArr.join(`<span class='colorRed'>${value}</span>`)
      } else {
        item.name = item.title
      }

      if (item.children && item.children.length) {
        item.children = this.repeatGetKey(item.children, needCheck, value)
        item.isOpen = !!value
        filterList.push(item)
      } else if (item.title.includes(value)) {
        filterList.push(item)
      }
    })
    return filterList
  }

  renderEmpty = () => {
    return (
      <div className='empty-wrap'>
        <h3 className='empty-content'>{T('app.common.services.chooseSvcCmt')}</h3>
      </div>
    )
  }

  render () {
    let {treeList, lastServiceItem} = this.props
    let {filterTreeList} = this.state
    let lastServiceItemArr = Object.keys(lastServiceItem)
    return (
      <div className='service-wrap'>
        <Row gutter>
          <Col span={4}>
            <div className='tree-wrap'>
              <Form>
                <FormItem>
                  <Input placeholder={'Search Nodes'} value={this.state.keyWord} onChange={(e) => {
                    const filterList = this.repeatGetKey(treeList, true, e.target.value)
                    this.setState({
                      keyWord: e.target.value,
                      filterTreeList: filterList
                    })
                  }} />
                </FormItem>
              </Form>
              <CTree
                treeList={filterTreeList}
                name={'name'}
                open={!!this.state.keyWord}
                lastChoose={filterTreeList[0] ? filterTreeList[0].name : null}
                nameSearch={'titleSearch'}
                onClick={(item) => {
                  this.props.getLastServiceItem(item)
                  if (!item.children) {
                    // click pods item
                    this.props.getServicePodsDataAjax(item.title)
                    if (item.graphNodeName) {
                      this.props.getGraphDataAjax(item.graphNodeName)
                    }
                  } else {
                    // click service item
                    this.props.getServiceKeyDataAjax(item.key)
                    this.props.getServiceKeyPodsDataAjax(item.key)
                    this.props.getServiceTaskDataAjax(item.key)
                  }
                }}
              />
            </div>
          </Col>
          <Col span={20}>
            {
              lastServiceItemArr.length
                ? (
                  <div className='service-center-wrap'>
                    {
                      (lastServiceItem.children)
                        ? <ServiceAbout history={this.props.history} /> : <PodsAbout history={this.props.history} />
                    }
                  </div>
                )
                : (
                  <div className='service-center-wrap'>
                    { this.renderEmpty() }
                  </div>
                )
            }
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  podsInfo: state.serviceList.podsInfo,
  realPods: state.serviceList.realPods,
  taskInfo: state.serviceList.taskInfo,
  topology: state.serviceList.topology,
  treeList: state.serviceList.treeList,
  keyPodsInfo: state.serviceList.keyPodsInfo,
  lastServiceItem: state.serviceList.lastServiceItem
})

export default connect(mapStateToProps, Actions)(ServiceList)
