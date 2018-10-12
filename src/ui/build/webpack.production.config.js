const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./webpack.base.config')

config.mode = 'production'
// config.devtool = 'source-map'
config.output.filename = '[name].[chunkhash].js'
config.output.publicPath = process.env.ASSET_PATH || '/'
config.optimization = {
  splitChunks: {
    chunks: 'all',
    // minChunks: 1, // what means about minChunks ?
    name: 'common'
  }
}
config.performance = {
  hints: false
}

config.module.rules = (config.module.rules || []).concat([
  {
    test: /\.s?css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ]
  }
])
config.plugins = (config.plugins || []).concat([
  new CleanWebpackPlugin(['dist'], {
    root: path.resolve(__dirname, '../')
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    chunkFilename: '[id].[chunkhash].css',
    allChunks: true
  }),
  new webpack.HashedModuleIdsPlugin(),
  new webpack.DefinePlugin({
    'NODE_ENV': `'${process.env.NODE_ENV}'`,
    'HOST_ENV': `'${process.env.HOST_ENV}'`
  })
])

module.exports = config
