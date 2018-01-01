const findImports = require('./findImports');
const resolveArrayUsing = require('./resolveArrayUsing');
const bundleTmpl = require('./bundleTmpl');
const dirname = require('path').dirname;
const pathResolve = require('path').resolve;
const pathJoin = require('path').join;

function bundler(fileResolver) {
  async function bundle(path) {
    const entry = await fileResolver.resolve(path).then(rewriteRequiresToBeAbsolute);
    const modules = await findModulesRecursively(entry);

    const bundle = bundleTmpl({ entryModule: entry, modules });
    return bundle;
  }

  async function findModulesRecursively(inModule, basePath = '/') {
    // Find imports in this module and retrieve their modules
    const imports = findImports(inModule).map(path => pathResolve(basePath, path));
    const foundModules = await resolveArrayUsing(imports, path =>
      fileResolver
        .resolve(path)
        .then(replaceModuleExportsWithReturn)
        .then(module => rewriteRequiresToBeAbsolute(module, dirname(path)))
    );

    // Find imports in all of the retrieved modules
    // and add them to the modules list
    for (var path in foundModules) {
      const subModules = await findModulesRecursively(foundModules[path], dirname(path) + '/');
      for (var subPath in subModules) {
        foundModules[subPath] = subModules[subPath];
      }
    }

    // const moduleWithSubmodules = Object.keys(foundModules).reduce(async (modules, path) => {
    //   return {
    //     ...(await modules),
    //     ...(await findModulesRecursively(foundModules[path]))
    //   }
    // }, foundModules)

    return foundModules;
  }
  return { bundle };
}


function replaceModuleExportsWithReturn(module) {
  return module.replace(
    /module\.exports = ([^;]+);/g,
    'return $1;'
  );
}

function rewriteRequiresToBeAbsolute(module, basePath = '/') {
  return module.replace(
    /require\(['"]([^'"]+)['"]\)/g,
    (_, path) => `require('${pathResolve(basePath, path)}')`
  );
}

module.exports = bundler;
