module.exports = {
  run: require('./build/dev-server'),
  build: () => {
    const build = require('./build/build')

    build('testing')
      .then(() => build('production', false))
  }
}