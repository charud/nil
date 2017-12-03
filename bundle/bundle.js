#!/usr/bin/env node
const fileResolver = require('./fileResolver');
const bundler = require('./bundler.js')(fileResolver);
const fs = require('fs');

console.log("Bundle");

let args = process.argv.slice(2);
const inputFile = args[0];
const outputFile = args[1];

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
