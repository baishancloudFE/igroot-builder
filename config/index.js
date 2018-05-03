const path = require('path')
const {domain, port, buildPath, publicPath, sourceMap} = require(path.resolve('bsy.json')).options

module.exports = {
  build: {
    env: require('./prod.env'),
    assetsRoot: path.resolve(buildPath || './dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: publicPath || '/',
    productionSourceMap: sourceMap || false,
    productionGzipExtensions: ['js', 'css'],
  },
  dev: {
    env: require('./dev.env'),
    domain: domain || 'localhost',
    port: port,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
