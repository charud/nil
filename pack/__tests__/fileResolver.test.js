var fileResolver = require('../fileResolver');

describe('File Resolver', () => {

  const fsMock = {
    readFile: (path, encoding, cb) => {
      if (path === './foo.js') cb(null, 'foobaz');
      cb(new Error('fsMock: Path not found: ' + path));
    }
  }

  it('returns a promise with the content of the requested file', () => {
    return fileResolver.resolve('./foo.js', fsMock).then(content =>
      expect(content).toBe('foobaz')
    );
  });

  it('defaults to .js if no extension is passed', () => {
    return fileResolver.resolve('./foo', fsMock).then(content =>
      expect(content).toBe('foobaz')
    );
  });

});