const tmpl = require('../bundleTmpl');

describe('Bundle Template', () => {

  it('renders the template correctly', () => {
    const modules = {
      './foo': 'foo();',
      './bar': 'bar();'
    }
    const entryModule = 'foobar();';
    expect(tmpl({ entryModule, modules })).toBe(`
const __modules = {
'./foo': function() { foo(); },
'./bar': function() { bar(); }
};
function require(path) { if(path in __modules) return __modules[path](); console.log('Pack: Module', path, 'not found'); }
foobar();
`.trim());
  });

});