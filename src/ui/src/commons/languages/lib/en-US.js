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

const appLocaleData = require('react-intl/locale-data/en')

/**
 * All messages' fileds must be defined in all language package.
 * FQDN(Fully Qualified Domain Name) of messages' field is constructed as follow schema:
 * "app.common.{KEY}"
 * "app.{VIEW}.{KEY}"
 * "app.{VIEW}.{COMPONENT}.{KEY}"
 * "app.{COMPONENT}.{KEY}"
 */
export default {
  appLocaleData,
  locale: 'en-US',
  messages: {
    // common
    'app.common.cancel': 'Cancel',
    'app.common.confirm': 'Confirm',
    'app.common.delete': 'Delete',
    'app.common.submit': 'Submit',
    'app.common.next': 'Next',
    'app.common.previous': 'Previous',
    'app.common.return': 'Return',
    'app.common.home': 'Home',

    // request and response
    'app.common.err400': 'Sorry, you have sent a bad request.',
    'app.common.err401': 'Sorry, you are not unauthorized.',
    'app.common.err403': 'Sorry, you are not allowed to access this page.',
    'app.common.err404': 'Sorry, resources not found.',
    'app.common.err408': 'Sorry, response timeout.',
    'app.common.err500': 'Sorry, internal server error.',
    'app.common.err501': 'Sorry, the method has not been implemented.',
    'app.common.err502': 'Sorry, the server was acting as a gateway or proxy error.',
    'app.common.err503': 'Sorry, the server is unvailable.',
    'app.common.err504': 'Sorry, gateway timeout.',
    'app.common.err505': 'Sorry, the service does not support HTTP protocol.',
    'app.common.errOther': 'Sorry, some errors have occured.',

    // sign in page
    'app.common.signInUsername': 'Your username',
    'app.common.signInPwd': 'Your password',
    'app.common.signInAutoSignIn': 'Auto sign in',
    'app.common.signInForgotPwd': 'Forgot password?',
    'app.common.signIn': 'Sign In',

    // worktop page
    'app.common.totalServices': 'Total Service',
    'app.common.totalPods': 'Total Pods',
    'app.common.4xxCnt': '4xx Request Count',
    'app.common.5xxCnt': '5xx Request Count',
    'app.common.globalSuccRate': 'Global Success Rate',
    'app.common.4xxTrendsBySvc': '4xx Trends By Service',
    'app.common.5xxTrendsBySvc': '5xx Trends By Service',

    // service page
    'app.common.service': 'Service: ',
    'app.common.services': 'Services: ',
    'app.common.services.chooseSvcCmt': 'Please choose service from left tree.',
    'app.common.runningStatus': 'Running Status',
    'app.common.executedTasks': 'Executed Task',
    'app.common.executeTask': 'Execut Task',
    'app.common.rollback': 'Rollback',
    'app.common.success': 'Success',
    'app.common.waitTaskExec': 'WaitTaskExec',
    'app.common.tb.svcName': 'Name',
    'app.common.tb.svcType': 'Type',
    'app.common.tb.svcClusterIP': 'Cluster IP',
    'app.common.tb.svcExternalIP': 'External IP',
    'app.common.tb.svcPorts': 'Ports',
    'app.common.tb.svcAge': 'Age',
    'app.common.tb.podName': 'Name',
    'app.common.tb.podReady': 'Ready',
    'app.common.tb.podStatus': 'Status',
    'app.common.tb.podRestarts': 'Restarts',
    'app.common.tb.podAge': 'Age',
    'app.common.tb.taskOpType': 'Template',
    'app.common.tb.taskOpUser': 'Operator',
    'app.common.tb.taskResult': 'Execute Result',
    'app.common.tb.taskCreateTime': 'Create Time',
    'app.common.tb.taskOp': 'Operation',

    // pod page
    'app.common.pod': 'Pod: ',
    'app.common.pods': 'Pods: ',
    'app.common.serviceGraph': 'Service Graph',

    // task template
    'app.common.task': 'Task',
    'app.common.currentService': 'Current Service: ',
    'app.common.tplCmt': 'Choose the template to custom and execute your own task.',
    'app.common.viewTpl': 'View Template',
    'app.common.deleteTpl': 'Delete Template',
    'app.common.createTask': 'Create Task',
    'app.common.newTpl': 'New Template',
    'app.common.createTaskStep1': 'Fill in variables',
    'app.common.createTaskStep2': 'Confirm variables',
    'app.common.createTaskStep3': 'Completed',
    'app.common.createTaskStep2Cmt':
    'Confirm follow information, make sure the tasks are ready to executed.',
    'app.common.continue': 'Continue',
    'app.common.task.init': 'Initiating task...',
    'app.common.task.executing': 'Executing task...',
    'app.common.task.executedSucc': 'Task executed success!',
    'app.common.task.executedFail': 'Task executed fail!',
    'app.common.task.fetchInfoFail': `Can't fetch task information!`,
    'app.common.task.modalName': 'Name: ',
    'app.common.task.modalBrief': 'Brief: ',
    'app.common.task.modalContent': 'Content: ',
    'app.common.task.modalVars': 'Variables: ',
    'app.common.task.tb.name': 'Name',
    'app.common.task.tb.title': 'Title',
    'app.common.task.tb.comment': 'Comment',
    'app.common.task.tb.formType': 'Form Element Type',
    'app.common.task.tb.dataSource': 'Datasource',
    'app.common.task.tb.op': 'Operation',

    // istio diagnose template
    'app.common.istioCmt': "Show services' and pod' status of istio.",
    'app.common.istioDoc': 'Istio Doc',

    // menu
    'app.menu.worktop': 'Dashboard',
    'app.menu.worktop.overview': 'Overview',
    'app.menu.service': 'Services',
    'app.menu.service.manager': 'Services',
    'app.menu.service.list': 'Services',
    'app.menu.istio': 'Istio',

    // others
    'app.common.name': 'Name',
    'app.common.query': 'Query',
    'app.common.export': 'Export',
    'app.common.reset': 'Reset',
    'app.common.nodata': 'None',
    'app.common.view': 'View',
    'app.common.status': 'Status',
    'app.common.create': 'Create',
    'app.common.restart': 'Restarts',
    'app.common.beginTime': 'BeginTime',
    'app.common.endTime': 'EndTime',
    'app.common.createTime': 'CreateTime'
  }
}
