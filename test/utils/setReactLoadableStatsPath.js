'use strict';

const fs = require('mz/fs');
const path = require('path');

function setReactLoadableStatsPath(type) {
  const loadableStatsFile = path.join(__dirname, `../fixtures/apps/view-react-loadable-ssr-test/app/public/${type}/loadable-stats.json`);
  const testDir = path.join(__dirname, '../');

  return fs.readFile(loadableStatsFile, 'utf-8')
    .then(result => {
      return result.replace(/\${testDir}/g, testDir);
    })
    .then(result => {
      return fs.writeFile(loadableStatsFile, result);
    })
    .catch(err => {
      throw err;
    });
}

module.exports = setReactLoadableStatsPath;
