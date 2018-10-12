const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const config = require('./webpack.base.config.js')
const PORT = process.env.PORT || 5200

const CONFIG = require('../src/config/index')

/*
* 获取apis代理转发配置信息
* return {
    '/v1': {
      target: 'http://tms3.test.mi.com'',
      changeOrigin: true,
      secure: false
    }, ...
  }
*/

const getProxyConfig = () => {
  let result = {}
  const { WEBPACK_PROXY = null } = CONFIG
  if (WEBPACK_PROXY) {
    Object.entries(WEBPACK_PROXY).forEach(proxyItem => {
      const proxyName = proxyItem[0]
      const proxyUrl = proxyItem[1]
      result[proxyName] = {
        target: proxyUrl,
        changeOrigin: true,
        secure: false
      }
    })
  }
  return result
}

console.log(getProxyConfig())

config.entry.main = (config.entry.main || []).concat([
  // 'react-hot-loader/patch', // Code is automatically patched in v4
  `webpack-dev-server/client?http://localhost:${PORT}/`,
  'webpack/hot/dev-server'
])

// separate css-loader and style-loader in dev and production because dev // need hot reload but extract-text-webpack-plugin not support hot reload
config.module.rules = (config.module.rules || []).concat([
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'postcss-loader']
  },
  {
    test: /\.scss$/,
    // use: ['style-loader', 'css-loader', 'sass-loader']
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
  }
])
config.plugins = (config.plugins || []).concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'NODE_ENV': `'${process.env.NODE_ENV}'`,
    'HOST_ENV': `'${process.env.HOST_ENV}'`
  })
  // new BundleAnalyzerPlugin({
  //   generateStatsFile: true
  // })
])
config.mode = 'development'
config.devtool = 'source-map'
config.output.publicPath = process.env.ASSET_PATH || '/'

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  hot: true,
  // noInfo: true,
  contentBase: [
    './src'
  ],
  quiet: true,
  historyApiFallback: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  inline: false,
  disableHostCheck: true,
  proxy: getProxyConfig()
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`server started at localhost:${PORT}`)
})
