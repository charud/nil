const findImports = require('./findImports');
const resolveArrayUsing = require('./resolveArrayUsing');
const bundleTmpl = require('./bundleTmpl');

function bundler(fileResolver) {
  async function bundle(path) {
    const entry = await fileResolver.resolve(path);

    const imports = findImports(entry);
    const modules = await resolveArrayUsing(imports, path =>
      fileResolver.resolve(path)
        .then(replaceModuleExportsWithReturn)
    );

    const bundle = bundleTmpl({ entryModule: entry, modules });
    return bundle;
  }
  return { bundle };
}

function replaceModuleExportsWithReturn(module) {
  return module.replace(
    /module\.exports = ([^;]+);/g,
    'return $1;'
  );
}

module.exports = bundler;
