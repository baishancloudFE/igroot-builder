#!/usr/bin/env node

const path = require('path')
const inquirer = require('inquirer')

const dev = require('../build/dev-server')
const build = require('../build/build')
const lint = require('../build/lint')

process.on('SIGINT', () => process.exit(1))

require('yargs')
  .usage('iGroot Builder')
  .command('dev', 'Run your application locally', {}, dev)
  .command('build', 'Pack your application', {}, build)
  .command('lint', 'Lint your code', {}, ({ fix }) => lint(fix !== false))
  .demandCommand()
  .help()
  .alias('h', 'help')
  .epilog('Copyright 2017 By BaishanCloud')
  .argv
