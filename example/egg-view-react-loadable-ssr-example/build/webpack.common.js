'use strict';

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const _ = require('lodash');
const envConfig = require('./env.config');
const nodeExternals = require('webpack-node-externals');

const { NODE_ENV } = process.env;

const getAbsolutePath = relativePath => path.resolve(__dirname, relativePath);

module.exports = isNodeEnv => {
  const nodeEnvConfig = {
    target: 'node', // node 模式时不会将 node.js 内置模块打包进输出文件中，例如： fs net模块等
    externals: [ // node_modules 目录下的第三方模块不会打包进输出文件中
      '@loadable/component',
      nodeExternals({
        whitelist: [],
      }),
    ],
    output: {
      path: getAbsolutePath('../app/ssr'),
      libraryTarget: 'commonjs2', // 以 commonjs2 规范导出渲染函数，以使用 node.js 服务端使用
    },
    plugins: [],
  };

  const browserConfig = {
    target: 'web',
    output: {
      path: getAbsolutePath('../client/dist/csr'),
    },
  };

  const commonConfig = {
    context: path.resolve(__dirname, '../'),
    entry: {
      main: getAbsolutePath('../client/src/app.js'),
    },
    output: {
      hashDigestLength: 8,
      publicPath: '/assets/',
      // chunkFilename: '[name].[chunkhash].js',
      chunkFilename: '[name].js',
      filename: '[name].js',
      // chunkFilename: '[name].[chunkhash].js',
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin(Object.assign({}, envConfig, {
        IS_NODE_ENV: !!isNodeEnv,
      })),
      new MiniCssExtractPlugin({ // TODO
        filename: NODE_ENV === 'development' ? '[name].css' : '[name].[hash].css',
        chunkFilename: NODE_ENV === 'development' ? '[name].css' : '[name].[hash].css',
      }),
      new LoadablePlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(jsx|js)?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
              plugins: [
                'react-hot-loader/babel',
                '@loadable/babel-plugin',
                '@babel/transform-arrow-functions',
                '@babel/plugin-transform-runtime',
                '@babel/plugin-transform-object-assign',
              ],
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
  };

  return isNodeEnv ?
    _.merge({}, commonConfig, nodeEnvConfig) :
    _.merge({}, commonConfig, browserConfig);
};
