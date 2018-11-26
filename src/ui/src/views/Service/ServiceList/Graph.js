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
import * as Actions from '../../../redux/actions/service/serviceList'
import '../../../components/Forcegraph/index.css'
const forcegraph = require('../../../components/Forcegraph/index')

class Graph extends Component {
  componentDidMount () {
    this.getGraphData()
  }

  getGraphData = () => {
    const {graphData} = this.props
    if (!graphData || !graphData.nodes) {
      return
    }
    graphData && forcegraph.init(graphData)
  }

  componentWillUnmount () {
    // clear data
    forcegraph.clearData()
  }

  render () {
    this.getGraphData()

    return (
      <div id='total'>
        <div id='graph' />
        <div id='info'>
          <a>Close</a>
          <div id='incoming' className='conn-table'>
            <table>
              <tbody>
                <tr>
                  <th>1</th>
                  <th>2</th>
                </tr>
                <tr>
                  <td>3</td>
                  <td>4</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id='outgoing' className='conn-table'>
            <table>
              <tbody>
                <tr>
                  <th>1</th>
                  <th>2</th>
                </tr>
                <tr>
                  <td>3</td>
                  <td>4</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  graphData: state.serviceList.graphData
})

export default connect(mapStateToProps, Actions)(Graph)
