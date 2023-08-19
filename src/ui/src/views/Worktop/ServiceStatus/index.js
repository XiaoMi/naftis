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
import { Panel, Tooltip } from '@hi-ui/hiui/es'
import Grid from '@hi-ui/hiui/es/grid'
import ReactEcharts from 'echarts-for-react'
import { setBreadCrumbs } from '../../../redux/actions/global'
import * as serviceStatusAction from '../../../redux/actions/worktop/serviceStatus'
import * as socketAction from '../../../redux/actions/socket'
import './index.scss'

const TIMEOUT1 = 10000 // dashboard fetch timeout setting
const TIMEOUT2 = 1000 // sockette timeout setting
const { Row, Col } = Grid

class ServiceStatus extends Component {
  componentDidMount () {
    socketAction.connectSocket()

    // set BreadCrumbs
    const crumbsItems = [
      { title: T('app.menu.worktop'), to: '/' },
      { title: T('app.menu.worktop.overview'), to: '/worktop/overview' }
    ]
    setBreadCrumbs(crumbsItems)

    // dashboard first time query
    let timestamp = Date.parse(new Date()) / 1000
    let data = {
      start: timestamp - 300,
      end: timestamp
    }
    this.props.geServiceAndPodsData()
    this.props.getGlobalSuccessRateData(data)
    this.props.get4xxsByServiceData(data)
    this.props.get5xxsByServiceData(data)
    this.props.get4xxsData(data)
    this.props.get5xxsData(data)

    // dashboard set query interval to 10 seconds.
    this.timerID = setInterval(() => {
      let timestamp = Date.parse(new Date()) / 1000
      let data = {
        start: timestamp - 300,
        end: timestamp
      }
      this.props.geServiceAndPodsData()
      this.props.getGlobalSuccessRateData(data)
      this.props.get4xxsByServiceData(data)
      this.props.get5xxsByServiceData(data)
      this.props.get4xxsData(data)
      this.props.get5xxsData(data)
    }, TIMEOUT1)

    // sockette set query interval to 1 seconds.
    window.timerPing = setInterval(() => {
      window.sockette && window.sockette.send('ping')
    }, TIMEOUT2)
  }

  componentWillUnmount () {
    // clear Interval
    clearInterval(this.timerID)
    clearInterval(window.timerPing)
  }

  getServiceDataOption = () => {
    let dataStyle = {
      normal: {
        color: '#65c4c7',
        label: { show: false },
        labelLine: { show: false }
      }
    }
    let numLength = 0
    numLength = this.props.serviceStatus.serviceCount.toString().length - 1
    return {
      title: {
        text: this.props.serviceStatus.podCount,
        x: 'center',
        y: 'center',
        itemGap: 20,
        textStyle: {
          color: '#458fca',
          fontSize: 140 - numLength * 15,
          fontWeight: 'bolder'
        }
      },
      series: [{
        type: 'pie',
        clockWise: false,
        radius: [0, 0],
        itemStyle: dataStyle,
        data: [{
          value: 100
        }]
      }]
    }
  }

  getPodsDataOption = () => {
    let dataStyle = {
      normal: {
        label: { show: false },
        color: '#458fca',
        labelLine: { show: false }
      }
    }
    let numLength = 0
    numLength = this.props.serviceStatus.podCount.toString().length - 1
    return {
      title: {
        text: this.props.serviceStatus.serviceCount,
        x: 'center',
        y: 'center',
        itemGap: 20,
        textStyle: {
          fontFamily: '微软雅黑',
          color: '#65c4c7',
          fontSize: 140 - numLength * 15,
          fontWeight: 'bolder'
        }
      },
      series: [{
        type: 'pie',
        clockWise: false,
        radius: [0, 0],
        itemStyle: dataStyle,
        data: [
          {
            value: 100
          }
        ]
      }]
    }
  }

