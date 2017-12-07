module.exports = {
  run: require('./build/dev-server'),
  build: () => {
    const inquirer = require('inquirer')
    const build = require('./build/build')

    const questions = [{
      type: 'list',
      name: 'env',
      message: 'Please select build env:',
      choices: ['production', 'test', 'production & test (two package)']
    }]

    inquirer.prompt(questions).then(answers => {
      const { env } = answers

      switch(env) {
        case 'test':
        case 'production':
          return build(env)

        default:
          return build('test') || build('production')
      }
    })
  },
  lint: fix => require('./build/lint')(fix)
}