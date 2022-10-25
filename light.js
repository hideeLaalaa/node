const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;


(async () => {
  time = Date.now();
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
  const runnerResult = await lighthouse('https://bequestmutual.com', options);

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync('lhreport.html', reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
//   console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
//   console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
  time2 = Date.now();
  
  
  await chrome.kill();
  app.get('/:name', (req, res) => {
    const name = req.params.name;
    html = `
    <div>Performance score was ${runnerResult.lhr.categories.performance.score * 100}</div>
    <div> Time Taken ${(time2-time)/1000}s </div>
    ${reportHtml}
    `;
    res.send(`${html}`);
  });
  app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
})();