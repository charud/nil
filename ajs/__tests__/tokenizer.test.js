const tokenizer = require('../tokenizer');
const tokens = tokenizer.tokens;

describe('tokenizer', () => {

  it('tokenize an open tag with no args', () => {
    expect(tokenizer('<foo>')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.TAG_END }
    ]);
  })

  it('tokenize a tag with no args', () => {
    expect(tokenizer('<foo />')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.TAG_END_CLOSED }
    ]);
  })

  it('tokenizes a tag with one arg', () => {
    expect(tokenizer('<foo bar="baz" />')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.ATTRIBUTE_NAME, value: 'bar' },
      { type: tokens.ATTRIBUTE_EQUAL },
      { type: tokens.ATTRIBUTE_VALUE, value: 'baz' },
      { type: tokens.TAG_END_CLOSED }
    ]);
  });

  it('tokenizes a tag with multiple args', () => {
    expect(tokenizer('<foo bar="baz" second="2" />')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.ATTRIBUTE_NAME, value: 'bar' },
      { type: tokens.ATTRIBUTE_EQUAL },
      { type: tokens.ATTRIBUTE_VALUE, value: 'baz' },
      { type: tokens.ATTRIBUTE_NAME, value: 'second' },
      { type: tokens.ATTRIBUTE_EQUAL },
      { type: tokens.ATTRIBUTE_VALUE, value: '2' },
      { type: tokens.TAG_END_CLOSED }
    ]);
  });

  it('tokenizes an empty arg', () => {
    expect(tokenizer('<foo bar="" />')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.ATTRIBUTE_NAME, value: 'bar' },
      { type: tokens.ATTRIBUTE_EQUAL },
      { type: tokens.ATTRIBUTE_VALUE, value: '' },
      { type: tokens.TAG_END_CLOSED }
    ]);
  });

  it('ignores whitespace', () => {
    expect(tokenizer('<foo     bar = "baz"   />')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.ATTRIBUTE_NAME, value: 'bar' },
      { type: tokens.ATTRIBUTE_EQUAL },
      { type: tokens.ATTRIBUTE_VALUE, value: 'baz' },
      { type: tokens.TAG_END_CLOSED }
    ]);
  });

  it('tokenizes a tag with a child', () => {
    expect(tokenizer('<foo><bar /></foo>')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.TAG_END },

      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'bar' },
      { type: tokens.TAG_END_CLOSED },

      { type: tokens.TAG_START_CLOSED },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.TAG_END }
    ]);
  });

  it('tokenizes a tag with many children and whitespace', () => {
    expect(tokenizer('<foo>\n <bar /> <baz /> \n</foo>')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.TAG_END },

      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'bar' },
      { type: tokens.TAG_END_CLOSED },

      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'baz' },
      { type: tokens.TAG_END_CLOSED },

      { type: tokens.TAG_START_CLOSED },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.TAG_END }
    ]);
  });

  it('tokenizes multiple levels of children', () => {
    expect(tokenizer('<foo><bar> <baz /> </bar></foo>')).toDeepEqual([
      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.TAG_END },

      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'bar' },
      { type: tokens.TAG_END },

      { type: tokens.TAG_START },
      { type: tokens.TAG_NAME, value: 'baz' },
      { type: tokens.TAG_END_CLOSED },

      { type: tokens.TAG_START_CLOSED },
      { type: tokens.TAG_NAME, value: 'bar' },
      { type: tokens.TAG_END },

      { type: tokens.TAG_START_CLOSED },
      { type: tokens.TAG_NAME, value: 'foo' },
      { type: tokens.TAG_END }
    ]);
  });

});