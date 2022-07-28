# How to contribute

Naftis is Apache 2.0 licensed and accepts contributions via GitHub pull requests. This document outlines me of the conventions on commit message formatting, contact points for developers, and other resources to help get contributions into Naftis.

## Prerequisites

- Go >= 1.
- HIUI >= 1.0.0
- Kubernetes >= 1.9.0

### Setting up Go

Naftis-api is written in the Go programming language. To build, you'll need a Go development environment. If you haven't set up a Go development environment, please follow [these instructions](https://golang.org/doc/install) to install the Go tools.

### Setting up HIUI

Naftis dashboard uses [HIUI](https://xiaomi.github.io/hiui/#/en-US) (a React based UI component released by Xiaomi FE Team) to build the responsive UI. For more information:

https://github.com/xiaomi/hiui

To build ui assets, you'll need a Node.js development environment. You can read [these](./src/ui/README.md) for forther information.

### Setting up kubernetes

You can setup a Kubernetes cluster with [Minikube](https://github.com/kubernetes/minikube), or launch a cluster with your own cloud Kubernetes service.

## Starting naftis-api and naftis-ui service

### Setting environment variables

Add the follow exports to your ~/.profile. [autoenv](https://github.com/kennethreitz/autoenv) is also strongly recommended.

```bash
# Change GOOS and GOARCH with your environment.
export GOOS="linux"   # or replace with "darwin", etc.
export GOARCH="amd64" # or replace with "386", etc.

# Change USER with your Docker Hub account for pulling and pushing custom docker container builds.
export USER="sevennt"
export HUB="docker.io/$USER"
```

If you choose [autoenv](https://github.com/kennethreitz/autoenv) to export environment variables, type `cd .` to make it work.


### Migration database

```bash
# run migrate sql script
mysql> source ./tool/naftis.sql;

# modify in-local.toml and replace with your own MySQL DSN.
```

### Start naftis-api

- Linux

```bash
make build && ./bin/naftis-api start -c config/in-local.toml -i=false # building and starting naftis-api
```

or

```bash
./run
```

- Mac OS

```bash
GOOS=darwin GOARCH=amd64 make build && ./bin/naftis-api start -c config/in-local.toml -i=false # building and starting naftis-api
```

or

```bash
GOOS=darwin GOARCH=amd64 ./run
```

### Modify nginx proxy config

```bash
cp tool/naftis.conf <your-nginx-conf-directory>/naftis.conf
# modify naftis.conf and then reload Nginx
```

### Start naftis-ui

```bash
cd src/ui
npm install
npm run dev # start node proxy

# Explore http://localhost:5200/ with your browser.
```

## Git workflow

### Fork the main repository

1. Go to https://github.com/xiaomi/naftis
2. Click the "Fork" button (at the top right)

### Clone your fork

```bash
cd $NAFTIS
git clone https://github.com/$YOUR_GITHUB_ACCOUNT/naftis
cd naftis
git remote add upstream 'https://github.com/xiaomi/naftis'
git config --global --add http.followRedirects 1
```

### Create a branch and make changes

```bash
git checkout -b my-feature
# Make your code changes
```

### Keeping your fork in sync

```bash
git fetch upstream
git rebase upstream/master
```

### Committing changes to your fork

```bash
git add .
git commit
git push origin my-feature
```
### Creating a pull request

```bash
Visit https://github.com/$YOUR_GITHUB_ACCOUNT/naftis if you created a fork in your own github repository, or https://github.com/xiaomi/naftis and navigate to your branch (e.g. "my-feature").
Click the "Compare" button to compare the change, and then the "Pull request" button next to your "my-feature" branch.
```

### Getting a code review

Once your pull request has been opened it will be assigned to one or more reviewers. 

## Code Structure

```bash
.
├── bin                         # directory store binary
├── config                      # directory store configuration files
│   ├── in-cluster.toml         # in Kubernetes cluster configuration file
│   ├── in-local.toml           # in local machine configuration file
├── install                     # Helm Charts
│   └── helm
│       ├── mysql
│       └── naftis
├── src                         # source code
│   ├── api                     # backend server source code
│   │   ├── bootstrap           # store start arguments
│   │   ├── executor            # execute tasks from task queue
│   │   ├── handler             # HTTP handlers
│   │   ├── log                 # log package wraps zap
│   │   ├── middleware          # HTTP middlewares
│   │   ├── model               # common models
│   │   ├── router              # HTTP routers
│   │   ├── service             # some wraped services
│   │   ├── storer              # db storer
│   │   ├── util                # utilities
│   │   ├── version             # provides build-in version message
│   │   ├── worker              # task worker
│   │   └── main.go             # index of backend server
│   └── ui                      # frontend source code
│       ├── build               # webpack scripts
│       ├── src                 # truly frontend source code
│       ├── package.json
│       ├── package-lock.json
│       ├── postcss.config.js
│       ├── README-CN.md
│       └── README.md
├── tool                        # some shell and migrate scripts
│   ├── img
│   ├── apppkg.sh
│   ├── build.sh
│   ├── cleanup.sh              # clean up Naftis
│   ├── conn.sh
│   ├── genmanifest.sh          # generate manifest for Naftis deployment in Kubernetes
│   ├── gentmpl.go
│   ├── naftis.sql              # Naftis migrate sql scripts
│   ├── naftis.conf             # Naftis Nginx configuration file
│   └── version.sh
├── vendor                      # go dependencies
├── Dockerfile.api              # backend image dockerfile
├── Dockerfile.ui               # frontend image dockerfile
├── Gopkg.lock                  # dep depencies version lock file
├── Gopkg.toml                  # dep depencies version primarily hand-edited file
├── LICENSE
├── Makefile                    # project's makefile
├── mysql.yaml                  # Kubernetes Naftis API and UI manifest, generate by Helm
├── naftis.yaml                 # Kubernetes Naftis MySQL manifest, generate by Helm
├── README-CN.md
├── README.md
└── run                         # shortcut script for local running
```

## Go Dependency

We use [dep](https://github.com/golang/dep) to manage our go dependencies. 

```bash
# install dep
go get -u github.com/golang/dep
dep ensure -v # install dependcies
```

### Code Style

- [Go: CodeReviewComments](https://github.com/golang/go/wiki/CodeReviewComments)
- [React: Standardjs](https://standardjs.com/)

## Some Directives

```bash
make                # make all targets

make build          # build api binaries, frontend assets, and Kubernetes manifest
make build.api      # build backend binaries
make build.ui       # build frontend assets
make build.manifest # build Kubernetes manifest

make fmt  # go fmt codes
make lint # lint codes
make vet  # vet codes
make test # run tests
make tar  # compress directories

make docker      # build docker images
make docker.api  # build backend docker images
make docker.ui   # build frontend docker images
make push        # push images to docker.io

./bin/naftis-api -h      # show help messages
./bin/naftis-api version # show binary build version messages

./tool/cleanup.sh # clean up Naftis
```

## Architecture

![Naftis-arch](./tool/img/Naftis-arch.png)