const fs = require('fs')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = require('../config')
const bsy = require(path.resolve('bsy.json'))
const appConfig = bsy.options
const isDev = process.env.NODE_ENV === 'development'

exports.assetsPath = function (_path) {
  const assetsSubDirectory = isDev
    ? config.dev.assetsSubDirectory
    : config.build.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const styleLoader = isDev ? 'style-loader' : {
    loader: require.resolve('style-loader'),
    options: {hmr: false}
  }

  const cssLoader = {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: !isDev,
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })

      // postcss-loader, 用于在 CSS 中自动添加内核前缀，暂时不开启
      // loaders.push({
      //   loader: require.resolve('postcss-loader'),
      //   options: {
      //     // Necessary for external CSS imports to work
      //     // https://github.com/facebookincubator/create-react-app/issues/2677
      //     ident: 'postcss',
      //     plugins: () => [
      //       require('postcss-flexbugs-fixes'),
      //       require('autoprefixer')({
      //         browsers: [
      //           '>1%',
      //           'last 4 versions',
      //           'Firefox ESR',
      //           'not ie < 9' // React doesn't support IE8 anyway
      //         ],
      //         flexbox: 'no-2009'
      //       })
      //     ]
      //   }
      // })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: styleLoader
      })
    } else {
      // return loaders
      return [styleLoader].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    less: generateLoaders('less', {modifyVars: appConfig.theme}),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// bys.json 配置
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