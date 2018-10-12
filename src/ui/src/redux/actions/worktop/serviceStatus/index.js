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

import axios from '../../../../commons/axios'

const TYPE = {
  SERVICE_AND_PODS_DATA: 'USERVICE_AND_PODS_DATA',
  GLOBAL_SUCCESS_RATE_DATA: 'GLOBAL_SUCCESS_RATE_DATA',
  FIXXXS_BY_SERVICE_DATA: 'FIXXXS_BY_SERVICE_DATA',
  FOXXXS_BY_SERVICE_DATA: 'FOXXXS_BY_SERVICE_DATA',
  FIXXS_DATA: 'FIXXS_DATA',
  FOXXS_DATA: 'FOXXS_DATA'
}

const step = 10

const geServiceAndPodsData = () => {
  return dispatch => {
    axios.getAjax({
      url: 'api/metrics',
      type: 'GET'
    }).then(response => {
      if (response !== 'error' && response.code === 0) {
        dispatch({
          type: TYPE.SERVICE_AND_PODS_DATA,
          payload: response.data
        })
      }
    })
  }
}

const get4xxsData = (data) => {
  let query = `sum(rate(istio_requests_total{response_code=~"4.*"}[1m]))`
  return dispatch => {
    axios.getAjax({
      url: `prometheus/api/v1/query_range?query=${query}&start=${data.start}&end=${data.end}&step=${step}`,
      type: 'GET'
    }).then(response => {
      if (response !== 'error') {
        dispatch({
          type: TYPE.FOXXS_DATA,
          payload: response.data
        })
      }
    })
  }
}

const get5xxsData = (data) => {
  let query = `sum(rate(istio_requests_total{response_code=~"5.*"}[1m]))`
  return dispatch => {
    axios.getAjax({
      url: `prometheus/api/v1/query_range?query=${query}&start=${data.start}&end=${data.end}&step=${step}`,
      type: 'GET'
    }).then(response => {
      if (response !== 'error') {
        dispatch({
          type: TYPE.FIXXS_DATA,
          payload: response.data
        })
      }
    })
  }
}

const getGlobalSuccessRateData = (data) => {
  let query = `sum(rate(istio_requests_total{response_code!~"5.*"}[1m])) / sum(rate(istio_requests_total[1m]))`
  return dispatch => {
    axios.getAjax({
      url: `prometheus/api/v1/query_range?query=${query}&start=${data.start}&end=${data.end}&step=${step}`,
      type: 'GET'
    }).then(response => {
      if (response !== 'error') {
        dispatch({
          type: TYPE.GLOBAL_SUCCESS_RATE_DATA,
          payload: response.data
        })
      }
    })
  }
}

const get4xxsByServiceData = (data) => {
  let query = `label_replace(sum(irate(istio_requests_total{response_code=~"4.*"}[1m])) by (destination_service), "destination_service", "$1", "destination_service", "(.*).svc.cluster.local")`
  return dispatch => {
    axios.getAjax({
      url: `prometheus/api/v1/query_range?query=${query}&start=${data.start}&end=${data.end}&step=${step}`,
      type: 'GET'
    }).then(response => {
      if (response !== 'error') {
        dispatch({
          type: TYPE.FOXXXS_BY_SERVICE_DATA,
          payload: response.data
        })
      }
    })
  }
}

const get5xxsByServiceData = (data) => {
  let query = `label_replace(sum(irate(istio_requests_total{response_code=~"5.*"}[1m])) by (destination_service), "destination_service", "$1", "destination_service", "(.*).svc.cluster.local")`
  return dispatch => {
    axios.getAjax({
      url: `prometheus/api/v1/query_range?query=${query}&start=${data.start}&end=${data.end}&step=${step}`,
      type: 'GET'
    }).then(response => {
      if (response !== 'error') {
        dispatch({
          type: TYPE.FIXXXS_BY_SERVICE_DATA,
          payload: response.data
        })
      }
    })
  }
}

export {
  getGlobalSuccessRateData,
  geServiceAndPodsData,
  get4xxsByServiceData,
  get5xxsByServiceData,
  get4xxsData,
  get5xxsData,
  TYPE
}
