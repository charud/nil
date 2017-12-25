const deepEqual = require('../deepEqual');

describe('deep equal', () => {

  it('should return true if two simple objects are equal', () => {
    const a = { a: 1, b: 'foo' };
    const b = { a: 1, b: 'foo' };
    expect(deepEqual(a, b)).toBe(true);
  });

  it('should return true if two simple objects with different order are equal', () => {
    const a = { a: 1, b: 'foo' };
    const b = { b: 'foo', a: 1 };
    expect(deepEqual(a, b)).toBe(true);
  });

  it('should return false if two simple objects are not equal', () => {
    const a = { a: 1, b: 'foo' };
    const b = { a: 1, b: 'bar' };
    expect(deepEqual(a, b)).toBe(false);
  });

  it('should return false if a is longer than b', () => {
    const a = { a: 1, b: 'bar', c: 2 };
    const b = { a: 1, b: 'bar' };
    expect(deepEqual(a, b)).toBe(false);
  });

  it('should return false if b is longer than a', () => {
    const a = { a: 1, b: 'foo' };
    const b = { a: 1, b: 'foo', c: 2 };
    expect(deepEqual(a, b)).toBe(false);
  });

  it('should return true if two complex objects are equal', () => {
    const a = { a: 1, b: { foo: 'bar' } };
    const b = { a: 1, b: { foo: 'bar' } };
    expect(deepEqual(a, b)).toBe(true);
  });

  it('should return false if two complex objects are not equal', () => {
    const a = { a: 1, b: { foo: 'bar' } };
    const b = { a: 1, b: { foo: 'foo' } };
    expect(deepEqual(a, b)).toBe(false);
  });

  it('should return false if two complex objects have different properties', () => {
    const a = { a: 1, b: { foo: 'bar', bar: 'foo' } };
    const b = { a: 1, b: { foo: 'foo', b: 'foo' } };
    expect(deepEqual(a, b)).toBe(false);
  });

  it('should return true if two complex objects contains equal arrays', () => {
    const a = { a: 1, b: [3, 4] };
    const b = { a: 1, b: [3, 4] };
    expect(deepEqual(a, b)).toBe(true);
  });

  it('should return false if two complex objects contains inequal arrays', () => {
    const a = { a: 1, b: [3, 4] };
    const b = { a: 1, b: [3, 4, 5] };
    expect(deepEqual(a, b)).toBe(false);
  });

  it('should return false when the first complex child is equal but the second not', () => {
    const a = { a: { x: 1 }, b: { x: 1 } };
    const b = { a: { x: 1 }, b: { x: 2 } };
    expect(deepEqual(a, b)).toBe(false);
  });

});