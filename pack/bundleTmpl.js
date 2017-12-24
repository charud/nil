function bundleTmpl(params) {
  const { modules, entryModule } = params;
  return `
const __modules = {
${Object.keys(modules)
  .map(name => `'${name}': function() { ${modules[name]} }`)
  .join(',\n')}
};
function require(path) { return __modules[path](); }
${entryModule}

`.trim();
}

module.exports = bundleTmpl;