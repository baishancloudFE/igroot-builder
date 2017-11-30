#!/usr/bin/env node

const path = require('path')
const inquirer = require('inquirer')

const run = require('../build/dev-server')
const build = require('../build/build')
const lint = require('../build/lint')

require('yargs')
  .usage('iGroot Builder')
  .command('run', 'Run your application locally', {}, argv => run())
  .command('build', 'Pack your application', {}, () => {
    const questions = [{
      type: 'list',
      name: 'env',
      message: 'Please select build env:',
      choices: ['production', 'testing', 'production & testing (two package)']
    }]

    inquirer.prompt(questions).then(answers => {
      const { env } = answers

      switch (env) {
        case 'testing':
        case 'production':
          return build(env)

        default:
          build('testing') || build('production')
      }
    })
  })
  .command('lint', 'Lint your code', {}, ({ fix }) => lint(fix !== false))
  .demandCommand()
  .help()
  .alias('h', 'help')
  .epilog('Copyright 2017 By BaishanCloud')
  .argv
