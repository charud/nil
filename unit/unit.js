#!/usr/bin/env node
const findTestFiles = require('./findTestFiles');
const testGlobals = require('./testGlobals');
const testReporter = require('./testReporter');
const testRecorder = require('./testRecorder')(testReporter);
const workdir = process.cwd();

console.log('Unit Test runner');

const testGlobalsRecorded = testGlobals.withRecorder(testRecorder);
global.describe = testGlobalsRecorded.describe;
global.it = testGlobalsRecorded.it;
global.beforeEach = testGlobalsRecorded.beforeEach;
global.expect = testGlobalsRecorded.expect;

async function run() {
  const testFiles = await findTestFiles('.');
  console.log(`Found ${testFiles.length} testfiles.`);
  for (testFile of testFiles) {
    require(`${workdir}/${testFile}`);
    await testRecorder.waitForTestSuitePromises();
  }
  if (testRecorder.hasFailed()) {
    console.log('\nDone with errors');
    process.exit(1);
  }
  if (testRecorder.hasStillRunning()) {
    console.log('\nWarning: Some tests did not complete');
    process.exit(1);
  }
  console.log(`\nDone. ${testRecorder.getTestCount()} tests passed.`);
}

run()
  .catch(err => console.log('Error', err));