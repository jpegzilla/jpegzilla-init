const fs = require('fs')
const empty = require('empty-folder')
const dir = process.env.mode == 'dev' ? './tmp' : './'
const { colorMap: cm } = require('./utils/utils')
const confirmQuestion = require('./../index')

const indexTemplate = require('./../templates/vanilla/index')
const componentTemplate = require('./../templates/web-component/component')
const prettierTemplate = require('./../templates/web-component/prettier')
const mainJsFile = require('./../templates/web-component/main')

const mainScssFile = require('./../templates/react/src/components/styles/main.scss')
const varsScssFile = require('./../templates/react/src/components/styles/_vars.scss')
const defaultsScssFile = require('./../templates/react/src/components/styles/_defaults.scss')

const mainSassFile = require('./../templates/react/src/components/styles/main.sass')
const defaultsSassFile = require('./../templates/react/src/components/styles/_defaults.sass')
const varsSassFile = require('./../templates/react/src/components/styles/_vars.sass')

const mainCssFile = require('./../templates/react/src/components/styles/main.css')
const defaultsCssFile = require('./../templates/react/src/components/styles/defaults.css')
const varsCssFile = require('./../templates/react/src/components/styles/vars.css')

const makePrettier = () => {
  const stream = fs.createWriteStream(`${dir}/.prettierrc`)
  return new Promise((resolve, _reject) => {
    stream.write(prettierTemplate)
    stream.end()

    stream.on('finish', () => resolve())
  })
}

const makeHTML = (title, modules) => {
  const stream = fs.createWriteStream(`${dir}/index.html`)
  return new Promise((resolve, _reject) => {
    stream.write(indexTemplate(title, modules))
    stream.end()

    stream.on('finish', () => resolve())
  })
}

const makeCSS = (css, vars, defaults) => {
  // make the base css directory
  const cssDir = `${dir}/css`
  if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir)

  // make the components directory
  const compDir = `${cssDir}/components`
  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir)

  const mainStream = fs.createWriteStream(`${cssDir}/main.${css}`)
  const varStream = fs.createWriteStream(`${compDir}/${vars}`)
  const defStream = fs.createWriteStream(`${compDir}/${defaults}`)

  const writeAllCss = (mainFile, varFile, defFile) => {
    return new Promise((resolve, _reject) => {
      mainStream.write(mainFile)
      mainStream.end()

      varStream.write(varFile)
      varStream.end()

      defStream.write(defFile)
      defStream.end()

      defStream.on('finish', () => resolve())
    })
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
  const jsCompDir = `${dir}/js/components`
  if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir)
  if (!fs.existsSync(jsCompDir)) fs.mkdirSync(jsCompDir)

  const stream = fs.createWriteStream(`${jsDir}/main.${modules ? 'mjs' : 'js'}`)
  const compStream = fs.createWriteStream(`${jsCompDir}/component.${modules ? 'mjs' : 'js'}`)

  return new Promise((resolve, _reject) => {
    stream.write(mainJsFile)
    stream.end()

    compStream.write(componentTemplate)
    stream.end()

    stream.on('finish', () => resolve())
  })
}

module.exports.makeWebComponentProject = async options => {
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
      makePrettier(),
    ])
      .then(() => {
        status = 'all done!'
      })
      .then(() => setTimeout(() => resolve(), 1000))
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
