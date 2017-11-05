const fs = require('fs');
const basename = require('path').basename;

async function findTestFilesRecursively(path) {
  const files = await readFiles(path);
  const fileStatsPromises = files.map(file => getFileStats(`${path}/${file}`));
  const fileStats = await Promise.all(fileStatsPromises)
  let testFiles = [];
  for (fileStat of fileStats) {
    if (basename(fileStat.path)[0] === '.') continue;
    if (fileStat.stats.isDirectory()) {
      const testFilesInDirectory = await findTestFilesRecursively(fileStat.path);
      testFiles = testFiles.concat(testFilesInDirectory);
    } else if (fileStat.stats.isFile() && fileStat.path.substr(-8) === '.test.js') {
      testFiles.push(fileStat.path);
    }
  }
  return testFiles;
}

function readFiles(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
}

function getFileStats(path) {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (err, stats) => {
      if (err) reject(err);
      resolve({path, stats});
    })
  })
}

module.exports = findTestFilesRecursively;
