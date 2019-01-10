# Naftis

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/xiaomi/naftis/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/XiaoMi/naftis.svg?branch=master)](https://travis-ci.org/XiaoMi/naftis)

[English](https://github.com/xiaomi/naftis/blob/master/README.md) | [中文](https://github.com/xiaomi/naftis/blob/master/README-CN.md)

Naftis is a web-based dashboard for Istio. It helps user manage their Istio tasks more easily.
Using Naftis we can custom our own task templates, then build task from them and execute it.

## Features

- Integrates with some real-time dashboards
- Customizable task template
- Support Rollback specific task
- Optimized Istio service graph with supporting of specifying particular root service node
- With diagnose data of Istio services and pods
- Out of the box, easy deployment with `kubectl` commands
- Istio 1.0 supported

## Quick started

```bash
# download latest Naftis release files and manifest
wget -O - https://raw.githubusercontent.com/XiaoMi/naftis/master/tool/getlatest.sh | bash

# deploy Naftis under bare metal Kubernetes
kubectl create namespace naftis && kubectl apply -n naftis -f mysql.yaml && kubectl apply -n naftis -f naftis.yaml

# deploy Naftis under cloud Kubernetes cluster, such as GKE, Amazon EKS, Alibaba Cloud Kubernetes
kubectl create namespace naftis && kubectl apply -n naftis -f mysql-cloud.yaml && kubectl apply -n naftis -f naftis.yaml

# port forward Naftis
kubectl -n naftis port-forward $(kubectl -n naftis get pod -l app=naftis-ui -o jsonpath='{.items[0].metadata.name}') 8080:80 &

# explorer http://localhost:8080/ with your browser, default user name and password is "admin".
```

## Detailed deployments

```bash
# download latest Naftis files and manifest
wget -O - https://raw.githubusercontent.com/XiaoMi/naftis/master/tool/getlatest.sh | bash

# create Naftis namespace
$ kubectl create namespace naftis

# ensure Naftis namespace is created
$ kubectl get namespace naftis
NAME           STATUS    AGE
naftis         Active    18m

# deploy Naftis MySQL service under bare metal Kubernetes
$ kubectl apply -n naftis -f mysql.yaml
# deploy Naftis MySQL service under cloud Kubernetes cluster, such as GKE, Amazon EKS, Alibaba Cloud Kubernetes
$ kubectl apply -n naftis -f mysql-cloud.yaml

# ensure MySQL service is deployed
$ kubectl get svc -n naftis
NAME                           READY     STATUS    RESTARTS   AGE
naftis-mysql-c78f99d6c-kblbq   1/1       Running   0          9s
naftis-mysql-test              1/1       Running   0          10s

# deploy Naftis API and UI service
$ kubectl apply -n naftis -f naftis.yaml

# ensure Naftis all services is correctly defined and running
$ kubectl get svc -n naftis
NAME           TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
naftis-api     ClusterIP      10.233.3.144    <none>        50000/TCP      7s
naftis-mysql   ClusterIP      10.233.57.230   <none>        3306/TCP       55s
naftis-ui      LoadBalancer   10.233.18.125   <pending>     80:31286/TCP   6s

$ kubectl get pod -n naftis
NAME                           READY     STATUS    RESTARTS   AGE
naftis-api-0                   1/2       Running   0          19s
naftis-mysql-c78f99d6c-kblbq   1/1       Running   0          1m
naftis-mysql-test              1/1       Running   0          1m
naftis-ui-69f7d75f47-4jzwz     1/1       Running   0          19s

# browse Naftis via port-forward
$ kubectl -n naftis port-forward $(kubectl -n naftis get pod -l app=naftis-ui -o jsonpath='{.items[0].metadata.name}') 8080:80 &
```

Explorer [http://localhost:8080/](http://localhost:8080/) with your browser, default user name and password is "admin".

## Previews

### Dashboard

![Dashboard](./tool/img/Naftis-dashboard.png)

### Services

#### Service detail

![Services-Detail](./tool/img/Naftis-service.png)

#### Service pod

![Services-Pod](./tool/img/Naftis-service-1.png)

### Task templates

#### Task tpl

![Task Tpl](./tool/img/Naftis-tasktpl.png)

#### Task view

![Task View](./tool/img/Naftis-tasktpl-view.png)

#### Task new

![Task New](./tool/img/Naftis-tasktpl-new.png)

#### Create task

![Create Task Step1](./tool/img/Naftis-taskcreate-1.png)

![Create Task Step2](./tool/img/Naftis-taskcreate-2.png)

![Create Task Step3](./tool/img/Naftis-taskcreate-3.png)

#### Istio diagnosis

![Istio Diagnosis](./tool/img/Naftis-istio.png)

## Contribution

See [CONTRIBUTING](./CONTRIBUTING.md) for details on submitting patches and the contribution workflow.

## License

[Apache License 2.0](https://github.com/xiaomi/naftis/blob/master/LICENSE)
