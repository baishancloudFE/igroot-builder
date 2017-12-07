const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const WatchMissingNodeModulesPlugin = require('./WatchMissingNodeModulesPlugin')
const utils = require('./utils')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [`webpack-hot-middleware/client?name=${name}`, 'react-hot-loader/patch', ...baseWebpackConfig.entry[name]]
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
      APP_CONFIG: JSON.stringify(utils.appConfig.dev)
    }),
    new webpack.NamedModulesPlugin(),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin(),
    new WatchMissingNodeModulesPlugin(path.join(process.cwd(), 'node_modules')),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ].concat(utils.subdir.map(dir => {
    // https://github.com/ampedandwired/html-webpack-plugin
    return new HtmlWebpackPlugin({
      filename: `${dir}.html`,
      template: path.resolve(`src/pages/${dir}/index.html`),
      chunks: [dir]
    })
  }))
})
