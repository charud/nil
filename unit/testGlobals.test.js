var testGlobals = require('./testGlobals');
// var recorder = require('./testRecorder')();
var recorder = MockRecorder();

describe('testGlobals', () => {
  // Not using beforeEeach in this test suite, since describe and it ends up
  // calling it themselves when being tested. Hard to isolate due to the global nature of them.
  // beforeEach(() => recorder.reset());

  it('records a new test suite when describe is called', () => {
    recorder.reset();
    testGlobals.describe('suite', () => {}, recorder);
    expect(recorder.getSuites()).toShallowEqual('suite');
  });

  it('calls the suite function when describe is called', () => {
    recorder.reset();
    let wasCalled = false;
    testGlobals.describe('suite', () => { wasCalled = true }, recorder);
    expect(wasCalled).toBe(true);
  });

  it('records a new test when it is called', () => {
    recorder.reset();
    testGlobals.it('test', () => {}, recorder);
    expect(recorder.getTests()).toShallowEqual('test');
  });

  it('records a pass for a test without any errors', () => {
    recorder.reset();
    testGlobals.it('passes', () => {}, recorder);
    expect(recorder.getPassedTest()).toShallowEqual('passes');
  });

  it('records a failed for a test with errors', () => {
    recorder.reset();
    testGlobals.it('fails', () => { expect(true).toBe(false) }, recorder);
    expect(recorder.getFailedTests()).toShallowEqual('fails');
  });
});

function MockRecorder() {
  let suites = [];
  let tests = [];
  let passedTests = [];
  let failedTests = [];
  return {
    startSuite: (suiteName) => suites.push(suiteName),
    startTest: (testDescription) => tests.push(testDescription),
    testPass: (testDescription) => passedTests.push(testDescription),
    testFail: (testDescription) => failedTests.push(testDescription),
    getSuites: () => suites,
    getTests: () => tests,
    getPassedTest: () => passedTests,
    getFailedTests: () => failedTests,
    reset: () => {
      suites = [];
      tests = [];
      passedTests = [];
      failedTests = [];
    }
  };
}
