function tokenize(code) {
  const tokens = [];
  let readIndex = 0;
  let buffer = '';
  while (readIndex < code.length) {
    //console.log(readIndex, code.length);
    const char = code[readIndex];
    if (char === '<') pushToken(t.TAG_START);
    else if (char === ' ') {
      if (buffer.length > 0) {
        if (lookBehind() === t.TAG_START) pushToken(t.TAG_NAME, buffer);
      } else {
        readIndex++;
      }
    }
    else if (char === '=') {
      pushToken(t.ATTRIBUTE_NAME, buffer, {dontAdvanceIndex: true});
      pushToken(t.ATTRIBUTE_EQUAL);
    }
    else if (char === '"') {
      if (lookBehind() === t.ATTRIBUTE_EQUAL) {
        if (buffer.length > 0) pushToken(t.ATTRIBUTE_VALUE, buffer);
        else readIndex++;
      }
      else if (lookBehind() === t.ATTRIBUTE_NAME) pushToken(t.ATTRIBUTE_VALUE);
    }
    else if (char === '>') {
      // For tags without any args
      if (lookBehind() === t.TAG_START) {
        pushToken(t.TAG_NAME, buffer, { dontAdvanceIndex: true });
      }
      if (lookBehindBuffer() === '/') {
        pushToken(t.TAG_END_CLOSED);
      } else {
        pushToken(t.TAG_END);
      }
    }
    else pushBuffer(char);
  }

  return tokens;

  function lookBehind() {
    const token = tokens[tokens.length - 1];
    if (token) return token.type;
  }

  function lookBehindBuffer() {
    return buffer[buffer.length - 1];
  }

  function pushBuffer(char) {
    buffer += char;
    readIndex++;
  }

  function pushToken(type, value, { dontAdvanceIndex } = {} ) {
    if (value) tokens.push({ type, value });
    else tokens.push({ type });
    buffer = '';
    if (!dontAdvanceIndex) readIndex++;
  }
}

const t = tokenize.tokens = {
  TAG_START: '<',
  TAG_END: '>',
  TAG_END_CLOSED: '/>',
  TAG_NAME: 'NAME',
  ATTRIBUTE_NAME: 'ATTR',
  ATTRIBUTE_EQUAL: '=',
  ATTRIBUTE_VALUE: 'VALUE'
};

module.exports = tokenize;