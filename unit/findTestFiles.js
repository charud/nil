const fs = require('fs');
const basename = require('path').basename;

const ignoredFolders = ['node_modules'];

async function findTestFilesRecursively(path, _fs) {
  const files = await readFiles(path, _fs);
  const fileStatsPromises = files.map(file => getFileStats(`${path}/${file}`, _fs));
  const fileStats = await Promise.all(fileStatsPromises)
  let testFiles = [];
  for (fileStat of fileStats) {
    if (basename(fileStat.path)[0] === '.') continue;
    if (ignoredFolders.indexOf(basename(fileStat.path)) > -1) continue;

    if (fileStat.stats.isDirectory()) {
      const testFilesInDirectory = await findTestFilesRecursively(fileStat.path, _fs);
      testFiles = testFiles.concat(testFilesInDirectory);
    } else if (fileStat.stats.isFile() && fileStat.path.substr(-8) === '.test.js') {
      testFiles.push(fileStat.path);
    }
  }
  return testFiles;
}

function readFiles(path, _fs = fs) {
  return new Promise((resolve, reject) => {
    _fs.readdir(path, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}

function getFileStats(path, _fs = fs) {
  return new Promise((resolve, reject) => {
    _fs.lstat(path, (err, stats) => {
      if (err) reject(err);
      resolve({path, stats});
    })
  })
}

module.exports = findTestFilesRecursively;
