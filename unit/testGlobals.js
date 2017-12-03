const colors = require('./colors');
const strCheck = `${colors.fgGreen}✓${colors.reset}`;
const strCross = `${colors.fgRed}✖${colors.reset}`;
let beforeEachFn = null;

function describe(suiteName, suiteFunction, testRecorder, options = {}) {
  testRecorder.startSuite(suiteName);
  // Reset any previous beforeEach handlers from previous suites
  beforeEachFn = () => {};
  suiteFunction();
}

function it(testDescription, testFunction, testRecorder, options = {}) {
  testRecorder.startTest(testDescription);
  try {
    beforeEachFn();
    let returnValue = testFunction();
    if (returnValue instanceof Promise) {
      const testPromise = returnValue.then(reportSuccess).catch(reportError);
      testRecorder.pushTestPromise(testPromise);
    } else {
      reportSuccess();
    }
  } catch (err) {
    reportError(err);
  }
  function reportSuccess() {
    testRecorder.testPass(testDescription);
  }
  function reportError(err) {
    testRecorder.testFail(testDescription, err);
  }
}

function beforeEach(fn) {
  beforeEachFn = fn;
}

function expect(value) {
  const matchers = {
    toBe: function(expectation) {
      if (value !== expectation) {
        throw new Error(`Expected "${value}" to be "${expectation}"`);
      }
    },
    toShallowEqual: function(expectation) {
      if (!value) {
        throw new Error(`Expected "${value}" to equal "${expectation}"`);
      }
      if (Array.isArray(expectation)) {
        if (value.toString() !== expectation.toString()) {
          throw new Error(`Expected array "${value}" to equal "${expectation}"`);
        }
      } else if (typeof(value) === 'object') {
        if (value.length !== expectation.length) {
          throw new Error(`Expected "${JSON.stringify(value)}" to equal "${JSON.stringify(expectation)}". Length is different.`);
        }
        for (var i in value) {
          if (expectation[i] !== value[i]) {
            throw new Error(`Expected "${JSON.stringify(value)}" to equal "${JSON.stringify(expectation)}".`);
          }
        }
      } else if (value != expectation) {
        throw new Error(`Expected "${value}" to equal "${expectation}"`);
      }
    }
  }
  return matchers;
}

function withRecorder(testRecorder) {
  return {
    describe: (suiteName, suiteFunction) => describe(suiteName, suiteFunction, testRecorder),
    it: (testDescription, testFunction) => it(testDescription, testFunction, testRecorder),
    beforeEach,
    expect
  }
}

module.exports = {
  describe,
  it,
  beforeEach,
  expect,
  withRecorder
};
