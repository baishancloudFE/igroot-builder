const path = require('path')
const utils = require('./utils')
const config = require('../config')
const isDev = process.env.NODE_ENV === 'development'

function resolve(dir = '') {
  return path.join(process.cwd(), dir)
}

const entry = {}
utils.subdir.forEach(dir => entry[dir] = [require.resolve('./polyfills'), resolve(`src/pages/${dir}/index.jsx`)])

const { businessComponents = [], externals } = utils.appConfig

const rules = [
  {
    test: /\.(js|jsx)$/,
    include: [
      resolve('src'),
      ...businessComponents.map(component => resolve(`node_modules/${component}`))
    ],
    use: [{
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          ['env', {
            modules: false,
            targets: {
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9'
              ]
            }
          }],
          'react-app'
        ],
        plugins: [
          "transform-decorators-legacy",
          ["import", {
            "libraryName": "igroot",
            "style": utils.appConfig.theme
            ? true
            : "css"
          }]
        ],
        [isDev ? 'cacheDirectory' : 'compact']: true,
        filename: __dirname
      }
    }, 'react-hot-loader/webpack']
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: utils.assetsPath('img/[name].[hash:7].[ext]')
    }
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
    }
  }
]

if(utils.appConfig.lint) {
  rules.unshift({
    enforce: 'pre',
    test: /\.(js|jsx)$/,
    loader: 'eslint-loader',
    include: /src/,
    options: {
      configFile: path.join(__dirname, '../.eslintrc')
    }
  })
}

module.exports = {
  entry,
  externals,

  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isDev
    ? config.dev.assetsPublicPath
    : (utils.appConfig.publicPath || config.build.assetsPublicPath)
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
      '@@': resolve('src/apis/index.js'),
      '#': require.resolve('react-hot-loader'),

      // 防止 react-hot-loader 中对 react 引用时找不到
      'react': resolve('node_modules/react')
    }
  },

  module: {
    rules,
    strictExportPresence: true
  },

  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },

  context: path.join(__dirname, '../')
}