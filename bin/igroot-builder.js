#!/usr/bin/env node

const path = require('path')

const run = require('../build/dev-server')
const build = require('../build/build')
const lint = require('../build/lint')

require('yargs')
  .usage('iGroot Builder')
  .command('run', 'Run your application locally', {}, argv => run())
  .command('build', 'Pack your application', {}, ({ test, prod }) => {
      const build = require('../build/build')

      test !== false && build('testing')
      prod !== false && build('production')
    }
  )
  .command('lint', 'Lint your code', {}, ({ fix }) => lint(fix !== false))
  .demandCommand()
  .help()
  .alias('h', 'help')
  .epilog('Copyright 2017 By BaishanCloud')
  .argv
