'use strict';

const path = require('path');

module.exports = app => {
  const exports = {};

  exports.keys = ')T|PR6)#8}6}z8~:1"nAIEz_w+dz]IkH:1e?a4Q?h]LL?L=iV|5S5seGBC/MRDc';

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
