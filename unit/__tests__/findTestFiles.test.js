const extname = require('path').extname;
const findTestFiles = require('../findTestFiles');

describe('findTestFiles', () => {
  it('finds all test files in the current directory', () => {
    _fs = mockFs({
       '.': ['a.js',  'a.test.js', 'b.js', 'folder'],
       './folder': ['c.js', 'c.test.js']
    });
    return findTestFiles('.', _fs).then(files => {
      expect(files).toShallowEqual(['./a.test.js', './folder/c.test.js'])
    });
  });

  it('ignores files in node_modules', () => {
    _fs = mockFs({
       '.': ['foo', 'node_modules'],
       './foo': ['a.test.js'],
       './node_modules': ['b.test.js'],
    });
    return findTestFiles('.', _fs).then(files => {
      expect(files).toShallowEqual(['./foo/a.test.js']);
    });
  })
});

function mockFs(fileMap) {
  const _fs = {};
  _fs.readdir = (path, cb) => {
    if (path in fileMap) {
      cb(null, fileMap[path]);
    } else {
      cb('readdir mock: Invalid path ' + path);
    }
  };
  _fs.lstat = (path, cb) => {
    if (extname(path)) {
      cb(null, { isDirectory: () => false, isFile: () => true });
    } else {
      cb(null, { isDirectory: () => true, isFile: () => false });
    }
  };
  return _fs;
}
