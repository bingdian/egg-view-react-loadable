'use strict';

module.exports = app => {
  class RenderController extends app.Controller {
    async render() {
      const { ctx }       = this;
      const { url, path } = ctx.request;

      await ctx.renderSSR({
        url,
        path,
      });
    }
  }

  return RenderController;
};
