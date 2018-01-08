function tokenize(code) {
  const tokens = [];
  let readIndex = 0;
  let buffer = '';

  const read = {
    start: char => {
      if (char === '<') {
        if (peekNextChar() === '/') {
          pushToken(t.TAG_START_CLOSED);
          readIndex++;
        } else {
          pushToken(t.TAG_START);
        }
        state = read.tagName;
      } else {
        buffer += char;
      }
      readIndex++;
    },
    tagName: char => {
      if (char === '/' || char === '>') {
        pushToken(t.TAG_NAME, buffer);
        state = read.tagInside;
      } else if (char === ' ') {
        pushToken(t.TAG_NAME, buffer);
        state = read.tagInside;
        readIndex++;
      } else {
        buffer += char;
        readIndex++;
      }
    },
    tagInside: char => {
      if (char === ' ') {
        readIndex++;
      } else if (char === '/') {
        if (peekNextChar() === '>') {
          pushToken(t.TAG_END_CLOSED);
          readIndex += 2;
          state = read.start;
        } else throw Error('Unexpected "/"');
      } else if (char === '>') {
        pushToken(t.TAG_END);
        readIndex++;
        state = read.start;
      } else {
        state = read.attributeName;
      }
    },
    attributeName: char => {
      if (char === '=') {
        pushToken(t.ATTRIBUTE_NAME, buffer);
        pushToken(t.ATTRIBUTE_EQUAL);
        state = read.attributeValue;
      } else if (char === ' ') {
        // Ignore whitespace
      } else {
        buffer += char;
      }
      readIndex++;
    },
    attributeValue: char => {
      if (char === '"') {
        state = read.attributeValueInsideQuotes;
      }
      readIndex++;
    },
    attributeValueInsideQuotes: char => {
      if (char === '"') {
        pushToken(t.ATTRIBUTE_VALUE, buffer);
        state = read.tagInside;
      } else {
        buffer += char;
      }
      readIndex++;
    }
  };
  let state = read.start;

  while (readIndex < code.length) {
    const char = code[readIndex];
    state(char);
  }

  return tokens;

  function peekNextChar() {
    return code[readIndex + 1];
  }

  function pushToken(type, value) {
    if (value !== undefined) {
      tokens.push({ type, value });
    } else {
      tokens.push({ type });
    }
    buffer = '';
  }
}

const t = tokenize.tokens = {
  TAG_START: '<',
  TAG_START_CLOSED: '</',
  TAG_END: '>',
  TAG_END_CLOSED: '/>',
  TAG_NAME: 'TAG_NAME',
  ATTRIBUTE_NAME: 'ATTR_NAME',
  ATTRIBUTE_EQUAL: '=',
  ATTRIBUTE_VALUE: 'ATTR_VALUE'
};

module.exports = tokenize;
