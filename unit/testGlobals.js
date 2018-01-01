const deepEqual = require('./deepEqual');
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

function diff(a, b) {
  let strDiff = '';
  let strA = a.toString();
  let strB = b.toString();
  for (var i in strA) {
    if (strA[i] === strB[i]) {
      strDiff += colors.fgGreen + strA[i] + colors.reset;
    } else {
      strDiff += colors.fgRed + strA[i] + colors.reset;
    }
  }
  return strDiff;
}

function expect(value) {
  const matchers = {
    toBe: function(expectation) {
      if (value !== expectation) {
        throw new Error(`${colors.bright}Expected${colors.reset}\n"${value + colors.bright}"\nto be\n"${colors.reset + expectation}".\nDiff: ${diff(expectation, value)}`);
      }
    },
    toContain: function(expectation) {
      if (value.indexOf(expectation) === -1) {
        throw new Error(`${colors.bright}Expected${colors.reset}\n"${value}"\n${colors.bright}to contain${colors.reset}\n"${expectation}"`);
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
          throw new Error(`Expected object "${JSON.stringify(value)}" to equal "${JSON.stringify(expectation)}", but length is different.`);
        }
        for (var i in value) {
          if (expectation[i] !== value[i]) {
            throw new Error(`Expected object "${JSON.stringify(value)}" to equal "${JSON.stringify(expectation)}". ` +
              `Got { ${i}: ${JSON.stringify(value[i])} } but ` +
              `expected { ${i}: ${JSON.stringify(expectation[i])} }`);
          }
        }
      } else if (value != expectation) {
        throw new Error(`Expected value "${value}" to equal "${expectation}"`);
      }
    },
    toDeepEqual: function(expectation) {
      if (!deepEqual(expectation, value)) {
        throw new Error(`${colors.bright}Expected value${colors.reset}\n"${JSON.stringify(value)}\n${colors.bright}to deep equal${colors.reset}\n"${JSON.stringify(expectation)}"`);
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
