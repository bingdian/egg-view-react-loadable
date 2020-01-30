'use strict';

const merge = require('webpack-merge');
const nodeCommonConfig = require('./webpack.common')(true);
const browserCommonConfig = require('./webpack.common')(false);

module.exports = () => {
  const config = {
    mode: 'development',
    devtool: 'source-map',
  };

  const devServerConfig = {
    devServer: {
      writeToDisk: true,
      headers: { // 允许 hmr 跨域
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      },
      compress: true,
      historyApiFallback: true,
      port: 9000,
      hot: true,
      overlay: {
        warnings: false,
        errors: true,
      },
      allowedHosts: [
        'localhost',
        '127.0.0.1',
      ],
    },
  };

  return [
    merge(browserCommonConfig, config, devServerConfig),
    merge(nodeCommonConfig, config),
  ];
};
