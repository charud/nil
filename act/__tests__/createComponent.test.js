const act = require('../act');

describe('act createComponent', () => {

  it('it reteCturns a tree representation when called with div primitive', () => {
    const tree = act('div', {}, 'Foo');
    expect(tree).toDeepEqual({
      type: 'div',
      props: {},
      children: 'Foo'
    });
  });

  it('it returns a tree representation when called with span primitive', () => {
    const tree = act('span', {}, 'Foo');
    expect(tree).toDeepEqual({
      type: 'span',
      props: {},
      children: 'Foo'
    });
  });

  it('returns a tree representation when called with a component', () => {
    const component = () => act('div', {}, 'Foo');
    const tree = act(component, {}, null);
    expect(tree).toDeepEqual({
      type: component,
      props: {},
      children: {
        type: 'div',
        props: {},
        children: 'Foo'
      }
    })
  })

  it('returns a tree representation when called with multiple children', () => {
    const tree = act('div', {}, act('div'), act('div'));
    expect(tree).toDeepEqual({
      type: 'div',
      props: {},
      children: [
        {
          type: 'div',
          props: {},
          children: null
        },
        {
          type: 'div',
          props: {},
          children: null
        }
      ]
    })
  })

  it('it includes props in the tree representation', () => {
    const tree = act('div', { propA: 1, propB: 'b' });
    expect(tree).toDeepEqual({
      type: 'div',
      props: { propA: 1, propB: 'b' },
      children: null
    })
  });

  it('calls complex components with the props provided', () => {
    const component = ({textProp}) => act('div', {}, textProp);
    const tree = act(component, { textProp: 'foo' });
    expect(tree).toDeepEqual({
      type: component,
      props: { textProp: 'foo' },
      children: {
        type: 'div',
        props: {},
        children: 'foo'
      }
    })
  });

});
