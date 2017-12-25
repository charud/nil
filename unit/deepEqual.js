function deepEqual(a, b) {
  if (a === null && b === null) return true;
  if (a === null && b !== null) return false;
  if (b === null && a !== null) return false;
  if (typeof a === 'object' && typeof b === 'object'
    && Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (var i in a) {
    if (b[i] !== a[i]) {
      if (typeof(a[i]) === 'object' && typeof(b[i]) === 'object') {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
}

module.exports = deepEqual;