
# Istio Client

Naftis front end source code, based on React 16.4 / webpack4, notice some changes in the lifecycle of React 16.4 the front-end directory is under the src/ui of the project and directory.

## develop

```sh
$ npm i
# open development
$ npm run dev
# build
$ npm run build
```

open `http://localhost:5200`

> note: The port number can be modified in package.json `"dev": "cross-env NODE_ENV=development PORT=5200 node build/webpack.dev.config.js"`

## Js Specification

Project use [Standard JS](https://standardjs.com/readme-zhcn.html)，**The JS file is automatically detected when submitting the file. If there is a problem, it needs to be fixed before it can be mentioned**😂.

The react component file name takes the big hump rule, and the other file names take the small hump rule.

The public folder is used to store static files, Other folders that are used will be packaged into the project code.

## Directory Structure

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
