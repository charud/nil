A recreational hobby project, where I recreate common Javascript libraries and tooling
without using any dependencies.

- [x] unit: Test Runner
- [x] bundle: Code Bundler
- [ ] act: Library for client side views
- [ ] dux: Library for state management

## Install

To create a symlink for the `unit` executable
```
  $ npm link
```

## Test

If you have run `npm link`
```sh
  $ npm test
  or
  $ unit
```

Alternatively you can call the unit tester directly
```
  $ node unit/unit.js
```

## Bundle

Takes an entry-file and bundles all modules it requires into a single output-file.

### Example

```js
  // sum.js
  function sum(x, y) {
    return x + y;
  }
  module.exports = sum;
```

```js
  // app.js
  const sum = require('./sum.js');
  console.log('1 + 2 = ', sum(1, 2))
```

```sh
  $ bundle app.js bundle.js
  Bundle
  Bundling app.js into bundle.js
  Done
  $ node bundle.js
  Sum:  5
```

