const fs = require("fs");
const empty = require("empty-folder");
const dir = process.env.mode == "dev" ? "./tmp" : "./";
const { colorMap: cm } = require("./utils/utils");
const confirmQuestion = require("./../index");

let complete = false;

const makeHTML = (title, modules) => {
  const stream = fs.createWriteStream(`${dir}/index.html`);
  return new Promise((resolve, _reject) => {
    stream.write(`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="./css/main.min.css">
  <title>${title}</title>
</head>

<body>

</body>

<script src="./js/main.${modules ? "mjs" : "js"}" ${
      modules ? 'type="module" ' : ""
    }charset="utf-8"></script>

</html>`);
    stream.end();
    stream.on("finish", () => resolve());
  });
};

const makeCSS = (css, vars, defaults) => {
  // make the base css directory
  const cssDir = `${dir}/css`;
  if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir);

  // make the components directory
  const compDir = `${cssDir}/components`;
  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir);

  const mainStream = fs.createWriteStream(`${cssDir}/main.${css}`);
  const varStream = fs.createWriteStream(`${compDir}/${vars}`);
  const defStream = fs.createWriteStream(`${compDir}/${defaults}`);

  return new Promise((resolve, _reject) => {
    mainStream.write(`// compile main

@import "./components/defaults";
@import "./components/vars";
`);
    mainStream.end();

    varStream.write(`$p-xl: 8rem;
$p-l: 4rem;
$p-m: 2rem;
$p-s: 1rem;

$breakpoint-small: 1500px;
$breakpoint-tiny: 1200px;
$breakpoint-miniscule: 961px;
`);
    varStream.end();

    defStream.write(`* {
  box-sizing: border-box;
  margin: 0;
}

:root {
  font-size: 16px;
  width: 100vw;
}
`);

    defStream.end();
    defStream.on("finish", () => resolve());
  });
};

const makeJS = modules => {
  const jsDir = `${dir}/js`;
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

module.exports.makeProject = async options => {
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
    cssOrScss: css,
    modulesOrNot: modules,
    varsName: vars,
    defaultsName: defaults
  } = options;

  return new Promise((resolve, reject) => {
    // load configured files into directory
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // build html / css / js files
    Promise.all([
      makeHTML(title, modules),
      makeCSS(css, vars, defaults),
      makeJS(modules)
    ])
      .then(() => {
        status = "all done!";
      })
      .then(() => setTimeout(() => resolve(), 1000));
  });
};

module.exports.destroyProject = async () => {
  const rmdir = () => {
    return new Promise((resolve, _reject) => {
      empty(dir, false, o => {
        if (o.error) rmdir();
        else if (o.failed.length == 0) resolve();
        else rmdir();

        process.stdout.write(cm.fgMagenta);
        console.log("project directory cleaned.");
        process.stdout.write(cm.reset);
      });
    });
  };

  process.stdout.write(cm.fgCyan);

  const confirm = await Object.values(confirmQuestion)[0]();

  if (confirm)
    rmdir().then(() => {
      process.exit();
    });
  else {
    console.log("doing nothing.");
    process.exit();
  }

  process.stdout.write(cm.reset);
};
