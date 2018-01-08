const t = require('./tokenizer').tokens;

function generateAST(tokens) {
  tokens = shallowClone(tokens);
  const ast = {};
  const nodes = readOutsideNode(tokens);
  if (nodes) {
    ast.root = nodes[0];
  }
  return ast;
}

/**
 * Reads any tokens that appears in between tags. Since AJS is mostly tags,
 * this is mostly start tags (<) and closing tags (</).
 * @param {*} tokens
 * @param {*} stopOnClosingTag  On which closing tag value (e.g. 'div') it should stop reading.
 *                              This separates children hierarchies from each other, e.g.:
 *                              <foo>                    v- stop reading children for bar here
 *                                 <bar> <bar_child /> </bar>
 *                                 <baz> <baz_child /> </baz>
*                               </foo>
 *                              Not needed for root, since it stops reading when all tokens are read.
 */
function readOutsideNode(tokens, stopOnClosingTag = null) {
  const nodes = [];
  while (!empty(tokens)) {
    const token = next(tokens);
    if (token.type === t.TAG_START) {
      const node = readNode(tokens);
      nodes.push(node);
    }
    if (token.type === t.TAG_START_CLOSED) {
      const closingNode = nextVerify(tokens, t.TAG_NAME);
      if (closingNode.value === stopOnClosingTag) {
        break;
      }
    }
  }
  return nodes;
}

/**
 * Reads all tokens inside of a tag and returns a node object.
 * It starts by the tag name, proceeds to all attributes,
 * once the attribute tokens are over, it checks if the tag ends with
 * a closing tag (>) or a self-closing tag (/>). On a closing tag
 * it assumes that the tag must have children and proceeds to read them.
 * @param {*} tokens
 */
function readNode(tokens) {
  let tokenTagName = nextVerify(tokens, t.TAG_NAME);

  const node = {
    type: 'node',
    name: tokenTagName.value,
    attributes: [],
    children: null
  }

  // Get the next token after the tag name
  // and continue reading until there are tag attributes left
  token = next(tokens);
  while (token.type === t.ATTRIBUTE_NAME) {
    nextVerify(tokens, t.ATTRIBUTE_EQUAL);
    const tokenAttrValue = nextVerify(tokens, t.ATTRIBUTE_VALUE);

    const attribute = {
      name: token.value,
      value: tokenAttrValue.value
    };
    node.attributes.push(attribute);

    token = next(tokens);
  }

  verifyOneOf(token, [ t.TAG_END, t.TAG_END_CLOSED ]);

  // If this tag is self-closing there are no children
  if (token.type === t.TAG_END_CLOSED) {
    return node;
  }

  // Otherwise look for children inside of this tag
  node.children = readOutsideNode(tokens, tokenTagName.value);
  return node;
};

///

function shallowClone(arr) {
  return arr.slice(0);
}

function empty(array) {
  return array.length === 0;
}

function next(array) {
  return array.shift();
}

function verify(token, expectedType) {
  if (token.type !== expectedType) {
    throw Error(`Unexpected token: "${token.type}", expected "${expectedType}"`);
  }
}

function verifyOneOf(token, expectedTypes) {
  if (expectedTypes.indexOf(token.type) === -1) {
    const prettyTypes = expectedTypes.map(t => `"${t}"`).join(',');
    throw Error(`Unexpected token: "${token.type}", expected one of ${prettyTypes}`);
  }
}

function nextVerify(array, expectedType) {
  const next = array.shift();
  verify(next, expectedType);
  return next;
}

module.exports = { parse: generateAST };