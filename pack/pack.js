#!/usr/bin/env node
const fileResolver = require('./fileResolver');
const bundler = require('./bundler.js')(fileResolver);
const fs = require('fs');

console.log("Pack");

let args = process.argv.slice(2);
const inputFile = args[0];
const outputFile = args[1];

if (!inputFile || !outputFile) {
  console.log('Usage: pack inputFile outputFile\n- inputFile should be the entry-point to the application\n- outputFile will be created and contain the final bundle');
  process.exit();
}

console.log(`Bundling ${inputFile} into ${outputFile}`);

bundler.bundle(inputFile)
  .then(entryModule => writeFile(outputFile, entryModule))
  .then(() => console.log('Done'));

function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err, content) => {
      if (err) reject(err);
      resolve();
    });
  });
}
