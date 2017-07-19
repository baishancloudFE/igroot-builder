module.exports = function(context, hasClear = true) {
  if(typeof context !== 'string')
    throw new TypeError('\'context\' must be a string!')

  if(hasClear)
    console.log('Clearing dist dir...')

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

  return new Promise((reslove, reject) => {
    if (hasClear) {
      rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
        if(err) throw err
        reslove()
      })
    } else { reslove() }
  })

  .then(() => {
    spinner.start()
    return new Promise((reslove, reject) => {
      webpack(Object.assign({}, webpackConfig, {
        output: Object.assign({}, webpackConfig.output, {
          path: path.join(webpackConfig.output.path, context.substr(0, 4))
        })
      }), function (err, stats) {
        spinner.stop()
        if (err) throw err
        reslove(stats)
      })
    })
  })

  .then(stats => {
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if(context === 'production') {
      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    }
  })


  // rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  //   if (err) throw err
  //   webpack(webpackConfig, function (err, stats) {
  //     prodSpinner.stop()
  //     if (err) throw err
  //     process.stdout.write(stats.toString({
  //       colors: true,
  //       modules: false,
  //       children: false,
  //       chunks: false,
  //       chunkModules: false
  //     }) + '\n\n')

  //     console.log(chalk.cyan('  Build complete.\n'))
  //     console.log(chalk.yellow(
  //       '  Tip: built files are meant to be served over an HTTP server.\n' +
  //       '  Opening index.html over file:// won\'t work.\n'
  //     ))
  //   })
  // })
}
