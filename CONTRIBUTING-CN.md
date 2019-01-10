# 如何贡献代码

Nafits 基于 Apache License 2.0 协议开源来接受 PR，这篇文档为开发者提供了进行代码贡献需要了解的要点。

## 准备

- Go >= 1.
- HIUI >= 1.0.0
- Kubernetes >= 1.9.0

### 设置 Go 开发环境

Naftis-api 使用 Go 进行开发，如果你没有 Go 开发环境，可以参考[这里](https://golang.org/doc/install)安装 Go。

### 设置 HIUI 开发环境

Naftis 前端 UI 使用由小米前端组开源的 React 组件 [HIUI](https://xiaomi.github.io/hiui/#/en-US) 构建，参考：

https://github.com/xiaomi/hiui

同时你可以参考[这里](./src/ui/README.md)来获得更详细的信息。

### 设置 Kubernetes 开发环境

你可以安装 [Minikube](https://github.com/kubernetes/minikube)，或者使用云服务商提供的 Kubernetes 集群。

## 启动 naftis-api 和 naftis-ui 服务

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

### 数据移植

```bash
# 执行 sql 语句
mysql> source ./tool/naftis.sql;

# 将 in-local.toml 中的数据库的 DSN 替换成本地 MySQL 实例的 DSN。
```

### 启动 naftis-api 服务

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

### 配置 Nginx 代理

```bash
cp tool/naftis.conf <your-nginx-conf-directory>/naftis.conf
# 酌情修改 naftis.conf 文件并 reload nginx
```

### 启动 naftis-ui 服务

```bash
cd src/ui
npm install
npm run dev

# 打开浏览器访问 http://localhost:5200。
```

## Git 工作流

### 从官方仓库 fork 代码

1. 浏览器访问 https://github.com/xiaomi/naftis
2. 点击 "Fork" 按钮 (位于页面的右上方)

### 从你自己的仓库 Clone 代码

```bash
cd $NAFTIS
git clone https://github.com/$YOUR_GITHUB_ACCOUNT/naftis
cd naftis
git remote add upstream 'https://github.com/xiaomi/naftis'
git config --global --add http.followRedirects 1
```

### 创建分支并修改代码

```bash
git checkout -b my-feature # 创建一个 my-feature 分支
# 修改代码，加入你自己的变更
```

### 让你 fork 仓库和官方仓库同步

```bash
git fetch upstream
git rebase upstream/master
```

### 向你 fork 仓库提交 commits

```bash
git add .
git commit
git push origin my-feature # 推送 my-featur 到你自己的仓库
```
### 提交 PR

```bash
你可以访问 https://github.com/$YOUR_GITHUB_ACCOUNT/naftis 或者  https://github.com/xiaomi/naftis 来浏览你的分支 (比如 "my-feature")。

点击 "Compare" 按钮来比较变更, 然后点击你的 "my-feature" 分支旁边的 "Pull request" 按钮来提交 PR。
```

### Review 代码

一个 PR 必须至少有一个人 review，review 无误后由 admin 合并至 master 分支。

## 代码结构

```bash
.
├── bin                         # 存放编译好的 Go 二进制文件
├── config                      # 存放配置文件
│   ├── in-cluster.toml         # 在 Kubernetes 集群中启动的配置
│   └── in-local.toml           # 本地启动的配置
├── install                     # Helm Charts
│   └── helm
│       ├── mysql
│       └── naftis
├── src                         # 源码
│   ├── api                     # 后端 Go API 服务源码
│   │   ├── bootstrap           # 启动 Go API 服务相关参数包
│   │   ├── executor            # task 队列执行器
│   │   ├── handler             # HTTP handlers
│   │   ├── log                 # 基于 zap 封装的 log 包
│   │   ├── middleware          # HTTP 中间件
│   │   ├── model               # 全局通用 model
│   │   ├── router              # HTTP 路由
│   │   ├── service             # 封装好的服务
│   │   ├── storer              # db storer
│   │   ├── util                # 工具类包
│   │   ├── version             # 提供运行时的版本信息等显示的支持
│   │   ├── worker              # task worker
│   │   └── main.go             # Go API 入口
│   └── ui                      # 前端源码
│       ├── build               # Webpack 打包脚本
│       ├── src                 # 前端 js 源码
│       ├── package.json
│       ├── package-lock.json
│       ├── postcss.config.js
│       ├── README-CN.md
│       └── README.md
├── tool                        # Makefile 可能会用到的一些编译脚本
│   ├── img
│   ├── apppkg.sh
│   ├── build.sh
│   ├── cleanup.sh              # 清理 Naftis
│   ├── conn.sh
│   ├── genmanifest.go          # 生成 Kubernetes 部署清单
│   ├── gentmpl.go
│   ├── naftis.sql              # Naftis 数据迁移脚本
│   ├── naftis.conf             # Naftis Nginx 配置文件
│   └── version.sh
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

## Go 依赖

我们目前使用 [dep](https://github.com/golang/dep) 管理依赖。

```bash
# 安装 dep
go get -u github.com/golang/dep
dep ensure -v # 安装 Go 依赖
```

## 代码风格

- [Go: CodeReviewComments](https://github.com/golang/go/wiki/CodeReviewComments)
- [React: Standardjs](https://standardjs.com/)

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