var Bundler = require('../bundler');

const main = `
const moduleA = require('./moduleA');
const moduleB = require('./moduleB');
moduleA.foo();
moduleB();
`.trim();

const moduleA = 'function foo() {}; module.exports = { foo };';
const moduleB = 'function bar() {}; module.exports = bar;';

const expectedOutput = `
const __modules = {
'./moduleA': function() { function foo() {}; return { foo }; },
'./moduleB': function() { function bar() {}; return bar; }
};
function require(path) { return __modules[path](); }
const moduleA = require('./moduleA');
const moduleB = require('./moduleB');
moduleA.foo();
moduleB();
`.trim();

fileResolverMock = {
  resolve(path) {
    if (path === './main.js') return Promise.resolve(main);
    if (path === './moduleA') return Promise.resolve(moduleA);
    if (path === './moduleB') return Promise.resolve(moduleB);
  }
}

describe('Bundler', () => {
  it('returns a code string that includes all of its required modules', () => {
    const bundler = new Bundler(fileResolverMock);
    return bundler.bundle('./main.js').then(output => {
      expect(output).toBe(expectedOutput);
    });
  });
});