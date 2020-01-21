#!/usr/bin/env node

require("dotenv").config();

const readline = require("readline");
const { argsGrinder } = require("./src/utils/argsgrinder");
const {
  colorMap: cm,
  consoleError: ce,
  consoleInfo: ci,
  consoleBlue: cb
} = require("./src/utils/utils");

const { makeVanillaProject, destroyProject } = require("./src/project");
const { makeReactProject } = require("./src/reactproject");

// get arguments
const currentArgs = argsGrinder();

// initialize readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// initialize questions
const typeQuestion = () =>
  new Promise((resolve, reject) => {
    process.stdout.write(cm.fgCyan);
    rl.question(
      "what type of project (vanilla / react) would you like to make? (default: vanilla): ",
      answer => {
        let ans = answer ? answer : "vanilla";
        process.stdout.write(cm.reset);
        resolve(ans);
      }
    );
  });

const titleQuestion = () =>
  new Promise((resolve, _reject) => {
    process.stdout.write(cm.fgCyan);
    rl.question("name / title of website? (default: index): ", answer => {
      let ans = answer ? answer : "index";
      process.stdout.write(cm.reset);
      resolve(ans);
    });
  });

const styleQuestion = () =>
  new Promise((resolve, _reject) => {
    process.stdout.write(cm.fgCyan);
    rl.question(
      "would you like to use css, sass, or scss? (default: scss): ",
      answer => {
        let ans = answer ? answer : "scss";
        process.stdout.write(cm.reset);
        resolve(ans);
      }
    );
  });

const moduleQuestion = () =>
  new Promise((resolve, _reject) => {
    process.stdout.write(cm.fgCyan);
    rl.question(
      "would you like to use native js modules? (default: yes): ",
      answer => {
        let ans = answer ? answer : "yes";
        process.stdout.write(cm.reset);
        resolve(ans);
      }
    );
  });

const varsQuestion = () =>
  new Promise((resolve, _reject) => {
    process.stdout.write(cm.fgCyan);
    rl.question("name of scss vars file? (default: _vars): ", answer => {
      let ans = answer ? answer : "_vars";
      process.stdout.write(cm.reset);
      resolve(ans);
    });
  });

const defaultsQuestion = () =>
  new Promise((resolve, _reject) => {
    process.stdout.write(cm.fgCyan);
    rl.question("name of scss vars file? (default: _defaults): ", answer => {
      let ans = answer ? answer : "_defaults";
      process.stdout.write(cm.reset);
      resolve(ans);
    });
  });

const confirmQuestion = () =>
  new Promise((resolve, _reject) => {
    process.stdout.write(cm.fgCyan);
    rl.question("are you sure? ", answer => {
      confirmation = ["yes", "y"].includes(answer) ? true : false;
      process.stdout.write(cm.reset);
      resolve(confirmation);
    });
  });

module.exports.confirmQuestion = confirmQuestion;

