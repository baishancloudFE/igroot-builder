const fs = require('fs')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = require('../config')
const bsy = require(path.resolve('bsy.json'))
const appConfig = bsy.options

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader'
      })
    } else {
      // return loaders
      return ['style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less', {modifyVars: appConfig.theme}),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// bys.json 配置
exports.bsy = bsy
exports.appConfig = appConfig

// pages 文件夹下所有文件夹名
exports.subdir = fs
  .readdirSync(path.resolve('src/pages'))
  .filter(file => fs.lstatSync(path.resolve(`src/pages/${file}`)).isDirectory())

// 控制台打印颜色
exports.colors = function() {
  require('colors').setTheme({
    error: 'red',
    bgError: 'bgRed',
    success: 'green',
    bgSuccess: 'bgGreen',
    warn: 'yellow',
    bgWarn: 'bgYellow',
    info: 'cyan',
    secInfo: 'magenta',
    data: 'gray',
    wahaha: 'rainbow'
  })
}