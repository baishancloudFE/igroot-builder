const path = require('path')
const CLIEngine = require('eslint').CLIEngine
require('./utils').colors()

const log = (msg, retract = 0) => console.log(
  (
    retract > 0
      ? (new Array(retract + 1).join(' '))
      : ''
  ) + msg
)

module.exports = function(fix = true) {
  console.log('Loading...'.data)

  const cli = new CLIEngine({
    configFile: path.join(__dirname, '../.eslintrc'),
    cwd: path.resolve('test.jsx'),
    extensions: ['.js', '.jsx'],
    fix
  })

  const report = cli.executeOnFiles([path.resolve('src')])
  let fixedFilesCount = 0

  report.results.forEach(result => {
    if(result.output)  fixedFilesCount++
    if(!result.messages.length)   return

    log(
      result.filePath.info
      + (result.errorCount !== 0 ? `\terror count: ${result.errorCount}`.error : '')
      + (result.warningCount !== 0 ? `\twarning count: ${result.warningCount}`.warn : '')
    )

    result.messages.forEach(({ line, column, ruleId, severity, message }) => {
      log(''
        + ((severity - 1) ? ' error '.bgError : ' warning '.bgWarn)
        + ' '
        + (line + ':' + column).data
        + '   rule: '
        + ('' + ruleId).secInfo
        + '   info: '
        + ('' + message).info
      , 3)
    })

    log('\n')
  })

  log(''
    + 'Count: '
    + (report.errorCount + ' error' + (fix ? '' : `(${report.fixableErrorCount} fixable)`)).error
    + '\t'
    + (report.warningCount + ' warning' + (fix ? '' : `(${report.fixableWarningCount} fixable)`)).warn
    + (fix ? `   ${fixedFilesCount} files fixed` : '').blue
  )

  const success = ['great.', 'nice!', 'beautify~', 'perfect!']
  if(report.errorCount === 0 && report.warningCount === 0)
    log('\n' + success[Math.floor(Math.random() * success.length)].success)

  fix && CLIEngine.outputFixes(report)
}