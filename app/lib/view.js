'use strict';

module.exports = class View {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
  }

  render(name, locals = {}, options = {}) {
    locals = Object.assign({}, locals);
    return this.ctx.renderSSR(locals, options);
  }

  /* istanbul ignore next */
  renderString() {
    return Promise.reject(new Error('not implemented yet!'));
  }
};
