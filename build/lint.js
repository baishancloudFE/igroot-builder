const path = require('path')
const CLIEngine = require('eslint').CLIEngine
const chalk = require('chalk')

module.exports = function(console, fix = true) {
  fix = false // TODO: 文件回流未处理，暂不开放自动修复功能

  log = (msg, retract = 0) => console(
    (
      retract > 0
        ? (new Array(retract + 1).join(' '))
        : ''
    ) + msg
  )

  console(chalk.gray('> Loading...'))

  const cli = new CLIEngine({
    configFile: path.join(__dirname, '../.eslintrc'),
    cwd: path.join(root, 'test.jsx'),
    extensions: ['.js', '.jsx'],
    fix
  })

  const report = cli.executeOnFiles([path.join(root, 'src')])
  let fixedFilesCount = 0

  report.results.forEach(result => {
    if(result.output)  fixedFilesCount++
    if(!result.messages.length)   return

    log(
      chalk.cyan(result.filePath)
      + (result.errorCount !== 0 ? `\terror count: ${chalk.red(result.errorCount)}` : '')
      + (result.warningCount !== 0 ? `\twarning count: ${chalk.yellow(result.warningCount)}` : '')
    )

    result.messages.forEach(({ line, column, ruleId, severity, message }) => {
      log(''
        + ((severity - 1) ? chalk.bgRed(' error ') : chalk.bgYellow(' warning '))
        + ' '
        + chalk.gray(line + ':' + column)
        + '   rule: '
        + chalk.magenta('' + ruleId)
        + '   info: '
        + chalk.cyan('' + message)
      , 3)
    })

    log('\n')
  })

  log(''
    + 'Count: '
    + chalk.red(report.errorCount + ' error' + (fix ? '' : `(${report.fixableErrorCount} fixable)`))
    + '\t'
    + chalk.yellow(report.warningCount + ' warning' + (fix ? '' : `(${report.fixableWarningCount} fixable)`))
    + chalk.blue(fix ? `   ${fixedFilesCount} files fixed` : '')
  )

  const success = ['great.', 'nice!', 'beautify~', 'perfect!']
  if(report.errorCount === 0 && report.warningCount === 0)
    log('\n' + chalk.green(success[Math.floor(Math.random() * success.length)]))

  fix && CLIEngine.outputFixes(report)
}