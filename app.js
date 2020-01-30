'use strict';

const assert = require('assert');

module.exports = app => {

  const config = app.config.reactLoadable;
  const { layout = {} } = config;
  const templatePath = layout && layout.path;

  assert(templatePath, 'config.reactLoadable.layout.path required');

  app.view.use('reactLoadable', require('./app/lib/view'));
};
