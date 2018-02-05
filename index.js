process.on('SIGINT', () => process.exit(1))

module.exports = {
  dev: require('./build/dev-server'),
  build: require('./build/build'),
  lint: fix => require('./build/lint')(fix)
}