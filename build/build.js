let cleaned = false // 文件夹清空锁，确保 dist 目录只会被清空一次
let loged = false   // 打印锁，Promise 执行太慢，额外提出来作为一个单独的状态

const queue = Promise.resolve()

module.exports = function(context) {
  if(!loged) {
    console.log('Clearing dist dir...')
    loged = true
  }

  queue.then(() => {
    if(typeof context !== 'string')
      throw new TypeError('\'context\' must be a string!')

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
      if (!cleaned) {
        rm(path.join(config.build.assetsRoot), err => {
          if(err) throw err
          cleaned = true
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
      if(stats.compilation.errors.length)
        return console.log('please run \'sl lint\' check and fix your project.'.warn)

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
  })
}
