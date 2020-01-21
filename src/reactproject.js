const fs = require("fs");
const empty = require("empty-folder");
const dir = process.env.mode == "dev" ? "./tmp" : "./";
const { colorMap: cm } = require("./utils/utils");
const confirmQuestion = require("./../index");

let complete = false,
  allDirs;

const makeHTML = (title, modules) => {
  const stream = fs.createWriteStream(`${allDirs.public}/index.html`);
  return new Promise((resolve, _reject) => {
    stream.write(`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="description goes here" />
  <link rel="stylesheet" href="./css/main.min.css">
  <title>${title}</title>
</head>

<body>
  <main id="root"></main>
</body>

<script src="./js/main.${modules ? "mjs" : "js"}" ${
      modules ? 'type="module" ' : ""
    }charset="utf-8"></script>

</html>`);
    stream.end();
    stream.on("finish", () => resolve());
  });
};

const makeConfigs = () => {
  const babelStream = fs.createWriteStream(`${allDirs.root}/.babelrc`);
  const gitignoreStream = fs.createWriteStream(`${allDirs.root}/.gitignore`);
  const packageJSONStream = fs.createWriteStream(
    `${allDirs.root}/package.json`
  );

  return new Promise((resolve, reject) => {
    gitignoreStream.write(`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

notes.md

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# lockfiles
**/*.lock
*-lock.json`);

    packageJSONStream.write(`{
  "name": "jpegzilla-init-react",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.3.2",
    "@testing-library/user-event": "^7.1.2",
    "es6-promise": "^4.2.8",
    "isomorphic-fetch": "^2.2.1",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "react-scripts": "3.3.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "mocha --require @babel/register --require ./test/helpers/helpers.js --require ./test/helpers/dom.js --require ignore-styles -b -c './test/*.test.js'",
    "test:watch": "npm run test -- --watch",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%", "not dead", "not op_mini all"
    ],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  },
  "devDependencies": {
    "@babel/core": "^7.7.7",
    "@babel/preset-env": "^7.7.7",
    "@babel/preset-react": "^7.7.4",
    "@babel/register": "^7.7.7",
    "chai": "^4.2.0",
    "enzyme": "^3.11.0",
    "enzyme-adapter-react-16": "^1.15.2",
    "ignore-styles": "^5.0.1",
    "jsdom": "^15.2.1",
    "mocha": "^7.0.0",
    "react-addons-test-utils": "^15.6.2"
  }
}`);

    babelStream.write(`{
  "presets": [
    [
      "@babel/preset-env", {
        "modules": "auto"
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"]
}
`);

    babelStream.end();
    babelStream.on("finish", () => resolve());
  });
};

const makeCSS = (css, vars, defaults) => {
  // make the base css directory
  const cssDir = `${allDirs.styles}`;

  // make the components directory
  const compDir = `${cssDir}/components`;
  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir);

  const mainStream = fs.createWriteStream(`${cssDir}/main.${css}`);
  const varStream = fs.createWriteStream(`${compDir}/${vars}`);
  const defStream = fs.createWriteStream(`${compDir}/${defaults}`);

  if (css === "scss") {
    return new Promise((resolve, _reject) => {
      mainStream.write(`// compile main

@import "./components/defaults";
@import "./components/vars";`);
      mainStream.end();

      varStream.write(`$p-xl: 8rem;
$p-l: 4rem;
$p-m: 2rem;
$p-s: 1rem;

$breakpoint-small: 1500px;
$breakpoint-tiny: 1200px;
$breakpoint-miniscule: 961px;`);
      varStream.end();

      defStream.write(`* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  font-size: 16px;
  width: 100vw;
}`);

      defStream.end();
      defStream.on("finish", () => resolve());
    });
  } else if (css === "css") {
    return new Promise((resolve, _reject) => {
      mainStream.write(`@import "./components/defaults.css";
@import "./components/vars.css";`);
      mainStream.end();

      varStream.write(`--breakpoint-small: 1500px;
--breakpoint-tiny: 1200px;
--breakpoint-miniscule: 961px;`);
      varStream.end();

      defStream.write(`* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  font-size: 16px;
  width: 100vw;
}`);

      defStream.end();
      defStream.on("finish", () => resolve());
    });
  } else if (css === "sass") {
    return new Promise((resolve, _reject) => {
      mainStream.write(`// compile main

@import "./components/defaults"
@import "./components/vars"`);
      mainStream.end();

      varStream.write(`$p-xl: 8rem
$p-l: 4rem
$p-m: 2rem
$p-s: 1rem

$breakpoint-small: 1500px
$breakpoint-tiny: 1200px
$breakpoint-miniscule: 961px`);
      varStream.end();

      defStream.write(`*
box-sizing: border-box
margin: 0
padding: 0

\\:root
  font-size: 16px
  width: 100vw`);

      defStream.end();
      defStream.on("finish", () => resolve());
    });
  }
};

const makeComponents = () => {
  const jsDir = `${dir}/src/components`;
  if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir);

  const stream = fs.createWriteStream(
    `${jsDir}/main.${modules ? "mjs" : "js"}`
  );

  return new Promise((resolve, _reject) => {
    stream.write(`console.log("hello from main.mjs!");`);

    stream.end();
    stream.on("finish", () => resolve());
  });
};

module.exports.makeReactProject = async options => {
  let status = "";
  const loadingSpinner = () => {
    let bar = [".  ", ".. ", "...", " ..", "  .", "   ", "   ", "   "];
    let x = 0;

    return setInterval(() => {
      process.stdout.write(cm.fgMagenta);
      process.stdout.write(
        "\r" + bar[x++] + "  creating project ... " + status
      );

      process.stdout.write(cm.reset);
      if (x == bar.length - 1) x = 0;
    }, 100);
  };

  loadingSpinner();

  const {
    title,
    cssOption: css,
    varsName: vars,
    defaultsName: defaults
  } = options;

  return new Promise((resolve, reject) => {
    // load configured files into directory
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // make sure all necessary dirs exist for react config
    allDirs = {
      root: dir,
      src: `${dir}/src`,
      test: `${dir}/test`,
      helpers: `${dir}/test/helpers`,
      public: `${dir}/public`,
      components: `${dir}/src/components`,
      styles: `${dir}/src/components/styles`
    };

    for (let d in allDirs) {
      if (allDirs.hasOwnProperty(d)) {
        if (!fs.existsSync(allDirs[d])) {
          fs.mkdirSync(allDirs[d]);
        }
      }
    }

    // build html / css / js files
    Promise.all([
      makeHTML(title),
      makeConfigs(),
      makeCSS(css, vars, defaults)
      // makeJS(modules)
    ])
      .then(() => {
        status = "all done!";
      })
      .then(() => setTimeout(() => resolve(), 1000));
  });
};
