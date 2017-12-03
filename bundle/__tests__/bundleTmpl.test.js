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
function require(path) { return __modules[path](); }
foobar();
`.trim());
  });

});