  get4xxCntDataOption = () => {
    let arr = this.props.serviceStatus.foxxsData
    let xAxisData = []
    let seriesData = []
    arr.forEach((item) => {
      seriesData.push(parseFloat(item[1]).toFixed(2))
      let time = new Date(parseInt(item[0]) * 1000)
      let h = time.getHours()
      if (h < 10) {
        h = '0' + h
      }
      let m = time.getMinutes()
      if (m < 10) {
        m = '0' + m
      }
      xAxisData.push(h + ':' + m)
    })
    return {
      legend: {
        data: [T('app.common.4xxCnt')]
      },
      tooltip: {
        trigger: 'axis',
        formatter: `{b} <br/> ${T('app.common.4xxCnt')} : {c}`
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      }],
      yAxis: {},
      series: [{
        name: T('app.common.4xxCnt'),
        type: 'line',
        smooth: true,
        itemStyle: { normal: { areaStyle: { type: 'default' } } },
        data: seriesData
      }]
    }
  }

  get5xxCntDataOption = () => {
    let arr = this.props.serviceStatus.fixxsData
    let xAxisData = []
    let seriesData = []
    arr.forEach((item) => {
      seriesData.push(parseFloat(item[1]).toFixed(2))
      let time = new Date(parseInt(item[0]) * 1000)
      let h = time.getHours()
      if (h < 10) {
        h = '0' + h
      }
      let m = time.getMinutes()
      if (m < 10) {
        m = '0' + m
      }
      xAxisData.push(h + ':' + m)
    })
    return {
      legend: {
        data: [T('app.common.5xxCnt')]
      },
      tooltip: {
        trigger: 'axis',
        formatter: `{b} <br/> ${T('app.common.5xxCnt')} : {c}`
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      }],
      yAxis: {},
      series: [{
        name: T('app.common.5xxCnt'),
        type: 'line',
        smooth: true,
        itemStyle: { normal: { areaStyle: { type: 'default' } } },
        data: seriesData
      }]
    }
  }

  getSuccessRateDataOption = () => {
    let arr = this.props.serviceStatus.globalSuccessRateData
    let xAxisData = []
    let seriesData = []
    let base = 0
    arr.forEach((item) => {
      if (item[1] >= 0) {
        seriesData.push((item[1] * 100).toFixed(2))
      } else {
        seriesData.push(0)
      }

      let time = new Date(parseInt(item[0]) * 1000)
      let h = time.getHours()
      if (h < 10) {
        h = '0' + h
      }
      let m = time.getMinutes()
      if (m < 10) {
        m = '0' + m
      }

      xAxisData.push(h + ':' + m)
    })
    return {
      legend: {
        data: ['Global Success Rate']
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b} <br/> Global Success Rate : {c}%'
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: xAxisData
      }],
      yAxis: {
        axisLabel: {
          formatter: function (val) {
            return (val - base) + '%'
          }
        }
      },
      series: [{
        name: 'Global Success Rate',
        type: 'line',
        smooth: true,
        itemStyle: { normal: { areaStyle: { type: 'default' } } },
        data: seriesData
      }]
    }
  }

  get4xxTrendsBySvcDataOption = () => {
    let arr = this.props.serviceStatus.foxxsByServiceData
    let length = arr.length
    let legends = []
    let serieses = []
    let xAxisData = []
    let count = 0
    if (length > 0) {
      arr.forEach((item) => {
        let seriesData = []
        item.values.forEach((item) => {
          seriesData.push(item[1])
          if (count === 0) {
            let time = new Date(parseInt(item[0]) * 1000)
            let h = time.getHours()
            if (h < 10) {
              h = '0' + h
            }
            let m = time.getMinutes()
            if (m < 10) {
              m = '0' + m
            }
            xAxisData.push(h + ':' + m)
          }
        })
        legends.push(item.metric.destination_service)
        serieses.push({
          name: item.metric.destination_service,
          type: 'line',
          data: seriesData
        })
        count++
      })
    }

    return {
      legend: {
        data: legends
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xAxisData
        }
      ],
      yAxis:
      {
        axisLabel: {
          formatter: function (val) {
            return val.toFixed(2)
          }
        }
      },
      series: serieses
    }
  }

  get5xxTrendsBySvcDataOption = () => {
    let arr = this.props.serviceStatus.fixxsByServiceData
    let length = arr.length
    let legends = []
    let serieses = []
    let xAxisData = []
    let count = 0
    if (length > 0) {
      arr.forEach((item) => {
        let seriesData = []
        item.values.forEach((item) => {
          seriesData.push(item[1])
          if (count === 0) {
            let time = new Date(parseInt(item[0]) * 1000)
            let h = time.getHours()
            if (h < 10) {
              h = '0' + h
            }
            let m = time.getMinutes()
            if (m < 10) {
              m = '0' + m
            }
            xAxisData.push(h + ':' + m)
          }
        })
        legends.push(item.metric.destination_service)
        serieses.push({
          name: item.metric.destination_service,
          type: 'line',
          data: seriesData
        })
        count++
      })
    }

    return {
      legend: {
        data: legends
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xAxisData
        }
      ],
      yAxis:
      {
        axisLabel: {
          formatter: function (val) {
            return val.toFixed(2)
          }
        }
      },
      series: serieses
    }
  }

  renderTop = () => {
    return (
      <div className='service-top-wrap'>
        <Row gutter>
          <Col span={6}>
            <div className='col-item-wrap'>
              <div className='col-item-wrap'>
                <Panel title={
                  <div className='col-panel-title'>
                    <Tooltip title={T('app.common.totalServices')} style={{ float: 'right', marginTop: 5 }}><i className='hi-icon icon-info-circle-o' /></Tooltip>
                    {T('app.common.totalServices')}
                  </div>} footer=''
                >
                  <ReactEcharts
                    option={this.getServiceDataOption()}
                    style={{ height: '300px', width: '100%' }}
                    className='react_for_echarts' />
                </Panel>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className='col-item-wrap'>
              <div className='col-item-wrap'>
                <Panel title={
                  <div className='col-panel-title'>
                    <Tooltip title={T('app.common.totalPods')} style={{ float: 'right', marginTop: 5 }}><i className='hi-icon icon-info-circle-o' /></Tooltip>
                    {T('app.common.totalPods')}
                  </div>} footer=''>
                  <ReactEcharts
                    option={this.getPodsDataOption()}
                    style={{ height: '300px', width: '100%' }}
                    className='react_for_echarts' />
                </Panel>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className='col-item-wrap'>
              <Panel title={
                <div className='col-panel-title'>
                  <Tooltip title={T('app.common.4xxCnt')} style={{ float: 'right', marginTop: 5 }}><i className='hi-icon icon-info-circle-o' /></Tooltip>
                  {T('app.common.4xxCnt')}
                </div>} footer=''>
                <div>
                  <ReactEcharts
                    option={this.get4xxCntDataOption()}
                    style={{ height: '300px', width: '100%' }}
                    className='react_for_echarts' />
                </div>
              </Panel>
            </div>
          </Col>
          <Col span={6}>
            <div className='col-item-wrap'>
              <Panel title={
                <div className='col-panel-title'>
                  <Tooltip title={T('app.common.5xxCnt')} style={{ float: 'right', marginTop: 5 }}><i className='hi-icon icon-info-circle-o' /></Tooltip>
                  {T('app.common.5xxCnt')}
                </div>} footer=''>
                <div>
                  <ReactEcharts
                    option={this.get5xxCntDataOption()}
                    style={{ height: '300px', width: '100%' }}
                    className='react_for_echarts' />
                </div>
              </Panel>
            </div>
          </Col>
        </Row>

        <Row gutter>
          <Col span={8}>
            <div className='col-item-wrap'>
              <Panel title={
                <div className='col-panel-title'>
                  <Tooltip title={T('app.common.globalSuccRate')} style={{ float: 'right', marginTop: 5 }}><i className='hi-icon icon-info-circle-o' /></Tooltip>
                  {T('app.common.globalSuccRate')}
                </div>} footer=''>
                <div>
                  <ReactEcharts
                    option={this.getSuccessRateDataOption()}
                    style={{ height: '300px', width: '100%' }}
                    className='react_for_echarts' />
                </div>
              </Panel>
            </div>
          </Col>
          <Col span={8}>
            <div className='col-item-wrap'>
              <Panel title={
                <div className='col-panel-title'>
                  <Tooltip title={T('app.common.4xxTrendsBySvc')} style={{ float: 'right', marginTop: 5 }}><i className='hi-icon icon-info-circle-o' /></Tooltip>
                  {T('app.common.4xxTrendsBySvc')}
                </div>} footer=''>
                <div>
                  <ReactEcharts
                    option={this.get4xxTrendsBySvcDataOption()}
                    style={{ height: '300px', width: '100%' }}
                    className='react_for_echarts' />
                </div>
              </Panel>
            </div>
          </Col>
          <Col span={8}>
            <div className='col-item-wrap'>
              <Panel title={
                <div className='col-panel-title'>
                  <Tooltip title={T('app.common.5xxTrendsBySvc')} style={{ float: 'right', marginTop: 5 }}><i className='hi-icon icon-info-circle-o' /></Tooltip>
                  {T('app.common.5xxTrendsBySvc')}
                </div>} footer=''>
                <div>
                  <ReactEcharts
                    option={this.get5xxTrendsBySvcDataOption()}
                    style={{ height: '300px', width: '100%' }}
                    className='react_for_echarts' />
                </div>
              </Panel>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  render () {
    return (
      <div className='service-wrap'>
        {this.renderTop()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  serviceStatus: state.serviceStatus
})

export default connect(mapStateToProps, { ...serviceStatusAction, ...socketAction })(ServiceStatus)
