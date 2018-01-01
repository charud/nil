var Bundler = require('../bundler');

const main = `
const moduleA = require('./moduleA');
const moduleB = require('./moduleB');
moduleA.foo();
moduleB();
`.trim();
const main2 = `const moduleD = require('./dir/moduleD');`;

const moduleA = 'function foo() {}; module.exports = { foo };';
const moduleB = 'const moduleC = require("./moduleC"); function bar() {}; module.exports = bar;';
const moduleC = 'function baz() {}; module.exports = baz;';

const moduleD = 'require("./moduleE"); foo();';
const moduleE = 'bar();';

fileResolverMock = {
  resolve(path) {
    if (path === './main.js') return Promise.resolve(main);
    if (path === '/moduleA') return Promise.resolve(moduleA);
    if (path === '/moduleB') return Promise.resolve(moduleB);
    if (path === '/moduleC') return Promise.resolve(moduleC);

    if (path === './main2.js') return Promise.resolve(main2);
    if (path === '/dir/moduleD') return Promise.resolve(moduleD);
    if (path === '/dir/moduleE') return Promise.resolve(moduleE);
    throw new Error('fileResolverMock was called with unexpected path: ' + path);
  }
}

describe('Bundler', () => {
  it('returns a code string that includes all of its required modules', () => {
    const expectedOutput = `
const __modules = {
'/moduleA': function() { function foo() {}; return { foo }; },
'/moduleB': function() { const moduleC = require('/moduleC'); function bar() {}; return bar; },
'/moduleC': function() { function baz() {}; return baz; }
};
function require(path) { if(path in __modules) return __modules[path](); console.log('Pack: Module', path, 'not found'); }
const moduleA = require('/moduleA');
const moduleB = require('/moduleB');
moduleA.foo();
moduleB();
    `.trim();
    const bundler = new Bundler(fileResolverMock);
    return bundler.bundle('./main.js').then(output => {
      expect(output).toBe(expectedOutput);
    });
  });

  it('imports modules relative to the importing module', () => {
    const bundler = new Bundler(fileResolverMock);
    return bundler.bundle('./main2.js').then(output => {
      expect(output).toContain(`/dir/moduleE': function() { bar(); }`);
    });
  });

  it('rewrites requires to be absolute from the working dir', () => {
    const bundler = new Bundler(fileResolverMock);
    return bundler.bundle('./main2.js').then(output => {
      expect(output).toContain(`/dir/moduleD': function() { require('/dir/moduleE'); foo(); }`);
    });
  });

});