const main = async () => {
  let typeOfProject,
    docTitle,
    cssOption,
    modulesOrNot,
    varsName,
    defaultsName,
    options;

  // when all questions are answered, go ahead and create the project
  rl.on("close", () => {
    if (typeOfProject === "react") {
      if (!currentArgs.some(e => e.startsWith("-r")))
        makeReactProject(options).then(() => {
          console.log(`\r\nreact project created successfully.`);
          process.exit();
        });
    } else if (typeOfProject === "vanilla") {
      if (!currentArgs.some(e => e.startsWith("-r")))
        makeVanillaProject(options).then(() => {
          console.log(`\r\nvanilla project created successfully.`);
          process.exit();
        });
    }

    // process.stdout.write(cm.fgYellow);
    // process.stdout.write(`\r\ngoodbye!\r\n ${JSON.stringify(options)}`);
    // process.stdout.write(cm.reset);
  });

  if (
    currentArgs.some(e => e.startsWith("-r")) &&
    !currentArgs.some(e => e.startsWith("-react"))
  ) {
    destroyProject();
  } else if (currentArgs.some(e => e.startsWith("-y"))) {
    // if "yes to all" argument is passed, set all values to default
    options = {
      title: "index",
      cssOption: "scss",
      modulesOrNot: true,
      varsName: "_vars.scss",
      defaultsName: "_defaults.scss"
    };

    // show results

    console.log("=====");
    ci("\r\n> options selected.\r\n");

    cb("\t> document title: ");
    process.stdout.write(`${options.title}\r\n`);

    cb("\t> css or scss: ");
    process.stdout.write(`${options.cssOption}\r\n`);

    cb("\t> use js native modules: ");
    process.stdout.write(`${options.modulesOrNot ? "yes" : "no"}\r\n`);

    cb("\t> name of css vars file: ");
    process.stdout.write(`${options.varsName}\r\n`);

    cb("\t> name of css defaults file: ");
    process.stdout.write(`${options.defaultsName}\r\n`);

    console.log("\r\n=====");

    rl.close();
  } else if (currentArgs.some(e => e.startsWith("-react"))) {
    // create react project
    options = {
      title: "index",
      cssOption: "scss",
      varsName: "_vars.scss",
      defaultsName: "_defaults.scss"
    };

    makeReactProject(options).then(() => {
      console.log(`\r\nreact project created successfully.`);
      process.exit();
    });

    // show results

    console.log("=====");
    ci("\r\n> options selected.\r\n");

    cb("\t> document title: ");
    process.stdout.write(`${options.title}\r\n`);

    cb("\t> css or scss: ");
    process.stdout.write(`${options.cssOption}\r\n`);

    cb("\t> name of css vars file: ");
    process.stdout.write(`${options.varsName}\r\n`);

    cb("\t> name of css defaults file: ");
    process.stdout.write(`${options.defaultsName}\r\n`);

    console.log("\r\n=====");

    rl.close();
  } else {
    // get type of project first:
    typeOfProject = await typeQuestion();

    while (!["react", "vanilla"].includes(typeOfProject.toLowerCase())) {
      ce("please choose between react and vanilla.");
      typeOfProject = await typeQuestion();
    }

    if (typeOfProject === "vanilla") {
      // get answers to questions:
      docTitle = await titleQuestion();
      cssOption = await styleQuestion();

      while (!["css", "scss", "sass"].includes(cssOption.toLowerCase())) {
        ce("please choose between scss and css.");
        cssOption = await styleQuestion();
      }

      modulesOrNot = await moduleQuestion();

      while (!["yes", "y", "n", "no"].includes(modulesOrNot.toLowerCase())) {
        ce("please just say yes or no.");
        modulesOrNot = await moduleQuestion();
      }

      varsName = await varsQuestion();
      defaultsName = await defaultsQuestion();

      if (varsName == defaultsName) {
        ce("please rename your vars file!");
        varsName = await varsQuestion();
      }

      // show results

      console.log("=====");
      ci("\r\n> options selected.\r\n");

      cb("\t> document title: ");
      process.stdout.write(`${docTitle}\r\n`);

      cb("\t> css or scss: ");
      process.stdout.write(`${cssOption}\r\n`);

      cb("\t> use js native modules: ");
      process.stdout.write(`${modulesOrNot}\r\n`);

      cb("\t> name of css vars file: ");
      process.stdout.write(`${varsName}.${cssOption}\r\n`);

      cb("\t> name of css defaults file: ");
      process.stdout.write(`${defaultsName}.${cssOption}\r\n`);

      console.log("\r\n=====");

      options = {
        title: docTitle,
        cssOption: cssOption,
        modulesOrNot: modulesOrNot.toLowerCase().startsWith("y") ? true : false,
        varsName: `${varsName}.${cssOption}`,
        defaultsName: `${defaultsName}.${cssOption}`
      };
    } else if (typeOfProject === "react") {
      // get answers to questions:
      docTitle = await titleQuestion();
      cssOption = await styleQuestion();

      while (!["css", "sass", "scss"].includes(cssOption.toLowerCase())) {
        ce("please choose between sass, scss and css.");
        cssOption = await styleQuestion();
      }

      varsName = await varsQuestion();
      defaultsName = await defaultsQuestion();

      if (varsName == defaultsName) {
        ce("please rename your vars file!");
        varsName = await varsQuestion();
      }

      // show results

      console.log("=====");
      ci("\r\n> options selected.\r\n");

      cb("\t> document title: ");
      process.stdout.write(`${docTitle}\r\n`);

      cb("\t> css or scss: ");
      process.stdout.write(`${cssOption}\r\n`);

      cb("\t> name of css vars file: ");
      process.stdout.write(`${varsName}.${cssOption}\r\n`);

      cb("\t> name of css defaults file: ");
      process.stdout.write(`${defaultsName}.${cssOption}\r\n`);

      console.log("\r\n=====");

      options = {
        title: docTitle,
        cssOption: cssOption,
        varsName: `${varsName}.${cssOption}`,
        defaultsName: `${defaultsName}.${cssOption}`
      };
    }

    rl.close();
  }
};

main();
