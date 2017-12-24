const findImports = require('../findImports');

const input = `
  const moduleA = require('moduleA');
  require('./moduleB.js');
  function() {
    const moduleC = require('./dir/moduleC.js');
  }
`;

describe('findImports', () => {
  it('returns a list of files that are imported', () => {
    const files = findImports(input);
    expect(files).toShallowEqual([
      'moduleA', './moduleB.js', './dir/moduleC.js'
    ]);
  })
});