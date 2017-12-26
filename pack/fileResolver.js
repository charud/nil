let fs = require('fs');
let extname = require('path').extname;

function resolve(path, _fs /* for mocking */) {
  fs = _fs || fs;

  // Default to .js when no extension is passed
  if (!extname(path)) {
    path += '.js';
  }

  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, content) => {
      if (err) reject(err);
      resolve(content);
    });
  });
}

module.exports = { resolve };
