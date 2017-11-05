function TestRecorder(reporter = noopReporter()) {
  const runningTests = new Set();
  const failedTests = new Map();
  let testSuitePromises = [];
  let currentSuiteName = null;
  let testCount = 0;

  return {
    startSuite: function(suiteName) {
      reporter.reportSuite(suiteName);
      currentSuiteName = suiteName;
      testSuitePromises = [];
    },
    startTest: function(testDescription) {
      runningTests.add(testDescription);
      testCount++;
      reporter.reportTest(currentSuiteName, testDescription);
    },
    testPass: function(testDescription) {
      runningTests.delete(testDescription);
      reporter.reportPass(currentSuiteName, testDescription);
    },
    testFail: function(testDescription, err) {
      failedTests.set(testDescription, err);
      reporter.reportFail(currentSuiteName, testDescription, err);
    },
    getTestCount: function() {
      return testCount;
    },
    hasStillRunning: function() {
      return runningTests.size > 0;
    },
    getStillRunning: function() {
      return runningTests;
    },
    getFailed: function() {
      return failedTests;
    },
    hasFailed: function() {
      return failedTests.size > 0;
    },
    pushTestPromise: function(promise) {
      testSuitePromises.push(promise);
    },
    waitForTestSuitePromises: function() {
      return Promise.all(testSuitePromises);
    },
  }
};

function noopReporter() {
  const noop = () => {};
  return {
    reportSuite: noop,
    reportTest: noop,
    reportPass: noop,
    reportFail: noop
  }
}

module.exports = TestRecorder;
