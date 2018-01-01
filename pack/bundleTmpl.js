function bundleTmpl(params) {
  const { modules, entryModule } = params;
  return `
const __modules = {
${Object.keys(modules)
  .map(name => `'${name}': function() { ${modules[name]} }`)
  .join(',\n')}
};
function require(path) { if(path in __modules) return __modules[path](); console.log('Pack: Module', path, 'not found'); }
${entryModule}

`.trim();
}

module.exports = bundleTmpl;