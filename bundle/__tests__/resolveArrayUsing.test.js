const resolveArrayUsing = require('../resolveArrayUsing');

describe('resolveArrayUsing', () => {

  it('takes a map with values and returns a resolved map using the passed resolver function', () => {
    const array = ['foo', 'bar'];
    const promise = resolveArrayUsing(array, v => Promise.resolve('resolved ' + v));
    return promise.then(resolvedMap => {
      expect(resolvedMap).toShallowEqual({
        foo: 'resolved foo',
        bar: 'resolved bar'
      })
    });
  });

});
