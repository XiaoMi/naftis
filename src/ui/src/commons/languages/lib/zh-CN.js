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

const appLocaleData = require('react-intl/locale-data/zh')

/**
 * 所有语言包都需包含同样的message KEY
 * messages命令规范如下：
 * 'app.common.{KEY}'
 * 'app.{VIEW}.{KEY}'
 * 'app.{VIEW}.{COMPONENT}.{KEY}'
 * 'app.{COMPONENT}.{KEY}'
 */
export default {
  appLocaleData,
  locale: 'zh-CN',
  messages: {
    // common
    'app.common.cancel': '取消',
    'app.common.confirm': '确认',
    'app.common.delete': '删除',
    'app.common.submit': '提交',
    'app.common.next': '下一步',
    'app.common.previous': '上一步',
    'app.common.return': '返回',
    'app.common.home': '首页',

    // request and response
    'app.common.err400': '抱歉，错误的请求。',
    'app.common.err401': '抱歉，请登陆后再访问。',
    'app.common.err403': '抱歉，你无权访问该页面。',
    'app.common.err404': '抱歉，你访问的页面不存在。',
    'app.common.err408': '抱歉，请求超时。',
    'app.common.err500': '抱歉，服务器出错了。',
    'app.common.err501': '抱歉，服务器未实现此方法。',
    'app.common.err502': '抱歉，服务器网关错误。',
    'app.common.err503': '抱歉，服务器不可用。',
    'app.common.err504': '抱歉，服务器超时。',
    'app.common.err505': '抱歉，HTTP版本不受支持。',
    'app.common.errOthers': '抱歉，遇到一些错误。',

    // sign in page
    'app.common.signInUsername': '用户名',
    'app.common.signInPwd': '密码',
    'app.common.signInAutoSignIn': '自动登陆',
    'app.common.signInForgotPwd': '忘记密码？',
    'app.common.signIn': '登陆',

    // worktop page
    'app.common.totalServices': '总服务数',
    'app.common.totalPods': '总Pod数',
    'app.common.4xxCnt': '4xx请求数量',
    'app.common.5xxCnt': '5xx请求数量',
    'app.common.globalSuccRate': '请求成功率',
    'app.common.4xxTrendsBySvc': '4xx分服务趋势',
    'app.common.5xxTrendsBySvc': '5xx分服务趋势',

    // service page
    'app.common.service': '服务：',
    'app.common.services': '服务：',
    'app.common.services.chooseSvcCmt': '请先选择左侧相应的服务。',
    'app.common.runningStatus': '运行状态',
    'app.common.executedTasks': '已执行任务',
    'app.common.executeTask': '执行任务',
    'app.common.rollback': '回滚',
    'app.common.success': '操作成功',
    'app.common.waitTaskExec': '等待任务执行',
    'app.common.tb.svcName': '名称',
    'app.common.tb.svcType': '负载均衡类型',
    'app.common.tb.svcClusterIP': '集群IP',
    'app.common.tb.svcExternalIP': '外部IP',
    'app.common.tb.svcPorts': '端口列表',
    'app.common.tb.svcAge': '运行时长',
    'app.common.tb.podName': '名称',
    'app.common.tb.podReady': '容器状态',
    'app.common.tb.podStatus': '状态',
    'app.common.tb.podRestarts': '重启次数',
    'app.common.tb.podAge': '运行时长',
    'app.common.tb.taskOpType': '模板',
    'app.common.tb.taskOpUser': '操作人',
    'app.common.tb.taskResult': '操作结果',
    'app.common.tb.taskCreateTime': '创建时间',
    'app.common.tb.taskOp': '操作',

    // pod page
    'app.common.pod': 'Pod: ',
    'app.common.pods': 'Pods: ',
    'app.common.serviceGraph': '服务拓扑',

    // task template
    'app.common.task': '任务',
    'app.common.currentService': '当前服务: ',
    'app.common.tplCmt': '选择指定模板来创建并执行任务。',
    'app.common.viewTpl': '查看模板',
    'app.common.deleteTpl': '删除模板',
    'app.common.createTask': '创建任务',
    'app.common.newTpl': '新增模板',
    'app.common.createTaskStep1': '填写变量',
    'app.common.createTaskStep2': '确认变量',
    'app.common.createTaskStep3': '完成',
    'app.common.createTaskStep2Cmt': '确认以下信息，该任务即将被执行。',
    'app.common.continue': '继续创建任务',
    'app.common.task.init': '任务初始化中...',
    'app.common.task.executing': '任务执行中...',
    'app.common.task.executedSucc': '任务执行成功！',
    'app.common.task.executedFail': '任务执行失败！',
    'app.common.task.fetchInfoFail': '获取任务数据失败！',
    'app.common.task.modalName': '模板名：',
    'app.common.task.modalBrief': '模板简介：',
    'app.common.task.modalContent': '模板内容：',
    'app.common.task.modalVars': '模板变量：',
    'app.common.task.tb.name': '变量名',
    'app.common.task.tb.title': '标题',
    'app.common.task.tb.comment': '注释',
    'app.common.task.tb.formType': '表单元素类型',
    'app.common.task.tb.dataSource': '数据源',
    'app.common.task.tb.op': '操作',

    // istio diagnose template
    'app.common.istioCmt': '显示istio服务和Pod相关信息。',
    'app.common.istioDoc': 'Istio 文档',

    // menu
    'app.menu.worktop': '工作台',
    'app.menu.worktop.overview': '概览',
    'app.menu.service': '服务概览',
    'app.menu.service.manager': '服务管理',
    'app.menu.service.list': '服务列表',
    'app.menu.istio': 'Istio概览',

    // others
    'app.common.name': '名字',
    'app.common.query': '查询',
    'app.common.export': '导出',
    'app.common.reset': '重置',
    'app.common.nodata': '暂无数据',
    'app.common.view': '查看',
    'app.common.status': '状态',
    'app.common.create': '创建',
    'app.common.restart': '重启',
    'app.common.beginTime': '开始时间',
    'app.common.endTime': '结束时间',
    'app.common.createTime': '创建时间'
  }
}
