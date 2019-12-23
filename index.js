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

const { makeProject, destroyProject } = require("./src/project");

// get arguments
const currentArgs = argsGrinder();

// initialize readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// initialize questions

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
      "would you like to use css or scss? (default: scss): ",
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

// rl.on("close", () => {
//   process.stdout.write(cm.fgYellow);
//   process.stdout.write("\r\ngoodbye!\r\n");
//   process.stdout.write(cm.reset);
//   process.exit(0);
// });

const main = async () => {
  let docTitle, cssOrScss, modulesOrNot, varsName, defaultsName, options;

  if (currentArgs.some(e => e.startsWith("-r"))) {
    destroyProject();
  } else if (currentArgs.some(e => e.startsWith("-y"))) {
    // if "yes to all" argument is passed, set all values to default
    options = {
      title: "index",
      cssOrScss: "scss",
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
    process.stdout.write(`${options.cssOrScss}\r\n`);

    cb("\t> use js native modules: ");
    process.stdout.write(`${options.modulesOrNot ? "yes" : "no"}\r\n`);

    cb("\t> name of css vars file: ");
    process.stdout.write(`${options.varsName}\r\n`);

    cb("\t> name of css defaults file: ");
    process.stdout.write(`${options.defaultsName}\r\n`);

    console.log("\r\n=====");

    rl.close();
  } else {
    // get answers to questions:
    docTitle = await titleQuestion();
    cssOrScss = await styleQuestion();

    while (!["css", "scss"].includes(cssOrScss.toLowerCase())) {
      ce("please choose between scss and css.");
      cssOrScss = await styleQuestion();
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
    process.stdout.write(`${cssOrScss}\r\n`);

    cb("\t> use js native modules: ");
    process.stdout.write(`${modulesOrNot}\r\n`);

    cb("\t> name of css vars file: ");
    process.stdout.write(`${varsName}.${cssOrScss}\r\n`);

    cb("\t> name of css defaults file: ");
    process.stdout.write(`${defaultsName}.${cssOrScss}\r\n`);

    console.log("\r\n=====");

    options = {
      title: docTitle,
      cssOrScss: cssOrScss,
      modulesOrNot: modulesOrNot.toLowerCase().startsWith("y") ? true : false,
      varsName: `${varsName}.${cssOrScss}`,
      defaultsName: `${defaultsName}.${cssOrScss}`
    };

    rl.close();
  }

  if (!currentArgs.some(e => e.startsWith("-r")))
    makeProject(options).then(() => {
      console.log(`\r\nproject created successfully.`);
      process.exit();
    });
};

main();
