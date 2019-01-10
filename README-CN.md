# Naftis

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/xiaomi/naftis/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/XiaoMi/naftis.svg?branch=master)](https://travis-ci.org/XiaoMi/naftis)

[中文](https://github.com/xiaomi/naftis/blob/master/README-CN.md) | [English](https://github.com/xiaomi/naftis/blob/master/README.md)

Naftis 是一个基于 web 的 Istio dashboard，通过任务模板的方式来帮助用户更方便地执行 Istio 任务。
用户可以在 Naftis 中定义自己的任务模板，并填充变量来构造单个或多个构造任务实例，从而完成各种服务治理功能。

## 功能

- 内部集成了一些常用 dashboard
- 可定制的任务模板支持
- 支持回滚指定任务
- 支持指定根服务节点的服务拓扑图
- 提供查看 Istio 的 Services 和 Pod 的支持
- 开箱即用，通过 Kubectl 相关指令即可快速部署
- 支持 Istio 1.0

## 快速开始

```bash
# 下载最新 release 文件和部署清单
wget -O - https://raw.githubusercontent.com/XiaoMi/naftis/master/tool/getlatest.sh | bash

# 在本地 Kubernetes 集群或 Minikuber 上
kubectl create namespace naftis && kubectl apply -n naftis -f mysql.yaml && kubectl apply -n naftis -f naftis.yaml

# 在各云服务商提供的 Kubernetes 集群上，比如 GKE、阿里云、AWS
kubectl create namespace naftis && kubectl apply -n naftis -f mysql-cloud.yaml && kubectl apply -n naftis -f naftis-cloud.yaml

# 通过端口转发的方式访问 Naftis
kubectl -n naftis port-forward $(kubectl -n naftis get pod -l app=naftis-ui -o jsonpath='{.items[0].metadata.name}') 8080:80 &

# 打开浏览器访问 http://localhost:8080，默认用户名和密码分别为 admin、admin。
```

## 详细的部署流程

```bash
# 下载最新 release 文件和部署清单
wget -O - https://raw.githubusercontent.com/XiaoMi/naftis/master/tool/getlatest.sh | bash

# 创建 Naftis 命名空间
$ kubectl create namespace naftis

# 确认 Naftis 命名空间已创建
$ kubectl get namespace naftis
NAME           STATUS    AGE
naftis         Active    18m

# 部署 Naftis MySQL 服务（本地 Kuberenetes 集群）
$ kubectl apply -n naftis -f mysql.yaml
# 部署 Naftis MySQL 服务（云服务商提供的 Kuberenetes 集群）
$ kubectl apply -n naftis -f mysql-cloud.yaml

# 确认 MySQL 已部署
NAME                           READY     STATUS    RESTARTS   AGE
naftis-mysql-c78f99d6c-kblbq   0/1       Running   0          9s
naftis-mysql-test              1/1       Running   0          10s

# 部署 Naftis API 和 UI 服务
kubectl apply -n naftis -f naftis.yaml

# 确认 Naftis 所有的服务已经正确定义并正常运行中
kubectl get svc -n naftis
NAME           TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
naftis-api     ClusterIP      10.233.3.144    <none>        50000/TCP      7s
naftis-mysql   ClusterIP      10.233.57.230   <none>        3306/TCP       55s
naftis-ui      LoadBalancer   10.233.18.125   <pending>     80:31286/TCP   6s

kubectl get pod -n naftis
NAME                           READY     STATUS    RESTARTS   AGE
naftis-api-0                   1/2       Running   0          19s
naftis-mysql-c78f99d6c-kblbq   1/1       Running   0          1m
naftis-mysql-test              1/1       Running   0          1m
naftis-ui-69f7d75f47-4jzwz     1/1       Running   0          19s

# 端口转发访问 Naftis
kubectl -n naftis port-forward $(kubectl -n naftis get pod -l app=naftis-ui -o jsonpath='{.items[0].metadata.name}') 8080:80 &

# 打开浏览器，访问 http://localhost:8080 即可。默认用户名和密码分别为 admin、admin。
```

## 预览

### Dashboard

Dashboard 页面集成了一些常用的图表，比如请求成功率、4XX请求数量等。
![集成了一些常用的图表，比如请求成功率、4XX请求数量等](./tool/img/Naftis-dashboard.png)

### 服务管理

#### 服务详情

服务详情页面可以查看查看已部署到 Kubernetes 中服务信息。
![查看已部署到k8s中服务信息](./tool/img/Naftis-service.png)

#### 服务 Pod 和拓扑图等

服务详情页面可以查看服务 Pod 和拓扑图等信息。
![Services-Pod](./tool/img/Naftis-service-1.png)

### 任务模板管理

#### 任务模板列表

任务模板列表也可以查看已经添加好的任务模板卡片列表。
![任务模板列表](./tool/img/Naftis-tasktpl.png)

#### 查看指定模板

点击“查看模板”可以查看指定模板信息。
![查看指定模板](./tool/img/Naftis-tasktpl-view.png)

#### 新增模板

点击“新增模板”可以向系统中新增自定义模板。添加模板名称、模板简述、模板内容后，
点击 "Generate rows"按钮，Naftis 会解析模板内容，提取变量列表。

用户可以自行修改变量属性，包括变量注释、变量的表单元素类型、变量的数据元等。

**注：默认提供了 `Host`、`Namespace` 两个数据源，如果用户对某个变量指定了这两个数据源，则需要同时将变量的表单元素类型设置为 `SELECT`。**
![新增模板](./tool/img/Naftis-tasktpl-new.png)

#### 创建任务

初始化变量值。
![创建任务-第一步](./tool/img/Naftis-taskcreate-1.png)

确认变量值。
![创建任务-第二步](./tool/img/Naftis-taskcreate-2.png)

提交创建任务的分布表单。
![创建任务-第三步](./tool/img/Naftis-taskcreate-3.png)

#### Istio 诊断

Istio 诊断页面可以查看 Istio Service 和 Pod 状态。
![查看Istio状态](./tool/img/Naftis-istio.png)

## 贡献代码

参考 [CONTRIBUTING](./CONTRIBUTING-CN.md) 来获取提交 patch 和 contributing 工作流的详细信息。

## License

[Apache License 2.0](https://github.com/xiaomi/naftis/blob/master/LICENSE)
