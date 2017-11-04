module.exports = {
  run: require('./build/dev-server'),
  build: () => {
    const inquirer = require('inquirer')
    const build = require('./build/build')

    const questions = [{
      type: 'list',
      name: 'env',
      message: 'Please select build env:',
      choices: ['production', 'testing', 'production & testing (two package)']
    }]

    inquirer.prompt(questions).then(answers => {
      const { env } = answers

      switch(env) {
        case 'testing':
        case 'production':
          return build(env)

        default:
          return build('testing') && build('production')
      }
    })
  },
  lint: fix => require('./build/lint')(fix)
}