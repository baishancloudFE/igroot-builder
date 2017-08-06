module.exports = {
  run: require('./build/dev-server'),
  build: (test = true, prod = true) => {
    const build = require('./build/build')

    test && build('testing')
    prod && build('production')
  },
  lint: fix => require('./build/lint')(fix)
}