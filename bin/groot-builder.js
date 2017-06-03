#!/usr/bin/env node

const path = require('path')
const shell = require('shelljs')

require('yargs')
    .usage('Groot Builder')
    .command('run', 'Run your application locally', {}, argv => shell.exec(`node ${path.join(__dirname, '../build/dev-server')}`))
    .command('build', 'Pack your application', {}, argv => shell.exec(`node ${path.join(__dirname, '../build/build')}`))
    .demandCommand()
    .help()
    .alias('h', 'help')
    .epilog('Copyright 2017 By BaishanCloud')
    .argv
