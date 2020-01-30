'use strict';

const path = require('path');

module.exports = app => {
  const exports = {};

  exports.keys = '123456';

  exports.view = {
    root: [
      path.join(app.baseDir, 'app/view'),
      path.join(app.baseDir, 'app/ssr'),
    ].join(','),
    mapping: {
      '.html': 'nunjucks',
      '.js': 'reactLoadable',
    },
  };

  exports.reactLoadable = {
    statsFile: path.join(app.baseDir, 'app/ssr/loadable-stats.json'),
    layout: {
      path: path.join(app.baseDir, 'app/view/layout.html'),
    },
  };

  return exports;
};
