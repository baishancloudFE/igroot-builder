module.exports = function(root, isDev) {
  const path = require('path')
  const utils = require('./utils')(root, isDev)
  const config = require('../config')(root)
  const {dependencies, devDependencies} = require(resolve('package'))

  function resolve(dir = '') {
    return path.join(root, dir)
  }

  const entry = {}
  utils.subdir.forEach(dir => entry[dir] = [require.resolve('./polyfills'), resolve(`src/pages/${dir}/index.jsx`)])

  const {esModule = [], externals} = utils.appConfig
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
          presets: ['react-app'],
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

  return {
    entry,
    externals,

    output: {
      path: config.build.assetsRoot,
      filename: '[name].js',
      publicPath: config[isDev ? 'dev' : 'build'].assetsPublicPath
    },

    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        '@': resolve('src'),
        '@@': resolve('src/apis/index.js'),
        '#': require.resolve('react-hot-loader'),
        'igroot': resolve('node_modules/igroot'),
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
}