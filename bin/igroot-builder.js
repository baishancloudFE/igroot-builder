#!/usr/bin/env node

const path = require('path')

const run = require('../build/dev-server')
const build = require('../build/build')

require('yargs')
  .usage('iGroot Builder')
  .command('run', 'Run your application locally', {}, argv => run())
  .command('build', 'Pack your application', {}, argv => {
    const build = require('../build/build')

    build('testing')
      .then(() => build('production', false))
  })
  .demandCommand()
  .help()
  .alias('h', 'help')
  .epilog('Copyright 2017 By BaishanCloud')
  .argv
