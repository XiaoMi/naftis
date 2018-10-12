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
import { Table, Panel, Button, Pagination, handleNotificate, Modal, Form } from '@hi-ui/hiui/es'
import AceEditor from 'react-ace'
import '@hi-ui/hiui/es/panel/style'
import '@hi-ui/hiui/es/table/style'
import '@hi-ui/hiui/es/button/style'
import '@hi-ui/hiui/es/pagination/style'
import '@hi-ui/hiui/es/notification/style/index.js'
import { Task } from '../../../commons/consts'
import * as createTaskActions from '../../../redux/actions/service/createTask'
import * as Actions from '../../../redux/actions/service/serviceList'
import './index.scss'
const FormItem = Form.Item
class ServiceAbout extends Component {
  constructor (props) {
    super(props)

    this.podsColumns = [
      { title: T('app.common.tb.podName'), dataIndex: 'name', key: 'name' },
      { title: T('app.common.tb.podReady'), dataIndex: 'ready', key: 'ready' },
      {
        title: T('app.common.tb.podStatus'),
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
      { title: T('app.common.tb.podRestarts'), dataIndex: 'restarts', key: 'restarts' },
      { title: T('app.common.tb.podAge'), dataIndex: 'age', key: 'age' }
    ]

    this.taskColumns = [
      {
        title: T('app.common.tb.taskOpType'),
        dataIndex: 'operationType',
        key: 'operationType',
        render: text => {
          return (
            <span style={text ? {} : { color: '#ff0000' }}>{text || 'Roolback'}</span>
          )
        }
      },
      { title: T('app.common.tb.taskOpUser'), dataIndex: 'operationUser', key: 'operationUser' },
      {
        title: T('app.common.tb.taskResult'),
        dataIndex: 'execResult',
        key: 'execResult',
        render: status => {
          let colorValue = ''
          let text = ''
          switch (status) {
            case Task.status.EXECUTING:
              colorValue = '#1890FF'
              text = 'Executing'
              break
            case Task.status.SUCCESS:
              colorValue = '#52C41A'
              text = 'Success'
              break
            case Task.status.FAIL:
              colorValue = '#F5222D'
              text = 'Fail'
              break
            default:
              text = 'Undefined'
              colorValue = '#1890FF'
          }
          return (
            <div>
              <span style={{ color: colorValue }}>●</span> {text}
            </div>
          )
        }
      },
      { title: T('app.common.tb.taskCreateTime'), dataIndex: 'operationTime', key: 'operationTime' },
      {
        title: T('app.common.tb.taskOp'),
        dataIndex: 'execResult',
        key: 'operation',
        render: (execResult, row, index) => {
          if (execResult === 2) {
            return (
              <div>
                <Button type='danger' size='small' key={1} disabled={!row.canRollback} onClick={() => {
                  let dataOptions = {
                    content: row.prevState,
                    command: Task.command.ROLLBACK,
                    serviceUID: row.serviceUID
                  }

                  this.props.submitCreateTempAjax(dataOptions, (res) => {
                    if (!res.status) {
                      this.props.taskInfo.taskList[index].canRollback = false
                      this.props.setTaskPageListData(this.props.taskInfo)
                      handleNotificate({
                        autoClose: true,
                        title: 'Notification',
                        message: 'rollback success!',
                        type: '',
                        onClose: () => { }
                      })
                    }
                  })
                }}>
                  {T('app.common.rollback')}
                </Button>
                <Button type='primary' size='small' key={2} style={{ marginLeft: 15 }} onClick={() => {
                  this.viewModal(row)
                }}>
                  {T('app.common.view')}
                </Button>
              </div>
            )
          }
          return null
        }
      }
    ]

    this.state = {
      tpl: '',
      showModal: false,
      keyWord: '',
      filterTreeList: '',
      active: null
    }
  }

  renderTop = () => {
    const { podsKey } = this.props
    const pod = podsKey[0]

    return (
      <div className='service-top-wrap only-service'>
        <div className='service-detail-left'>
          <h2>{T('app.common.service')}{pod && pod.name}</h2>
          <p><span className='fl'><span style={{ fontWeight: 'bold' }}>{T('app.common.tb.svcAge')}: </span>{pod && pod.age}</span></p>
          <p><span className='fl'><span style={{ fontWeight: 'bold' }}>{T('app.common.tb.svcClusterIP')}: </span>{pod && pod.clusterIP}</span></p>
          <p><span className='fl'><span style={{ fontWeight: 'bold' }}>{T('app.common.tb.svcExternalIP')}: </span>{pod && pod.externalIP}</span></p>
        </div>

        <div className='service-detail-right'>
          <div className='service-detail'>
            <h2>&nbsp;</h2>
            <p><span className='fl'><span style={{ fontWeight: 'bold' }}>{T('app.common.tb.svcPorts')}：</span>{pod && pod.ports}</span></p>
            <p><span className='fl'><span style={{ fontWeight: 'bold' }}>{T('app.common.tb.svcType')}：</span>{pod && pod.type}</span></p>
            <p><span className='fl'><span style={{ fontWeight: 'bold' }}>UID: </span>{pod && pod.uid}</span></p>
          </div>

          <div className='service-action'>
            <div className='apply-method'>
              <Button type='primary' onClick={() => {
                this.props.history.push('/service/taskTemplate')
              }}>{T('app.common.executeTask')}</Button>
              <h2>&nbsp;</h2>
              <p><span className='fl-status' style={{ fontWeight: 'bold' }}>Running</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  cancelEvent = () => {
    this.setState({
      showModal: false
    })
  }

  viewModal = (row) => {
    this.setState({
      showModal: true,
      tpl: row.content
    })
  }

  taskModule = () => {
    return (
      <Modal
        width={'1100px'}
        title={T('app.common.view')}
        show={this.state.showModal}
        backDrop
        onCancel={this.cancelEvent}
        footers={[
          <Button key={3} type='primary' onClick={this.cancelEvent} >{T('app.common.confirm')}</Button>
        ]}
      >
        <div className='task-modal-content'>
          <Form>
            <FormItem label={T('app.common.task.modalContent')}>
              <AceEditor
                mode='yaml'
                theme='monokai'
                name='UNIQUE_ID_OF_DIV'
                editorProps={{ $blockScrolling: true }}
                value={this.state.tpl}
                width='100%'
                height='330px'
                readOnly
              />
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }

  // Get the paging data from the list
  getListFromArea = (list, page) => {
    const { pageIndex, pageSize } = page
    let currentPageList = []
    if (list && list.length) {
      currentPageList = list.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
    }
    return currentPageList
  }

  renderCenter = () => {
    const { keyPodsInfo = {}, taskInfo = [] } = this.props
    let currentPagePodsList = this.getListFromArea(keyPodsInfo.podsList, keyPodsInfo.page)
    const currentPageTaskList = this.getListFromArea(taskInfo.taskList, taskInfo.page)

    return (
      <div className='navMenu-wrap'>
        <div className='component-status'>
          {/* Running Status List */}
          <Panel title={<div className='col-panel-title'>{T('app.common.runningStatus')}</div>}>
            {currentPagePodsList && currentPagePodsList.length > 0
              ? (
                <div>
                  <Table columns={this.podsColumns} data={currentPagePodsList} />
                  <div className='pagi-wrap'>
                    <div className='pagi-wrap-float'>
                      <Pagination
                        total={keyPodsInfo.podsList.length}
                        pageSize={keyPodsInfo.page.pageSize}
                        defaultCurrent={keyPodsInfo.page.pageIndex}
                        onChange={(page, prevPage, pageSize) => {
                          if (page - 1 !== keyPodsInfo.page.pageIndex) {
                            this.props.keyPodsInfo.page = {
                              pageSize: pageSize,
                              pageIndex: page - 1
                            }
                            this.props.setKeyPodsPageListData(this.props.keyPodsInfo)
                          }
                        }} />
                    </div>
                  </div>
                </div>
              ) : null
            }
          </Panel>
        </div>
        <div className='pods-status'>
          {/* Executed Task List */}
          <Panel title={<div className='col-panel-title'>{T('app.common.executedTasks')}</div>}>
            {currentPageTaskList && currentPageTaskList.length > 0
              ? (
                <div>
                  <Table columns={this.taskColumns} data={currentPageTaskList} />
                  <div className='pagi-wrap'>
                    <div className='pagi-wrap-float'>
                      <Pagination
                        total={taskInfo.taskList.length}
                        pageSize={taskInfo.page.pageSize}
                        defaultCurrent={taskInfo.page.pageIndex}
                        onChange={(page, prevPage, pageSize) => {
                          if (page - 1 !== taskInfo.page.pageIndex) {
                            this.props.taskInfo.page = {
                              pageSize,
                              pageIndex: page - 1
                            }
                            this.props.setTaskPageListData(this.props.taskInfo)
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
        {this.renderTop()}
        {this.renderCenter()}
        {this.taskModule()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  lastServiceItem: state.serviceList.lastServiceItem,
  taskInfo: state.serviceList.taskInfo,
  podsKey: state.serviceList.podsKey,
  keyPodsInfo: state.serviceList.keyPodsInfo
})

export default connect(mapStateToProps, { ...Actions, ...createTaskActions })(ServiceAbout)
