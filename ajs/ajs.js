const tokenizer = require('./tokenizer');
const parser = require('./parser').parse;

function transform(module) {
  const ast = parser(tokenizer(module));
  const js = jsFromNode(ast.root);
  return js;
}

function jsFromNode(node) {
  // Turn AST attributes: [ { name: 'className', value: 'foo' } ]
  // Into act props: { className: 'foo' }
  const props = node.attributes.reduce((obj, next) => {
    obj[next.name] = next.value;
    return obj;
  }, {});

  // Transform child nodes
  const children = node.children
    ? node.children.map(jsFromNode).join(', ')
    : null;

  const jsonType = JSON.stringify(node.name);
  const jsonProps = JSON.stringify(props);
  return `act(${jsonType}, ${jsonProps}, ${children})`;
}

module.exports = transform;