module.exports.similarString = (str1, str2) => {};

const colorMap = {
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  reset: "\x1b[0m"
};

module.exports.consoleError = string => {
  process.stdout.write(colorMap.fgRed);
  console.log(`${string}`);
  process.stdout.write(colorMap.reset);
};

module.exports.consoleInfo = string => {
  process.stdout.write(colorMap.fgMagenta);
  console.log(`${string}`);
  process.stdout.write(colorMap.reset);
};

module.exports.consoleBlue = string => {
  process.stdout.write(colorMap.fgBlue);
  process.stdout.write(string);
  process.stdout.write(colorMap.reset);
};

module.exports.colorMap = colorMap;
