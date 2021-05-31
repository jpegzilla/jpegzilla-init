const { colorMap } = require('./utils')

module.exports.argsGrinder = () => {
  const allArgs = process.argv.slice(2).map(a => a.toLowerCase())

  const argsMap = {
    reset: ['-r', '-reset'],
    css: ['-c', '-css'],
    nomodule: ['-m', '-nomodule'],
    defaults: ['-y', '-yes'],
    react: ['-react'],
  }

  // arguments: -yes / -Y, -css / -C, -nomodule / -M, -reset / -R

  // if reset is included, but there's more than one argument:
  if (allArgs.length > 1 && allArgs.some(e => argsMap.reset.includes(e)))
    throw new SyntaxError(
      'if using the -reset argument, no other arguments can be passed.'
    )

  // if react is included, but there's more than one argument:
  if (allArgs.length > 1 && allArgs.some(e => argsMap.react.includes(e)))
    throw new SyntaxError(
      'if using the -react argument, no other arguments can be passed.'
    )

  return allArgs || []
}
