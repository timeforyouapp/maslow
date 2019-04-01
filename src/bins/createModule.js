#!/usr/bin/env node
const yargs = require('yargs').argv;
const fs = require('fs');
const path = require('path');

if (!yargs.root) {
  throw new Error('Missing --root param');
}

if (!yargs.moduleName) {
  throw new Error('Missing --moduleName param');
}

const capitalize = (name) => {
  const [first, ...rest] = name;
  return first.toUpperCase() + rest.join('');
};


fs.readFile(path.resolve(__dirname, 'templates/module.js'), 'utf-8', (readErr, file) => {
  if (readErr) {
    throw readErr;
  }


  const filePath = path.resolve(process.cwd(), yargs.root, yargs.moduleName);
  const newFile = file.replace(/__myModuleName__/g, yargs.moduleName)
    .replace(/__myCapitalizedModuleName__/g, capitalize(yargs.moduleName));

  fs.mkdir(filePath, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      throw mkdirErr;
    }

    fs.writeFile(path.resolve(filePath, 'index.js'), newFile, (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }

      // eslint-disable-next-line
      console.log(`${yargs.moduleName} module was created with success in: ${filePath}`);
      process.exit(0);
    });
  });
});
