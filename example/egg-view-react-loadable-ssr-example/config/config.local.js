/**
 * 本地开发环境配置
 */

'use strict';

const path = require('path');
const ip = require('ip');

module.exports = app => {
  const exports = {};

  // 本地开发静态资源服务，生产环境使用 cdn
  exports.static = {
    prefix: '/assets/',
    dir: path.join(app.baseDir, 'client/dist/csr'),
  };

  exports.development = {
    watchDirs: [ 'client/' ],
  };

  const localIP = ip.address();
  const domainWhiteList = [];
  [ 9000, 9001, 9002 ].forEach(port => {
    domainWhiteList.push(`http://localhost:${port}`);
    domainWhiteList.push(`http://127.0.0.1:${port}`);
    domainWhiteList.push(`http://${localIP}:${port}`);
  });

  exports.security = { domainWhiteList };

  return exports;
};
