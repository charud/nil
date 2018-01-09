const tm = require('../transformModule');

describe('transformModule', () => {
  it('rewrites plain AJS to JS', () => {
    expect(tm('<div />')).toBe(`act("div", {}, null)`);
  })

  it('leaves strings around AJS intact', () => {
    expect(tm('const foo = <div />;')).toBe(`const foo = act("div", {}, null);`);
  })

  it('handles multiple AJS expressions', () => {
    expect(tm(`
      function(foo = <div />) {
        return <div><span /></div>;
      }
    `)).toBe(`
      function(foo = act("div", {}, null)) {
        return act("div", {}, act("span", {}, null));
      }
    `)
  })
});
