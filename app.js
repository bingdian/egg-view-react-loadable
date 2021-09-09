'use strict';

const assert = require('assert');

module.exports = app => {
  const config = app.config.reactLoadable;
  const { template = {} } = config;

  assert(template, 'config.reactLoadable.template required');

  app.view.use('reactLoadable', require('./app/lib/view'));
};
