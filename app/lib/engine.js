'use strict';

const fs = require('fs');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { ChunkExtractor, ChunkExtractorManager } = require('@loadable/server');
const REACT_LOADABLE_TEMPLATE = Symbol('view#react-loadable-component-template');

module.exports = class Engine {
  constructor(app) {
    this.app = app;
    this.config = app.config.reactLoadable;
  }

  get template() {
    if (!this[ REACT_LOADABLE_TEMPLATE ]) {
      const layout = this.config.layout;
      const layoutFile = layout && layout.path;
      const content = fs.readFileSync(layoutFile, 'utf8');
      this[ REACT_LOADABLE_TEMPLATE ] = `\`${content}\``;
    }
    return this[ REACT_LOADABLE_TEMPLATE ];
  }

  async getViewTemplate(ctx) {
    const layout = this.config.layout;
    const viewEngine = layout && layout.viewEngine;
    const template = this.template;

    if (viewEngine) {
      return await ctx.renderString(template, {}, { viewEngine });
    }
    return template;
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
  async render(ctx, name, locals, options = {}) {
    const statsFile = this.config.statsFile;
    const extractor = new ChunkExtractor({ statsFile });
    const App = this.normalizeReactElement(extractor.requireEntrypoint());
    const jsx = React.createElement(ChunkExtractorManager, {
      extractor,
    }, React.createElement(App, locals));
    const content = renderToString(jsx);
    const scriptTags = extractor.getScriptTags();
    const linkTags = extractor.getLinkTags();
    const styleTags = extractor.getStyleTags();
    const initStateContent = this.getInitStateContent(ctx, locals);
    const template = await this.getViewTemplate(ctx);

    /* eslint no-eval:off */
    return eval(template);
  }
};
