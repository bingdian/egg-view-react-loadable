'use strict';

const fs = require('fs');
const React = require('react');
const assert = require('assert');
const { renderToString, renderToNodeStream } = require('react-dom/server');
const { ChunkExtractor } = require('@loadable/server');
const REACT_LOADABLE_SSR_RENDER_TEMPLATE = Symbol('view#react-loadable-ssr-render-template');
const REACT_LOADABLE_STREAM_RENDER_TEMPLATE = Symbol('view#react-loadable-stream-render-template');

module.exports = class Engine {
  constructor(app) {
    this.app = app;
    this.config = app.config.reactLoadable;
  }

  get SSRRenderTemplateString() {
    if (!this[ REACT_LOADABLE_SSR_RENDER_TEMPLATE ]) {
      const { template = {} } = this.config;
      const { renderSSR = {} } = template;
      const { renderSSRTemplate } = renderSSR;

      assert(renderSSRTemplate, 'config.template.renderSSR.renderSSRTemplate required');

      const content = fs.readFileSync(renderSSRTemplate, 'utf8');
      this[ REACT_LOADABLE_SSR_RENDER_TEMPLATE ] = `\`${content}\``;
    }
    return this[ REACT_LOADABLE_SSR_RENDER_TEMPLATE ];
  }

  async renderSSRTemplate(ctx) {
    const { template = {} } = this.config;
    const { renderSSR = {} } = template;
    const { viewEngine } = renderSSR;
    const SSRRenderTemplateString = this.SSRRenderTemplateString;

    if (viewEngine) {
      return await ctx.renderString(SSRRenderTemplateString, {}, { viewEngine });
    }
    return SSRRenderTemplateString;
  }

  get streamRenderTemplateString() {
    if (!this[ REACT_LOADABLE_STREAM_RENDER_TEMPLATE ]) {
      const { template = {} } = this.config;
      const { renderToStream = {} } = template;
      const { renderToStreamStartTemplate, renderToStreamEndTemplate } = renderToStream;

      assert(renderToStreamStartTemplate, 'config.template.renderToStream.renderToStreamStartTemplate required');
      assert(renderToStreamEndTemplate, 'config.template.renderToStream.renderToStreamEndTemplate required');

      const renderToStreamStart = fs.readFileSync(renderToStreamStartTemplate, 'utf8');
      const renderToStreamEnd = fs.readFileSync(renderToStreamEndTemplate, 'utf8');
      this[ REACT_LOADABLE_STREAM_RENDER_TEMPLATE ] = {
        renderToStreamStart: `\`${renderToStreamStart}\``,
        renderToStreamEnd: `\`${renderToStreamEnd}\``,
      };
    }
    return this[ REACT_LOADABLE_STREAM_RENDER_TEMPLATE ];
  }

  async getRenderStreamTemplate(ctx) {
    const { template = {} } = this.config;
    const { renderToStream = {} } = template;
    const { viewEngine } = renderToStream;
    const streamRenderTemplateString = this.streamRenderTemplateString;
    const { renderToStreamStart, renderToStreamEnd } = streamRenderTemplateString;

    if (viewEngine) {
      return await Promise.all([
        ctx.renderString(renderToStreamStart, {}, { viewEngine }),
        ctx.renderString(renderToStreamEnd, {}, { viewEngine }),
      ]);
    }

    return [
      renderToStreamStart,
      renderToStreamEnd,
    ];
  }

  getInitStateContent(ctx, locals) {
    const security = this.app.config.security;
    let initState = {};

    // csrf token
    if (security.csrf && security.csrf.enable) {
      initState = Object.assign({}, initState, {
        csrf: ctx && ctx.csrf,
      });
    }

    // 处理 locals 数据
    Object.keys(locals)
      .forEach(key => {
        if (key !== 'ctx' && key !== 'request' && key !== 'response' && key !== 'helper') {
          initState[ key ] = locals[ key ];
        }
      });
    return `<script>window.__INITIAL_STATE__= ${JSON.stringify(initState)}</script>`;
  }

  normalizeReactElement(reactElement) {
    return reactElement && reactElement.default ? reactElement.default : reactElement;
  }

  /* eslint no-unused-vars:off */
  async render(ctx, locals, options = {}) {
    const nodeStatsFile = this.config.nodeStatsFile;
    const webStatsFile = this.config.webStatsFile;
    const nodeExtractor = new ChunkExtractor({ statsFile: nodeStatsFile });
    const webExtractor = new ChunkExtractor({ statsFile: webStatsFile });
    const App = this.normalizeReactElement(nodeExtractor.requireEntrypoint());
    const jsx = webExtractor.collectChunks(React.createElement(App, locals));
    const content = renderToString(jsx);
    const scriptTags = webExtractor.getScriptTags();
    const linkTags = webExtractor.getLinkTags();
    const styleTags = webExtractor.getStyleTags();
    const initStateContent = this.getInitStateContent(ctx, locals);
    const template = await this.renderSSRTemplate(ctx);

    /* eslint no-eval:off */
    return eval(template);
  }

  async renderSSR(ctx, locals, options = {}) {
    locals = Object.assign({}, locals);

    try {
      return await this.render(ctx, locals, options);
    } catch (err) {
      this.app.logger.error('[%s] server render error', err);
      throw err;
    }
  }

  async renderToStream(ctx, locals, options = {}, content = '') {
    const { res } = ctx;
    const nodeStatsFile = this.config.nodeStatsFile;
    const webStatsFile = this.config.webStatsFile;
    const nodeExtractor = new ChunkExtractor({ statsFile: nodeStatsFile });
    const webExtractor = new ChunkExtractor({ statsFile: webStatsFile });
    const App = this.normalizeReactElement(nodeExtractor.requireEntrypoint());
    const jsx = webExtractor.collectChunks(React.createElement(App, locals));
    const template = await this.getRenderStreamTemplate(ctx);
    const [ renderToStreamStart, renderToStreamEnd ] = template;
    const scriptTags = webExtractor.getScriptTags();
    const linkTags = webExtractor.getLinkTags();
    const styleTags = webExtractor.getStyleTags();
    const initStateContent = this.getInitStateContent(ctx, locals);
    const stream = renderToNodeStream(jsx);

    // https://github.com/onvno/pokerface/issues/41
    // @see https://koajs.com/
    // To bypass Koa's built-in response handling, you may explicitly set ctx.respond = false;. Use this if you want to write to the raw res object instead of letting Koa handle the response for you.
    ctx.respond = false;

    res.write(eval(renderToStreamStart));

    stream.pipe(res, { end: false });
    stream.on('end', () => {
      res.end(eval(renderToStreamEnd));
    });
  }
};
