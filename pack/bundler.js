const findImports = require('./findImports');
const resolveArrayUsing = require('./resolveArrayUsing');
const bundleTmpl = require('./bundleTmpl');

function bundler(fileResolver) {
  async function bundle(path) {
    const entry = await fileResolver.resolve(path);
    const modules = await findModulesRecursively(entry);

    const bundle = bundleTmpl({ entryModule: entry, modules });
    return bundle;
  }

  async function findModulesRecursively(inModule) {
    // Find imports in this module and retrieve their modules
    const foundModules = await resolveArrayUsing(findImports(inModule), path =>
      fileResolver
        .resolve(path)
        .then(replaceModuleExportsWithReturn)
    );

    // Find imports in all of the retrieved modules
    // and add them to the modules list
    for (var path in foundModules) {
      const subModules = await findModulesRecursively(foundModules[path]);
      for (var path in subModules) {
        foundModules[path] = subModules[path];
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

module.exports = bundler;
