const ajs = require('./ajs');

/**
 * Replaces all AJS expressions in the supplied string with
 * Javascript expressions using the ajs parser.
 * @param {String} module
 */
function transformModule(module) {
  const expressions = findAjsExpressions(module);
  for (expression of expressions) {
    module = module.replace(expression, ajs(expression));
  }
  return module;
}

/**
 * Takes the contents of a module and returns an array of
 * the matched AJS expressions
 * @param {String} module
 */
function findAjsExpressions(module) {
  const expressions = [];

  let i = 0;
  while (i < module.length) {
    const foundExpression = readUntil('<');
    if (foundExpression) {
      const expression = readUntilEndOfExpression();
      expressions.push(expression);
    }
    i++
  }

  /**
   * Finds the end of an expression by counting opening tags
   * and closing tags
   */
  function readUntilEndOfExpression() {
    let buffer = '';
    let openTags = 0;
    while (i < module.length) {
      if (char() === '<') {
        if (nextChar() === '/') {
          openTags--;
        } else {
          openTags++;
        }
        buffer += readUntil('>');
        // Self-closing tags shouldn't count
        if (prevChar() === '/') {
          openTags--;
        }
      }
      if (openTags === 0) {
        return buffer;
      }
      i++;
    }
  }

  /**
   * Reads until the character specified and then stops
   * @param String stopAtChar
   * @return String what was read up until the stop character
   */
  function readUntil(stopAtChar) {
    let buffer = '';
    while (i < module.length) {
      buffer += char();
      if (char() === stopAtChar) {
        return buffer;
      }
      i++;
    }
    return false;
  }

  function char() {
    return module[i];
  }

  function nextChar() {
    return module[i + 1];
  }

  function prevChar() {
    return module[i - 1];
  }

  return expressions;
}

module.exports = transformModule;
