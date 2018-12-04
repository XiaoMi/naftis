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
import { Table, Panel, Pagination } from '@hi-ui/hiui/es'
import '@hi-ui/hiui/es/table/style/index.css'
import Graph from './Graph'
import * as Actions from '../../../redux/actions/service/serviceList'
import './index.scss'

class PodsAbout extends Component {
  constructor (props) {
    super(props)
    this.podsColumns = [
      {title: 'Name', dataIndex: 'name', key: 'name'},
      {title: 'Ready', dataIndex: 'ready', key: 'ready'},
      {title: 'Ready',
        dataIndex: 'status',
        key: 'status',
        render: text => {
          let colorValue = ''
          switch (text) {
            case 'Pending':
              colorValue = '#1890FF'
              break
            case 'Running' || 'Succeeded':
              colorValue = '#52C41A'
              break
            case 'Failed':
              colorValue = '#F5222D'
              break
            default:
              colorValue = '#1890FF'
          }
          return (
            <div>
              <span style={{ color: colorValue }}>●</span> {text}
            </div>
          )
        }
      },
      {title: 'Restarts', dataIndex: 'restarts', key: 'restarts'},
      {title: 'Age', dataIndex: 'age', key: 'age'}
    ]

    this.state = {
      keyWord: '',
      filterTreeList: '',
      active: null
    }
  }
  componentDidMount () {
  }

  renderTop = () => {
    const {lastServiceItem} = this.props
    return (
      <div className='service-top-wrap'>
        <div className='service-detail'>
          <h2>Pod: {lastServiceItem.title}</h2>
        </div>
      </div>
    )
  }

  // Get the paging data from the list
  getListFromArea = (list, page) => {
    const {pageIndex, pageSize} = page
    let currentPageList = []
    if (list && list.length) {
      currentPageList = list.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
    }
    return currentPageList
  }

  renderCenter = () => {
    const {podsInfo = []} = this.props
    let currentPagePodsList = this.getListFromArea(podsInfo.podsList, podsInfo.page)
    return (
      <div className='navMenu-wrap'>
        <div className='component-servicegraph'>
          <Panel title={<div className='col-panel-title'>{T('app.common.serviceGraph')}</div>}>
            <div>
              <Graph />
            </div>
          </Panel>
        </div>
        <div className='component-status'>
          <Panel title={<div className='col-panel-title'>{T('app.common.runningStatus')}</div>}>
            {currentPagePodsList && currentPagePodsList.length > 0
              ? (
                <div>
                  <Table columns={this.podsColumns} data={currentPagePodsList} />
                  <div className='pagi-wrap'>
                    <div className='pagi-wrap-float'>
                      <Pagination
                        total={podsInfo.podsList.length}
                        pageSize={podsInfo.page.pageSize}
                        current={podsInfo.page.pageIndex}
                        onChange={(page, prevPage, pageSize) => {
                          if (page - 1 !== podsInfo.page.pageIndex) {
                            this.props.setPodsPageData({pageSize, pageIndex: page - 1})
                          }
                        }} />
                    </div>
                  </div>
                </div>
              ) : null
            }
          </Panel>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div>
        { this.renderTop() }
        { this.renderCenter() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  podsInfo: state.serviceList.podsInfo,
  realPods: state.serviceList.realPods,
  topology: state.serviceList.topology,
  treeList: state.serviceList.treeList,
  podsKeyList: state.serviceList.podsKeyList,
  lastServiceItem: state.serviceList.lastServiceItem
})

export default connect(mapStateToProps, Actions)(PodsAbout)
