module.exports = function(root, console) {
  process.env.NODE_ENV = 'production'

  const chalk = require('chalk')
  console(chalk.gray('> Loading config...'))

  const path = require('path')
  const webpack = require('webpack')
  const utils = require('./utils')(root)
  const config = require('../config')(root)
  const webpackConfig = require('./webpack.prod.conf')(root)

  console(chalk.gray(`> Building...`))

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, function(err, stats) {
      if (err) return reject(err)

      console(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      console(chalk.cyan('  Build complete.\n'))
      console(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))

      utils.destory()
      config.destory()
      resolve()
    })
  })
}