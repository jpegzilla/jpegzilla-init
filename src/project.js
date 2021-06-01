const fs = require('fs')
const empty = require('empty-folder')
const dir = process.env.mode == 'dev' ? './tmp' : './'
const { colorMap: cm, writeFiles } = require('./utils/utils')
const confirmQuestion = require('./../index')

const indexTemplate = require('./../templates/index')

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

const makeHTML = (title, modules) => {
  const stream = fs.createWriteStream(`${dir}/index.html`)
  return new Promise((resolve, _reject) => {
    stream.write(indexTemplate(title, modules))
    stream.end()

    stream.on('finish', () => resolve())
  })
}

const makeCSS = (css, vars, defaults) => {
  const cssDir = `${dir}/css`
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

const makeJS = modules => {
  const jsDir = `${dir}/js`
  if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir)

  const stream = fs.createWriteStream(`${jsDir}/main.${modules ? 'mjs' : 'js'}`)

  return new Promise((resolve, _reject) => {
    stream.write(`console.log("hello from main.${modules ? 'mjs' : 'js'}!")`)
    stream.end()

    stream.on('finish', () => resolve())
  })
}

module.exports.makeVanillaProject = async options => {
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
    modulesOrNot: modules,
    varsName: vars,
    defaultsName: defaults,
  } = options

  return new Promise((resolve, reject) => {
    // load configured files into directory
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    // build html / css / js files
    Promise.all([
      makeHTML(title, modules),
      makeCSS(css, vars, defaults),
      makeJS(modules),
    ])
      .then(() => {
        status = 'all done!'
        resolve()
      })
  })
}

module.exports.destroyProject = async () => {
  const rmdir = () => {
    return new Promise((resolve, _reject) => {
      empty(dir, false, o => {
        if (o.error) throw o.error
        else if (o.failed.length == 0) resolve()
        else rmdir()

        process.stdout.write(cm.fgMagenta)
        console.log('project directory cleaned.')
        process.stdout.write(cm.reset)
      })
    })
  }

  process.stdout.write(cm.fgCyan)

  const confirm = await Object.values(confirmQuestion)[0]()

  if (confirm)
    rmdir()
      .then(() => {
        process.exit()
      })
      .catch(err => {
        process.stdout.write(cm.fgMagenta)
        console.log('error:', err)
        process.stdout.write(cm.reset)
        process.exit()
      })
  else {
    console.log('doing nothing.')
    process.exit()
  }

  process.stdout.write(cm.reset)
}
