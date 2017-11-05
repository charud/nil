const fs = require('fs');
const findTestFiles = require('./findTestFiles');

mockFs();

describe('findTestFiles', () => {
  it('should pass', () => {
    expect(1).toBe(1);
  });

  it('finds all test files in the current directory', () => {
    return findTestFiles('.').then(files => {
      expect(files).toShallowEqual(['./a.test.js', './folder/c.test.js'])
    });
  });
});

/**
 * Mocks the following directory structure
 * - a.js
 * - a.test.js
 * - b.js
 * > folder
 *   - c.js
 *   - c.test.js
 */
function mockFs() {
  fs.readdir = (path, cb) => {
    if (path === '.') {
      cb(null, ['a.js',  'a.test.js', 'b.js', 'folder']);
    } else if (path === './folder') {
      cb(null, ['c.js', 'c.test.js']);
    } else {
      cb('readdir mock: Invalid path ' + path);
    }
  }

  fs.lstat = (path, cb) => {
    const files = ['./a.js', './a.test.js', './b.js', './folder/c.js', './folder/c.test.js'];
    const dirs = ['./folder'];
    if (files.indexOf(path) > -1) {
      cb(null, { isDirectory: () => false, isFile: () => true });
    } else if (dirs.indexOf(path) > -1) {
      cb(null, { isDirectory: () => true, isFile: () => false });
    } else {
      cb(new Error('lstat: Path not found: ' + path));
    }
  };
}
