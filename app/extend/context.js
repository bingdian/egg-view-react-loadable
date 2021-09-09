'use strict';

module.exports = {
  /**
   * render SSR
   * @param {Object} locals
   * @param {Object} options
   * @return {Promise<void>}
   */
  async renderSSR(locals, options) {
    this.body = await this.app.reactLoadable.renderSSR(this, locals, options);
  },

  /**
   * renderToStream
   * @param {Object} locals
   * @param {Object} options
   * @return {Promise<*>}
   */
  async renderToStream(locals, options) {
    await this.app.reactLoadable.renderToStream(this, locals, options);
  },
};
