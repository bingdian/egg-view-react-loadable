'use strict';

const merge = require('webpack-merge');
const nodeCommonConfig = require('./webpack.common')(true);
const browserCommonConfig = require('./webpack.common')(false);

module.exports = () => {
  const config = {
    mode: 'production',
  };

  return [
    merge(browserCommonConfig, config),
    merge(nodeCommonConfig, config),
  ];
};
