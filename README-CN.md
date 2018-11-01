# Naftis

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/xiaomi/naftis/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/XiaoMi/naftis.svg?branch=master)](https://travis-ci.org/XiaoMi/naftis)

[中文](https://github.com/xiaomi/naftis/blob/master/README-CN.md) | [English](https://github.com/xiaomi/naftis/blob/master/README.md)

Naftis 是一个基于 web 的 Istio dashboard，通过任务模板的方式来帮助用户更方便地执行 Istio 任务。
用户可以在 Naftis 中定义自己的任务模板，并填充变量来构造单个或多个构造任务实例，从而完成各种服务治理功能。

## 文档

<!-- TOC -->

- [Naftis](#naftis)
  - [文档](#文档)
  - [代码结构](#代码结构)
  - [功能](#功能)
  - [依赖](#依赖)
    - [HIUI](#HIUI)
  - [快速开始](#快速开始)
  - [详细的部署流程](#详细的部署流程)
    - [Kubernetes 集群内运行](#kubernetes-集群内运行)
    - [本地运行](#本地运行)
      - [数据移植](#数据移植)
    - [启动 API 服务](#启动-api-服务)
      - [配置 Nginx 代理](#配置-nginx-代理)
      - [启动前端 Node 代理](#启动前端-node-代理)
  - [预览](#预览)
    - [Dashboard](#dashboard)
    - [服务管理](#服务管理)
      - [服务详情](#服务详情)
      - [服务 Pod 和拓扑图等](#服务-pod-和拓扑图等)
    - [任务模板管理](#任务模板管理)
      - [任务模板列表](#任务模板列表)
      - [查看指定模板](#查看指定模板)
      - [新增模板](#新增模板)
      - [创建任务](#创建任务)
      - [Istio 诊断](#istio-诊断)
  - [Docker 镜像](#docker-镜像)
  - [开发者指南](#开发者指南)
    - [获取源码](#获取源码)
    - [配置环境变量](#配置环境变量)
    - [Go 依赖](#go-依赖)
    - [代码风格](#代码风格)
  - [其他指令](#其他指令)
  - [架构](#架构)
  - [TODO 列表](#todo-列表)

<!-- /TOC -->

## 代码结构

```bash
.
├── bin                         # 存放编译好的 Go 二进制文件
├── config                      # 存放配置文件
│   ├── in-cluster.toml         # 在 Kubernetes 集群中启动的配置
│   └── in-local.toml           # 本地启动的配置
├── install                     # Helm Charts
│   └── helm
│       ├── mysql
│       └── naftis
├── src                         # 源码
│   ├── api                     # 后端 Go API 服务源码
│   │   ├── bootstrap           # 启动 Go API 服务相关参数包
│   │   ├── executor            # task 队列执行器
│   │   ├── handler             # HTTP handlers
│   │   ├── log                 # 基于 zap 封装的 log 包
│   │   ├── middleware          # HTTP 中间件
│   │   ├── model               # 全局通用 model
│   │   ├── router              # HTTP 路由
│   │   ├── service             # 封装好的服务
│   │   ├── storer              # db storer
│   │   ├── util                # 工具类包
│   │   ├── version             # 提供运行时的版本信息等显示的支持
│   │   ├── worker              # task worker
│   │   └── main.go             # Go API 入口
│   └── ui                      # 前端源码
│       ├── build               # Webpack 打包脚本
│       ├── src                 # 前端 js 源码
│       ├── package.json
│       ├── package-lock.json
│       ├── postcss.config.js
│       ├── README-CN.md
│       └── README.md
├── tool                        # Makefile 可能会用到的一些编译脚本
│   ├── img
│   ├── apppkg.sh
│   ├── build.sh
│   ├── cleanup.sh              # 清理 Naftis
│   ├── conn.sh
│   ├── genmanifest.go          # 生成 Kubernetes 部署清单
│   ├── gentmpl.go
│   ├── naftis.sql              # Naftis 数据迁移脚本
│   ├── naftis.conf             # Naftis Nginx 配置文件
│   └── version.sh
├── vendor                      # Go 依赖
├── Dockerfile.api              # 编译 Go API 镜像的 dockerfile
├── Dockerfile.ui               # 编译前端 UI 镜像的 dockerfile
├── Gopkg.lock                  # dep 版本锁定文件，由 dep 生成
├── Gopkg.toml                  # dep 版本约束文件，用户可编辑
├── LICENSE
├── Makefile                    # Makefile文件
├── mysql.yaml                  # Kubernetes MySQL 部署清单，由 Helm 生成
├── naftis.yaml                 # Kubernetes API 和 UI 部署清单，由 Helm 生成
├── README-CN.md
├── README.md
└── run                         # 本地快速启动脚本
```

## 功能

- 内部集成了一些常用 dashboard
- 可定制的任务模板支持
- 支持回滚指定任务
- 支持指定根服务节点的服务拓扑图
- 提供查看 Istio 的 Services 和 Pod 的支持
- 开箱即用，通过 Kubectl 相关指令即可快速部署
- 支持 Istio 1.0

## 依赖

目前 Naftis 仅支持 Kubernetes，不支持其他容器调度平台。

- Istio > 1.0
- Kubernetes >= 1.9.0
- HIUI >= 1.0.0

### HIUI

Naftis 前端 UI 使用由小米前端组开源的 React 组件 HIUI 构建，参考：

https://github.com/XiaoMi/hiui

## 快速开始

```bash
kubectl create namespace naftis && kubectl apply -n naftis -f mysql.yaml && kubectl apply -n naftis -f naftis.yaml

# 通过端口转发的方式访问 Naftis
kubectl -n naftis port-forward $(kubectl -n naftis get pod -l app=naftis-ui -o jsonpath='{.items[0].metadata.name}') 8080:80 &

# 打开浏览器访问 http://localhost:8080，默认用户名和密码分别为 admin、admin。
```

## 详细的部署流程

### Kubernetes 集群内运行

```bash
# 创建 Naftis 命名空间
$ kubectl create namespace naftis

# 确认 Naftis 命名空间已创建
$ kubectl get namespace naftis
NAME           STATUS    AGE
naftis         Active    18m

# 部署 Naftis MySQL服务
$ kubectl apply -n naftis -f mysql.yaml

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

### 本地运行

#### 数据移植

```bash
# 执行 sql 语句
mysql> source ./tool/naftis.sql;

# 将 in-local.toml 中的数据库的 DSN 替换成本地 MySQL 实例的 DSN。
```

### 启动 API 服务

- Linux

```bash
make build && ./bin/naftis-api start -c config/in-local.toml -i=false
```

或

```bash
./run
```

- Mac OS

```bash
GOOS=darwin GOARCH=amd64 make build && ./bin/naftis-api start -c config/in-local.toml -i=false
```

或

```bash
GOOS=darwin GOARCH=amd64 ./run
```

#### 配置 Nginx 代理

```bash
cp tool/naftis.conf <your-nginx-conf-directory>/naftis.conf
# 酌情修改 naftis.conf 文件并 reload nginx
```

#### 启动前端 Node 代理

```bash
cd src/ui
npm install
npm run dev

# 打开浏览器访问 http://localhost:5200。
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

**注：默认提供了 `Host`、`Namespace` 两个数据源，如果用户对某个变量指定了这两个
数据源，则需要同时将变量的表单元素类型设置为 `SELECT`。**
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

## Docker 镜像

Naftis 的 API 和 UI 镜像已经发布到 Docker Hub 上，见 [api](https://hub.docker.com/r/sevennt/naftis-api/) 和 [ui](https://hub.docker.com/r/sevennt/naftis-ui/)。

## 开发者指南

### 获取源码

```bash
go get github.com/xiaomi/naftis
```

### 配置环境变量

将下述环境变量添加到 ~/.profile。我们强烈推荐通过 [autoenv](https://github.com/kennethreitz/autoenv) 来配置环境变量。

```bash
# Change GOOS and GOARCH with your environment.
export GOOS="linux"   # or replace with "darwin", etc.
export GOARCH="amd64" # or replace with "386", etc.

# Change USER with your Docker Hub account for pulling and pushing custom docker container builds.
export USER="sevennt"
export HUB="docker.io/$USER"
```

如果你使用 [autoenv](https://github.com/kennethreitz/autoenv)，则输入 `cd .` 来使环境变量生效。

### Go 依赖

我们目前使用 [dep](https://github.com/golang/dep) 管理依赖。

```bash
# 安装 dep
go get -u github.com/golang/dep
dep ensure -v # 安装 Go 依赖
```

### 代码风格

- [Go](https://github.com/golang/go/wiki/CodeReviewComments)
- [React](https://standardjs.com/)

## 其他指令

```bash
make                # 编译所有 targets

make build          # 编译 Go 二进制文件、前端静态资源、Kubernetes 清单
make build.api      # 编译 Go 二进制文件
make build.ui       # 编译前端静态资源
make build.manifest # 编译 Kubernetes 清单

make fmt  # 格式化 Go 代码
make lint # lint Go 代码
make vet  # vet Go 代码
make test # 运行测试用例
make tar  # 打包成压缩文件

make docker     # 编译 docker 镜像
make docker.api # 编译后端 docker 镜像
make docker.ui  # 编译前端 docker 镜像
make push       # 把镜像推送到 Docker Hub

./bin/naftis-api -h      # 显示帮助信息
./bin/naftis-api version # 显示版本信息

helm template install/helm/naftis --name naftis --namespace naftis > naftis.yaml # 本地渲染 Kubernetes 清单

./tool/cleanup.sh # 清理已部署的 Naftis
```

## 架构

![Naftis-arch](./tool/img/Naftis-arch.png)

## TODO 列表

- [ ] 添加测试用例
- [ ] 支持 Istio 资源查询
- [ ] 添加 Grafana, Jaeger, Prometheus 链接入口

## License

[Apache License 2.0](https://github.com/xiaomi/naftis/blob/master/LICENSE)
