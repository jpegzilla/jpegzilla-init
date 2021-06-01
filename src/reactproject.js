const fs = require('fs')
const dir = process.env.mode == 'dev' ? './tmp' : './'
const { colorMap: cm, writeFiles } = require('./utils/utils')

const gitignoreFile = require('./../templates/gitignore')
const indexFile = require('./../templates/public/index')
const packageJsonFile = require('./../templates/package.json')
const babelRcFile = require('./../templates/babelrc')
const prettierRcFile = require('./../templates/prettierrc')

const mainScssFile = require('./../templates/src/components/styles/main.scss')
const varsScssFile = require('./../templates/src/components/styles/_vars.scss')
const defaultsScssFile = require('./../templates/src/components/styles/_defaults.scss')
const mainSassFile = require('./../templates/src/components/styles/main.sass')
const defaultsSassFile = require('./../templates/src/components/styles/_defaults.sass')
const varsSassFile = require('./../templates/src/components/styles/_vars.sass')
const mainCssFile = require('./../templates/src/components/styles/main.css')
const defaultsCssFile = require('./../templates/src/components/styles/defaults.css')
const varsCssFile = require('./../templates/src/components/styles/vars.css')
const mainMinCssFile = require('./../templates/src/components/styles/main.min.css')

const reactIndexFile = require('./../templates/src/index-react')
const reactAppFile = require('./../templates/src/components/App')
const reactAppTestFile = require('./../templates/test/App.test')
const reactTestDomFile = require('./../templates/test/helpers/dom')
const reactTestHelpersFile = require('./../templates/test/helpers/helpers')

let allDirs //, complete = false

const makeHTML = title => {
  const stream = fs.createWriteStream(`${allDirs.public}/index.html`)
  return new Promise((resolve, _reject) => {
    stream.write(indexFile(title))
    stream.end()
    stream.on('finish', () => resolve())
  })
}

const makeConfigs = () => {
  const files = [
    [`${allDirs.root}/.babelrc`, babelRcFile]
  ]
  const babelStream = fs.createWriteStream(`${allDirs.root}/.babelrc`)
  const gitignoreStream = fs.createWriteStream(`${allDirs.root}/.gitignore`)
  const prettierRcStream = fs.createWriteStream(`${allDirs.root}/.prettierrc`)
  const packageJSONStream = fs.createWriteStream(`${allDirs.root}/package.json`)

  return new Promise((resolve, _reject) => {
    // write .gitignore, package.json, .prettierrc and .babelrc
    gitignoreStream.write(gitignoreFile)
    gitignoreStream.end()

    prettierRcStream.write(prettierRcFile)
    prettierRcStream.end()

    packageJSONStream.write(packageJsonFile)
    packageJSONStream.end()

    babelStream.write(babelRcFile)
    babelStream.end()

    babelStream.on('finish', () => resolve())
  })
}

// write all css
const makeCSS = (css, vars, defaults) => {
  const cssDir = `${allDirs.styles}`
  const compDir = `${cssDir}/components`

  const writeAllCss = async (mainFile, varFile, defFile) => {
    const files = [
      [`${cssDir}/main.${css}`, mainFile],
      [`${cssDir}/main.min.css`, mainMinCssFile],
      [`${compDir}/${vars}`, varFile],
      [`${compDir}/${defaults}`, defFile],
    ]

    return writeFiles(files)
  }

  switch (css) {
    case 'css':
      return writeAllCss(mainCssFile, varsCssFile, defaultsCssFile)
    case 'scss':
      return writeAllCss(mainScssFile, varsScssFile, defaultsScssFile)
    case 'sass':
      return writeAllCss(mainSassFile, varsSassFile, defaultsSassFile)
  }
}

// write all javascript files
const makeJS = () => {
  const compDir = `${allDirs.components}`

  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir)

  const compStream = fs.createWriteStream(`${compDir}/App.js`)
  const indexStream = fs.createWriteStream(`${allDirs.src}/index.js`)

  return new Promise((resolve, _reject) => {
    indexStream.write(reactIndexFile)
    indexStream.end()

    compStream.write(reactAppFile)
    compStream.end()

    compStream.on('finish', () => resolve())
  })
}

// write all testing-related files
const makeTest = () => {
  const testDir = allDirs.test
  const helperDir = allDirs.helpers

  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir)
  if (!fs.existsSync(helperDir)) fs.mkdirSync(helperDir)

  const testStream = fs.createWriteStream(`${testDir}/App.test.js`)
  const domHelperStream = fs.createWriteStream(`${helperDir}/dom.js`)
  const helperStream = fs.createWriteStream(`${helperDir}/helpers.js`)

  return new Promise((resolve, _reject) => {
    testStream.write(reactAppTestFile)
    testStream.end()

    domHelperStream.write(reactTestDomFile)
    domHelperStream.end()

    helperStream.write(reactTestHelpersFile)
    helperStream.end()

    helperStream.on('finish', () => resolve())
  })
}

module.exports.makeReactProject = async options => {
  let status = ''
  const loadingSpinner = () => {
    let bar = ['.  ', '.. ', '...', ' ..', '  .', '   ', '   ', '   ']
    let x = 0

    return setInterval(() => {
      process.stdout.write(cm.fgMagenta)
      process.stdout.write('\r' + bar[x++] + '  creating project ... ' + status)

      process.stdout.write(cm.reset)
      if (x == bar.length - 1) x = 0
    }, 100)
  }

  loadingSpinner()

  const {
    title,
    cssOption: css,
    varsName: vars,
    defaultsName: defaults,
  } = options

  return new Promise((resolve, reject) => {
    // load configured files into directory
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)

    // make sure all necessary dirs exist for react config
    allDirs = {
      root: dir,
      src: `${dir}/src`,
      test: `${dir}/test`,
      helpers: `${dir}/test/helpers`,
      public: `${dir}/public`,
      components: `${dir}/src/components`,
      styles: `${dir}/src/components/styles`,
    }

    for (let d in allDirs) {
      if (allDirs.hasOwnProperty(d)) {
        if (!fs.existsSync(allDirs[d])) fs.mkdirSync(allDirs[d])
      }
    }

    // build html / css / js files
    Promise.all([
      makeHTML(title),
      makeConfigs(),
      makeCSS(css, vars, defaults),
      makeJS(),
      makeTest(),
    ])
      .then(() => {
        status = 'all done!'
        resolve()
      })
  })
}
