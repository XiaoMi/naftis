# Istio Client

Naftis 前端源码，基于 React 16.4，webpack4，注意 React 16.4 的一些生命周期的变化。

前端 UI 采用 [hi-ui](https://www.npmjs.com/package/@hi-ui/hiui) 开发。

## 开发

```sh
$ npm i
# open development
$ npm run dev
# build
$ npm run build
```

打开浏览器，访问 `http://localhost:5200` 即可

> note: 端口号可以在 package.json 中修改 `"dev": "cross-env NODE_ENV=development PORT=5200 node build/webpack.dev.config.js"`

## 规范

项目使用 [Standard JS](https://standardjs.com/readme-zhcn.html) 规范，**提交文件时候会自动检测js文件，如果有问题则需要修复后才可以提交**😂

React 组件文件名采取大驼峰规则，其他文件名采取小驼峰规则。

## 文件夹规则

* public 文件夹用来存放静态文件，其他被使用的文件夹会被打包到项目代码中。

## 目录结构

```sh
├── build
│   ├── webpack.base.config.js
│   ├── webpack.dev.config.js
│   └── webpack.production.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── src
│   ├── App.js
│   ├── assets
│   │   └── tpl
│   │       └── trafficShifting.png
│   ├── commons
│   │   └──languages
│   │       ├── index.js
│   │       └── lib
│   │           ├── en-US.js
│   │           └── zh-CN.js
│   ├── components
│   │   └── NavMenu
│   │       ├── index.js
│   │       └── index.scss
│   ├── config
│   │   ├── development.js
│   │   ├── index.js
│   │   ├── local.js
│   │   └── production.js
│   ├── index.html
│   ├── index.js
│   ├── public
│   │   └── js
│   │       ├── cola.min.js
│   │       └── d3.v4.min.js
│   ├── redux
│   │   ├── actions
│   │   │   └── worktop
│   │   │       └── serviceStatus
│   │   │           └── index.js
│   │   ├── reducers
│   │   │   └── worktop
│   │   │       └── serviceStatus
│   │   │           └── index.js
│   │   └── store
│   │       └── index.js
│   ├── utils
│   │   ├── base64.js
│   │   └── md5.js
│   └── views
│       ├── Worktop
│       │   └── ServiceStatus
│       │       ├── index.js
│       │       └── index.scss
│       └── index.js
├── yarn.lock
├── .babelrc
└── .editorconfig
```
