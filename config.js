const path = require('path')
const cache = {}

module.exports = function(root) {
  const {domain, port, publicPath, sourceMap} = require(path.join(root, 'bsy.json')).options

  if (!cache[root])
    cache[root] = {
      build: {
        assetsRoot: path.join(root, './dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: publicPath || '/',
        productionSourceMap: sourceMap || false,
        productionGzipExtensions: ['js', 'css'],
      },
      dev: {
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
      },
      destory() {delete cache[root]}
    }

  return cache[root]
}