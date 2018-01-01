A recreational hobby project, where I recreate common Javascript libraries and tooling
without using any dependencies.

- [x] unit: Test Runner
- [x] pack: Code Bundler
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

## Pack

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
  $ pack app.js bundle.js
  Pack
  Bundling app.js into bundle.js
  Done
  $ node bundle.js
  Sum:  5
```

# Sample App

Build the sample app like this:
```sh
  $ pack sampleApp/app.js sampleApp/bundle.js
```

And then run it using any web server, for example:
```sh
  $ cd sampleApp
  $ python -m SimpleHTTPServer
  Serving HTTP on 0.0.0.0 port 8000 ...
```