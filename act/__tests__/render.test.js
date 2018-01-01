const act = require('../act');

const doc = {
  createElement: function(type) {
    const elm = {
      children: [],
      appendChild: child => elm.children.push(child),
      nodeName: type.toUpperCase(),
      get firstChild() {
        // Not completely correct since children != childNodes
        // that firstChild operates on, but works for this DOM mock
        return elm.children[0]
      }
    }
    return elm;
  },
  createTextNode: function(text) {
    const elm = {
      nodeName: '#text',
      nodeValue: text
    }
    return elm;
  } 
};

describe('act render', () => {
  it('renders a div element when called with a div component', () => {
    const component = act('div');
    const elm = act.render(component, doc);
    expect(elm.nodeName).toBe('DIV');
  });

  it('renders a div with one child when called with a composed component', () => {
    const elm = act.render(
      act('div', {}, act('div')),
      doc
    );
    expect(elm.nodeName).toBe('DIV')
    expect(elm.children[0].nodeName).toBe('DIV');
  });

  it('renders a div with multiple children when called with a multiple composed components', () => {
    const elm = act.render(
      act('div', {}, act('div'), act('div')),
      doc
    );
    expect(elm.nodeName).toBe('DIV')
    expect(elm.children[0].nodeName).toBe('DIV');
    expect(elm.children[1].nodeName).toBe('DIV');
  });

  it('renders a div with multiple children when called with a multiple composed non-div components', () => {
    const elm = act.render(
      act('div', {}, act('h1'), act('span')),
      doc
    );
    expect(elm.nodeName).toBe('DIV')
    expect(elm.children[0].nodeName).toBe('H1');
    expect(elm.children[1].nodeName).toBe('SPAN');
  });

  it('does not render complex component without children, but renders its siblings', () => {
    const complex = () => null;
    const elm = act.render(
      act('div', {},
        act('h1'),
        act(complex),
        act('span')),
      doc
    );
    expect(elm.nodeName).toBe('DIV')
    expect(elm.children[0].nodeName).toBe('H1');
    expect(elm.children[1].nodeName).toBe('SPAN');
  });

  it('renders children of complex components together with its siblings', () => {
    const complex = () => act('div', {}, null);
    const elm = act.render(
      act('div', {},
        act('h1'),
        act(complex, {}, act('div')),
        act('span')),
      doc
    );
    expect(elm.nodeName).toBe('DIV')
    expect(elm.children[0].nodeName).toBe('H1');
    expect(elm.children[1].nodeName).toBe('DIV');
    expect(elm.children[2].nodeName).toBe('SPAN');
  });

  it('renders a textnode if a string is passed as children', () => {
    const elm = act.render(act('div', {}, 'Foo'), doc);
    expect(elm.nodeName).toBe('DIV');
    expect(elm.firstChild.nodeName).toBe('#text');
    expect(elm.firstChild.nodeValue).toBe('Foo');
  });

  it('adds attributes to elements when passed as props', () => {
    const elm = act.render(act('div', { className: 'foo' }), doc);
    expect(elm.className).toBe('foo');
  });

  it('throws if an non-component is passed to act.render', () => {
    let wasThrown = false;
    try {
      act.render(() => {}, doc);
    } catch (e) {
      wasThrown = true;
    }
    expect(wasThrown).toBe(true)
  });
});
