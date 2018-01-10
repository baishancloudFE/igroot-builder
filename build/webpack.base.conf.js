const path = require('path')
const utils = require('./utils')
const config = require('../config')
const isDev = process.env.NODE_ENV === 'development'
const { dependencies, devDependencies } = require(resolve('package'))

function resolve(dir = '') {
  return path.join(process.cwd(), dir)
}

const entry = {}
utils.subdir.forEach(dir => entry[dir] = [require.resolve('./polyfills'), resolve(`src/pages/${dir}/index.jsx`)])

const { esModule = [], externals } = utils.appConfig

const rules = [
  {
    test: /\.(js|jsx)$/,
    include: [
      resolve('src'),
      ...esModule.map(component => resolve(`node_modules/${component}`))
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
          'transform-decorators-legacy',
          ['import', {
            libraryName: 'igroot',
            style: utils.appConfig.theme
            ? true
            : 'css'
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
    alias: Object.assign({
      '@': resolve('src'),
      '@@': resolve('src/apis/index.js'),
      '#': require.resolve('react-hot-loader')
    }, (() => {
      const pkgs = {}

      Object
        .keys(Object.assign({}, dependencies, devDependencies))
        .forEach(pkg => pkgs[pkg] = resolve(`node_modules/${pkg}`))

      return pkgs
    })())
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