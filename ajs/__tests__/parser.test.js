const parser = require('../parser');
const t = require('../tokenizer').tokens;

describe('parser', () => {

  it('generates AST from single tag', () => {
    const tokens = [
      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.TAG_END }
    ];
    expect(parser.parse(tokens)).toDeepEqual({
      root: {
        type: 'node',
        name: 'foo',
        attributes: [],
        children: []
      }
    });
  });

  it('generates AST from single closed tag', () => {
    const tokens = [
      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.TAG_END_CLOSED }
    ];
    expect(parser.parse(tokens)).toDeepEqual({
      root: {
        type: 'node',
        name: 'foo',
        attributes: [],
        children: null
      }
    });
  });

  it('generates AST from a single tag with one attribute', () => {
    const tokens = [
      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.ATTRIBUTE_NAME, value: 'bar' },
      { type: t.ATTRIBUTE_EQUAL },
      { type: t.ATTRIBUTE_VALUE, value: 'baz' },
      { type: t.TAG_END_CLOSED }
    ];
    expect(parser.parse(tokens)).toDeepEqual({
      root: {
        type: 'node',
        name: 'foo',
        attributes: [
          { name: 'bar', value: 'baz' }
        ],
        children: null
      }
    });
  });

  it('generates AST from a single tag with multiple attributes', () => {
    const tokens = [
      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.ATTRIBUTE_NAME, value: 'bar' },
      { type: t.ATTRIBUTE_EQUAL },
      { type: t.ATTRIBUTE_VALUE, value: 'baz' },
      { type: t.ATTRIBUTE_NAME, value: 'a' },
      { type: t.ATTRIBUTE_EQUAL },
      { type: t.ATTRIBUTE_VALUE, value: 'b' },
      { type: t.TAG_END_CLOSED }
    ];
    expect(parser.parse(tokens)).toDeepEqual({
      root: {
        type: 'node',
        name: 'foo',
        attributes: [
          { name: 'bar', value: 'baz' },
          { name: 'a', value: 'b' },
        ],
        children: null
      }
    });
  });

  it('generates AST from a tag with one child', () => {
    const tokens = [
      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.TAG_END },

      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'bar' },
      { type: t.TAG_END_CLOSED },

      { type: t.TAG_START_CLOSED },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.TAG_END, value: 'foo' },
    ];
    expect(parser.parse(tokens)).toDeepEqual({
      root: {
        type: 'node',
        name: 'foo',
        attributes: [],
        children: [
          {
            type: 'node',
            name: 'bar',
            attributes: [],
            children: null
          }
        ]
      }
    });
  });

  it('generates AST from a tag with multiple children', () => {
    const tokens = [
      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.TAG_END },

      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'bar' },
      { type: t.TAG_END_CLOSED },

      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'baz' },
      { type: t.TAG_END_CLOSED },

      { type: t.TAG_START_CLOSED },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.TAG_END, value: 'foo' },
    ];
    expect(parser.parse(tokens)).toDeepEqual({
      root: {
        type: 'node',
        name: 'foo',
        attributes: [],
        children: [
          {
            type: 'node',
            name: 'bar',
            attributes: [],
            children: null
          },
          {
            type: 'node',
            name: 'baz',
            attributes: [],
            children: null
          }
        ]
      }
    });
  });

  it('generates AST from a tag with two children with one child each', () => {
    const tokens = [
      { type: t.TAG_START },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.TAG_END },

        { type: t.TAG_START },
        { type: t.TAG_NAME, value: 'bar' },
        { type: t.TAG_END },

          { type: t.TAG_START },
          { type: t.TAG_NAME, value: 'bar_child' },
          { type: t.TAG_END_CLOSED },

        { type: t.TAG_START_CLOSED },
        { type: t.TAG_NAME, value: 'bar' },
        { type: t.TAG_END },

        { type: t.TAG_START },
        { type: t.TAG_NAME, value: 'baz' },
        { type: t.TAG_END },

          { type: t.TAG_START },
          { type: t.TAG_NAME, value: 'baz_child' },
          { type: t.TAG_END_CLOSED },

        { type: t.TAG_START_CLOSED },
        { type: t.TAG_NAME, value: 'baz' },
        { type: t.TAG_END },

      { type: t.TAG_START_CLOSED },
      { type: t.TAG_NAME, value: 'foo' },
      { type: t.TAG_END },
    ];
    expect(parser.parse(tokens)).toDeepEqual({
      root: {
        type: 'node',
        name: 'foo',
        attributes: [],
        children: [
          {
            type: 'node',
            name: 'bar',
            attributes: [],
            children: [{ type: 'node', name: 'bar_child', attributes: [], children: null }]
          },
          {
            type: 'node',
            name: 'baz',
            attributes: [],
            children: [{ type: 'node', name: 'baz_child', attributes: [], children: null }]
          }
        ]
      }
    });
  });

});