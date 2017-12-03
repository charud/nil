function findImports(strCode) {
  const matches = strCode.match(/require\([^\)]+\)/g);
  const imports = matches.map(match =>
    // match returns the full require statement,
    // retrieve the module name from inside the
    // first and last quote.
    match.substring(
      match.indexOf(`'`) + 1,
      match.lastIndexOf(`'`)
    )
  );
  return imports;
}

module.exports = findImports;