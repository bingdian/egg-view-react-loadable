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
    nodeStatsFile: path.join(app.baseDir, 'app/public/ssr/loadable-stats.json'),
    webStatsFile: path.join(app.baseDir, 'app/public/csr/loadable-stats.json'),
    template: {
      renderSSR: {
        renderSSRTemplate: path.join(app.baseDir, 'app/view/renderSSRLayout.html'),
        viewEngine: 'nunjucks',
      },
    },
  };

  return exports;
};
