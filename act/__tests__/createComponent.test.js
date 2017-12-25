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
});
