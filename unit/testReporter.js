const colors = require('./colors');
const strCheck = `${colors.fgGreen}✓${colors.reset}`;
const strCross = `${colors.fgRed}✖${colors.reset}`;

function testReporter() {
  return {
    reportSuite(suiteName) {
      console.log(`→ ${suiteName}`)
    },
    reportTest(suiteName, testDescription) {
    },
    reportPass(suiteName, testDescription) {
      console.log(`\t${strCheck} ${testDescription}`);
    },
    reportFail(suiteName, testDescription, err) {
      console.log(`\t${strCross} ${testDescription}\n\t${colors.bright}${err}${colors.reset}`);
    }
  }  
}

module.exports = testReporter();
