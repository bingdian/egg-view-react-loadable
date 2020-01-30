'use strict';

module.exports = app => {
  class RenderController extends app.Controller {
    async render() {
      const { ctx } = this;
      const { url, path } = ctx.request;

      ctx.user = {
        username: 'bingdian',
      };

      await ctx.render('main.js', {
        user: ctx.user,
        url,
        path,
      });
    }
  }

  return RenderController;
};
