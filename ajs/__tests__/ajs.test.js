const ajs = require('../ajs');

describe('ajs', () => {

  it('transforms <div />', () => {
    expect(ajs('<div />')).toBe(`act("div", {}, null)`);
  });

  it('adds attributes as props', () => {
    expect(ajs('<div className="foo" id="bar" />'))
      .toBe(`act("div", {"className":"foo","id":"bar"}, null)`);
  });

  it('transforms a child', () => {
    expect(ajs('<div><span /></div>'))
      .toBe(`act("div", {}, act("span", {}, null))`)
  });

  it('transform multiple children', () => {
    expect(ajs('<div><span /><span /></div>'))
      .toBe('act("div", {}, act("span", {}, null), act("span", {}, null))');
  });

  it('transforms multiple levels of children', () => {
    expect(ajs('<div><span><div id="foo" /></span></div>'))
      .toBe('act("div", {}, act("span", {}, act("div", {"id":"foo"}, null)))');
  })

});