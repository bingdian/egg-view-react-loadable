'use strict';

module.exports = class View {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
  }

  render(name, locals, options = {}) {
    const { ctx } = this;
    locals = Object.assign({}, locals);

    try {
      return this.app.reactLoadable.render(ctx, name, locals);
    } catch (err) {
      this.app.logger.error('[%s] server render error', name, err);
      throw err;
    }
  }

  /* eslint no-unused-vars:off */
  /* istanbul ignore next */
  renderString(tpl, locals) {
    return Promise.reject(new Error('not implemented yet!'));
  }
};
