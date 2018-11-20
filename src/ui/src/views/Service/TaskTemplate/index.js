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
import AceEditor from 'react-ace'
import 'brace/mode/yaml'
import 'brace/theme/monokai'
import { Table, Modal, Input, Select, Form, Button, handleNotificate, Icon, Tooltip } from '@hi-ui/hiui/es'
import { Task } from '../../../commons/consts'
import { setBreadCrumbs } from '../../../redux/actions/global'
import * as Actions from '../../../redux/actions/service/taskTemplate'
import './index.scss'

const FormItem = Form.Item

class Istio extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showModal: false,
      currentType: 'ADD'
    }
    this.canContinue = true
    this.formTypeList = []
    for (let name in Task.varFormType) {
      this.formTypeList.push({
        name: name,
        id: Task.varFormType[name]
      })
    }

    this.addTempColumns = [
      {
        title: T('app.common.task.tb.name'),
        dataIndex: 'name',
        key: 'name',
        width: 160,
        render: (text, item, index) => {
          return this.initItem(item, item.name, 'tempName', item.tempName, index)
        }
      },
      {
        title: T('app.common.task.tb.title'),
        dataIndex: 'title',
        key: 'title',
        width: 160,
        render: (text, item, index) => {
          return this.initItem(item, item.title, 'tempTitle', item.tempTitle, index)
        }
      },
      {
        title: T('app.common.task.tb.comment'),
        dataIndex: 'comment',
        key: 'comment',
        width: 160,
        render: (text, item, index) => {
          return this.initItem(item, item.comment, 'tempComment', item.tempComment, index)
        }
      },
      {
        title: T('app.common.task.tb.formType'),
        dataIndex: 'formType',
        key: 'formType',
        width: 160,
        render: (text, item, index) => {
          return this.initItem(item, item.formType, 'tempFormType', item.tempFormType, index)
        }
      },
      {
        title: T('app.common.task.tb.dataSource'),
        dataIndex: 'dataSource',
        key: 'dataSource',
        width: 160,
        render: (text, item, index) => {
          return this.initItem(item, item.dataSource, 'tempDataSource', item.tempDataSource, index)
        }
      },
      {
        title: T('app.common.task.tb.op'),
        dataIndex: 'opetation',
        key: 'opetation',
        width: 160,
        render: (text, item, index) => {
          if (this.state.currentType === 'WATCH') {
            return
          }
          if (item.type === 'label') {
            return (
              <div>
                <Button type='primary' appearance='line' onClick={() => {
                  let moduleList = [...this.props.moduleList]
                  moduleList[index].type = 'input'
                  this.props.setModuleListData(moduleList)
                }}>Edit</Button>&nbsp;&nbsp;
              </div>
            )
          }
          return (
            <div>
              <Button type='primary' appearance='line' onClick={() => {
                let moduleList = [...this.props.moduleList]
                const muduleItem = moduleList[index]
                this.canContinue = true
                // validate form data
                this.checkNoneData(muduleItem.tempName, 'Name is required!')
                this.checkNoneData(muduleItem.tempTitle, 'Title is required!')
                if (!this.canContinue) {
                  return
                }
                moduleList[index].type = 'label'

                // In order to solve can't change value in Select component of HIUI，so I add tempFormTypeId to save the value For the time being,
                if (moduleList[index].tempFormTypeId) moduleList[index].tempFormType = moduleList[index].tempFormTypeId
                moduleList[index] = this.setValueForModule(moduleList[index], true)
                this.props.setModuleListData(moduleList)
              }}>Save</Button>&nbsp;&nbsp;
              <Button type='warning' appearance='line' onClick={() => {
                let moduleList = [...this.props.moduleList]
                moduleList[index].type = 'label'
                moduleList[index] = this.setValueForModule(moduleList[index], false)
                this.props.setModuleListData(moduleList)
              }}>Cancel</Button>
            </div>
          )
        }
      }
    ]
  }

  componentDidMount () {
    this.props.getServiceTemplateDataAjax()
    const crumbsItems = [
      { title: T('app.menu.service'), to: '/' },
      { title: T('app.common.executeTask'), to: '/service/taskTemplate' }
    ]
    setBreadCrumbs(crumbsItems)
  }

  cancelEvent = () => {
    this.setState({
      showModal: false
    })
  }

  confirmEvent = () => {
    const { submitParam, moduleList } = this.props
    if (this.state.currentType === 'WATCH') {
      this.setState({
        showModal: false
      })
      return false
    }
    for (let i = 0; i < moduleList.length; i++) {
      if (moduleList[i].type === 'input') {
        handleNotificate({
          autoClose: false,
          title: 'Notification',
          message: 'please save you edit item first!',
          type: '',
          onClose: () => { }
        })
        return false
      }
    }
    let vars = []
    moduleList.length > 0 && moduleList.map((item, index) => {
      vars.push({
        comment: item.comment,
        dataSource: item.dataSource,
        formType: item.formType,
        key: index,
        name: item.name,
        title: item.title
      })
    })
    submitParam.vars = vars
    this.props.commitServiceTemplateDataAjax(submitParam, () => {
      this.props.getServiceTemplateDataAjax()
      this.setState({ showModal: false })
      handleNotificate({
        autoClose: true,
        title: 'Noticfication',
        message: 'Add task success',
        type: '',
        onClose: () => { }
      })
    })
  }

  setValueForModule = (listItem, goahead) => {
    let item = { ...listItem }
    if (goahead) {
      item.name = item.tempName
      item.title = item.tempTitle
      item.comment = item.tempComment
      item.formType = item.tempFormType
      item.formTypeDesc = item.tempFormTypeDesc
      item.dataSource = item.tempDataSource
    } else {
      item.tempName = item.name
      item.tempTitle = item.title
      item.tempComment = item.comment
      item.tempFormType = item.formType
      item.tempFormTypeDesc = item.formTypeDesc
      item.tempDataSource = item.dataSource
    }
    return item
  }

  getValueFromId = (id) => {
    let name = ''
    this.formTypeList.map(item => {
      if (item.id === id) name = item.name
    })
    return name
  }

  // render item from data
  initItem = (item, value, tempKey, tempValue, index) => {
    switch (item.type) {
      case 'input':
        if (tempKey === 'tempFormType') {
          let formTypeList = JSON.parse(JSON.stringify(this.formTypeList))
          console.log(formTypeList, 111)
          console.log('4434232323', tempValue, formTypeList)
          return (<Select key={index} mode='single' list={formTypeList} searchable placeholder='' value={tempValue} style={{ width: '150px' }}
            onChange={(value) => {
              if (value[0]) {
                console.log(value[0])
                this.changeItem(tempKey, value[0].id, index, value[0].name)
              }
            }} />)
        } else {
          if (tempKey === 'tempName') {
            return tempKey === 'tempFormType' ? item.formTypeDesc : value
          } else {
            return (<Input value={tempValue} placeholder='' style={{ margin: '4px 4px' }}
              onChange={(event) => {
                this.changeItem(tempKey, event.target.value, index)
              }} />)
          }
        }
      case 'label':
        return tempKey === 'tempFormType' ? item.formTypeDesc : value
    }
  }

  changeItem = (tempKey, value, index, desc) => {
    let moduleList = [...this.props.moduleList]
    if (tempKey === 'tempFormType') {
      moduleList[index].tempFormTypeDesc = desc
      moduleList[index].tempFormTypeId = value
    } else {
      moduleList[index][tempKey] = value
    }

    this.props.setModuleListData(moduleList)
  }

  updateParam = (value, key) => {
    this.props.setAddParamData(key, value)
  }

  // check commit param
  checkNoneData = (value, msg, type) => {
    if (!value) {
      handleNotificate({
        autoClose: true,
        title: 'Notification',
        message: msg,
        type: type,
        onClose: () => { }
      })
      this.canContinue = false
    }
  }

  watchItem = (item) => {
    this.setState({ currentType: 'WATCH' })
    let moduleList = []
    this.props.setAddData({
      name: item.name,
      brief: item.brief,
      content: item.content,
      vars: item.vars
    })
    item.varMap && item.varMap.length && item.varMap.map(item => {
      moduleList.push({
        type: 'label',
        name: item.name,
        tempName: item.name,
        title: item.title,
        tempTitle: item.title,
        comment: item.comment,
        tempComment: item.comment,
        formType: item.formType,
        formTypeDesc: this.getValueFromId(item.formType) || '',
        tempFormType: item.formType,
        tempFormTypeDesc: this.getValueFromId(item.formType) || '',
        dataSource: item.dataSource,
        tempDataSource: item.dataSource,
        opetation: '',
        tempOpetation: ''
      })
    })
    this.props.setModuleListData(moduleList)
    this.setState({ showModal: true })
  }

  deleteItem = (item) => {
    this.props.deleteServiceTemplateDataAjax({ tplID: item.id }, () => {
      this.props.getServiceTemplateDataAjax()
      handleNotificate({
        autoClose: true,
        title: 'Noticfication',
        message: 'Delete template success',
        type: '',
        onClose: () => { }
      })
    })
  }

  // New Template Modal
  taskModule = () => {
    const { submitParam, moduleList } = this.props
    return (
      <Modal
        width={'1100px'}
        title={(this.state.currentType === 'WATCH') ? T('app.common.viewTpl') : T('app.common.newTpl')}
        show={this.state.showModal}
        backDrop
        onConfirm={this.confirmEvent}
        onCancel={this.cancelEvent}
        footers={[
          <Button key='1' type='primary' appearance='line' onClick={this.cancelEvent}>{T('app.common.cancel')}</Button>,
          <Button key='2' type='primary' onClick={this.confirmEvent}>{T('app.common.confirm')}</Button>
        ]}
      >
        <div className='task-modal-content'>
          <Form>
            <FormItem label={T('app.common.task.modalName')}>
              <Input
                value={submitParam.name}
                placeholder=''
                style={{ margin: '4px 4px' }}
                onChange={(e) => {
                  this.updateParam(e.target.value, 'name')
                }}
                required />
            </FormItem>
            <FormItem label={T('app.common.task.modalBrief')}>
              <Input
                type='textarea'
                value={submitParam.brief}
                placeholder=''
                style={{ margin: '4px 4px' }}
                onChange={(e) => {
                  this.updateParam(e.target.value, 'brief')
                }}
                required
              />
            </FormItem>
            <FormItem label={T('app.common.task.modalContent')}>
              <AceEditor
                mode='yaml'
                theme='monokai'
                name='UNIQUE_ID_OF_DIV'
                editorProps={{ $blockScrolling: true }}
                value={submitParam.content}
                onChange={(value) => {
                  this.updateParam(value, 'content')
                }}
                width='100%'
                height='330px'
                readOnly={this.state.currentType === 'WATCH'}
              />
            </FormItem>
            <FormItem label={T('app.common.task.modalVars')}>
              <div className='add-new-button'>
                {
                  this.state.currentType !== 'WATCH'
                    ? <Button type='primary' onClick={this.generateRowsCLick}>Generate rows</Button> : null
                }
              </div>
              <div className='table-add-wrap'>
                {
                  moduleList && moduleList.length
                    ? <Table columns={this.addTempColumns} data={moduleList} />
                    : null
                }
              </div>
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }

  generateRowsCLick = () => {
    let moduleList = []
    let names = new Set()
    let content = this.props.submitParam.content
    if (content) {
      let arr = content.split('{{.')
      arr.forEach(item => {
        if (item.indexOf('}}') !== -1) {
          let name = item.substring(0, item.indexOf('}}'))
          names.add(name)
        }
      })
    }
    names = Array.from(names)
    this.setState({ currentType: 'ADD' })
    names.forEach(item => {
      let moduleItem = {
        type: 'label',
        name: item,
        tempName: item,
        title: item,
        tempTitle: item,
        comment: item,
        tempComment: item,
        formType: 1,
        formTypeDesc: 'STRING',
        tempFormType: 1,
        tempFormTypeDesc: 'STRING',
        dataSource: '',
        tempDataSource: '',
        opetation: '',
        tempOpetation: ''
      }
      moduleList.push(moduleItem)
    })
    this.props.setModuleListData(moduleList)
  }

  renderTop = () => {
    return (
      <div className='temp-top-wrap'>
        <h2>{T('app.common.currentService')}{this.props.lastServiceItem.title}</h2>
        <p>{T('app.common.tplCmt')}</p>
      </div>
    )
  }

  // Template List
  // you can do add, watch, view, createTask and delete on template item
  renderCenter = () => {
    const { taskTemplate } = this.props
    return (
      <div className='temp-center-wrap'>
        {
          taskTemplate && taskTemplate.length ? taskTemplate.map((item, index) => {
            item.icon = item.icon ? item.icon : 'tpl/custom.png'
            return (
              <div className='temp-list' key={index}>
                {item.type !== 'add'
                  ? <div className='content-wrap hover-box' >
                    <div className='col-panel-title'>
                      <div className='img-container'>
                        <img className='img' src={'../../../public/' + item.icon} />
                      </div>
                      {/* delete template button */}
                      <div className='delete-container' onClick={() => { this.deleteItem(item) }}>
                        <Tooltip title={T('app.common.deleteTpl')} style={{ margin: '0 10px' }}>
                          <Icon name='delete' style={{ color: '#f5222d', fontSize: '16px', cursor: 'pointer' }} />
                        </Tooltip>
                      </div>
                      <div className='temp-right'>
                        <div className='temp-panel-title'>{item.name}</div>
                        <div className='temp-panel-content'>{item.brief}</div>
                      </div>
                    </div>
                    <div className='temp-list-footer'>
                      <div className='temp-row-line' />
                      <div className='temp-list-foot'>
                        {/* view template button */}
                        <div className='temp-watch hover-font' onClick={() => {
                          this.watchItem(item)
                        }}>
                          {T('app.common.viewTpl')}
                        </div>
                        {/* create task button */}
                        <div className='temp-line' />
                        <div className='temp-create hover-font' onClick={() => {
                          this.props.history.push({ pathname: '/service/createTask', query: item })
                        }}>
                          {T('app.common.createTask')}
                        </div>
                      </div>
                    </div>
                  </div>
                  : <div className='add-wrap hover-box' onClick={() => {
                    this.props.setAddData({
                      name: '',
                      brief: '',
                      content: '',
                      vars: []
                    })
                    this.props.setModuleListData([])
                    this.setState({
                      showModal: true,
                      currentType: 'ADD'
                    })
                  }}>
                    <p>+ {T('app.common.newTpl')}</p>
                  </div>
                }
              </div>
            )
          }) : null
        }
      </div>
    )
  }

  render () {
    return (
      <div className='task-temp'>
        {this.renderTop()}
        {this.renderCenter()}
        {this.taskModule()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  taskTemplate: state.taskTemplate.templateList,
  moduleList: state.taskTemplate.moduleList,
  submitParam: state.taskTemplate.submitParam,
  lastServiceItem: state.serviceList.lastServiceItem
})

export default connect(mapStateToProps, Actions)(Istio)
