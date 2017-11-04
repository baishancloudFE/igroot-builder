const queue = Promise.resolve()

module.exports = function(context) {
  if(typeof context !== 'string')
    throw new TypeError('\'context\' must be a string!')

  console.log('Loading...'.data)

  require('./check-versions')()

  process.env.NODE_ENV = context

  const ora = require('ora')
  const rm = require('rimraf')
  const path = require('path')
  const chalk = require('chalk')
  const webpack = require('webpack')
  const config = require('../config')
  const webpackConfig = require('./webpack.prod.conf')()

  const spinner = ora(`building for ${context}...`)

  spinner.start()

  webpack(Object.assign({}, webpackConfig, {
    output: Object.assign({}, webpackConfig.output, {
      path: path.join(webpackConfig.output.path, context.substr(0, 4))
    })
  }), function (err, stats) {
    spinner.stop()
    if (err) throw err

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (context === 'production') {
      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    }
  })
}
