async function resolveArrayUsing(array, resolver) {
  const promises = [];
  for (const item of array) {
    promises.push(resolver(item));
  }
  const resolvedPromises = await Promise.all(promises);
  const resolvedMap = {};
  let i = 0;
  for (const item of array) {
    resolvedMap[item] = resolvedPromises[i++];
  }

  return resolvedMap;
}

module.exports = resolveArrayUsing;
