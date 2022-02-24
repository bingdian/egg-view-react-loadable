# egg-view-react-loadable

[![NPM version][npm-image]][npm-url]
[![Continuous Integration][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-view-react-loadable.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-view-react-loadable
[ci-image]: https://github.com/bingdian/egg-view-react-loadable/workflows/CI/badge.svg?branch=master&event=push
[ci-url]: https://github.com/bingdian/egg-view-react-loadable/actions?query=branch%3Amaster
[codecov-image]: https://img.shields.io/codecov/c/github/bingdian/egg-view-react-loadable.svg?style=flat-square
[codecov-url]: https://codecov.io/github/bingdian/egg-view-react-loadable?branch=master
[david-image]: https://img.shields.io/david/bingdian/egg-view-react-loadable.svg?style=flat-square
[david-url]: https://david-dm.org/bingdian/egg-view-react-loadable
[snyk-image]: https://snyk.io/test/npm/egg-view-react-loadable/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-view-react-loadable
[download-image]: https://img.shields.io/npm/dm/egg-view-react-loadable.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-view-react-loadable

React loadable SSR view plugin for egg

## Features

- Code splitting
- Server Side Rendering
- Full dynamic import

see [https://loadable-components.com/](https://loadable-components.com/) for more detail.

## Example

[egg-react-ssr-app-example](https://github.com/bingdian/egg-react-ssr-app-example)

## Install

```bash
$ npm i egg-view-react-loadable --save
$ npm i egg-view-nunjucks --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

exports.reactLoadable = {
  enable: true,
  package: 'egg-view-react-loadable',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.view = {
  root: [
    path.join(app.baseDir, 'app/view'),
    path.join(app.baseDir, 'app/public/ssr'),
  ].join(','),
  mapping: {
    '.html': 'nunjucks',
    '.js': 'reactLoadable',
  },
};

exports.reactLoadable = {
  nodeStatsFile: path.join(app.baseDir, 'app/public/ssr/loadable-stats.json'),
  webStatsFile: path.join(app.baseDir, 'app/public/csr/loadable-stats.json'),
  template: {
    // template config for `ctx.renderSSR`
    renderSSR: {
      renderSSRTemplate: path.join(app.baseDir, 'app/view/renderSSRLayout.html'),
      viewEngine: 'nunjucks',
    },
    
    // template config for `ctx.renderToStream`
    renderToStream: {
      renderToStreamStartTemplate: path.join(app.baseDir, 'app/view/renderToStreamStartTemplate.html'),
      renderToStreamEndTemplate: path.join(app.baseDir, 'app/view/renderToStreamEndTemplate.html'),
      viewEngine: 'nunjucks',
    },
  },
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Template

### template for `ctx.renderSSR`

```html
<!--  {app_root}/app/view/renderSSRLayout.html -->
<!doctype html>
<head>
    <meta charSet="utf-8"/>
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
    <title>{{title}}</title>
    ${styleTags}
</head>
<body>
    <div id="app">${content}</div>
    ${initStateContent}
    ${scriptTags}
</body>
</html>
```

### template for `ctx.renderToStream`

```html
<!--  {app_root}/app/view/renderToStreamStartTemplate.html -->
<!doctype html>
<head>
  <meta charSet="utf-8"/>
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
  <title>{{title}}</title>
</head>
<body>
<div id="app">
```

```html
<!--  {app_root}/app/view/renderToStreamEndTemplate.html -->
  </div>
  ${initStateContent}
  ${scriptTags}
</body>
</html>
```

## Render

### `ctx.renderSSR`

```js
// controller/home.js
module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      const { url, path } = ctx;

      await ctx.renderSSR({
        url,
        path,
      });
    }
  };
};
```

### `ctx.renderToStream`

```js
// controller/home.js
module.exports = app => {
  return class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      const { url, path } = ctx;

      await ctx.renderToStream({
        url,
        path,
      });
    }
  };
};
```

## Questions & Suggestions

Please open an issue [here](https://github.com/bingdian/egg-view-react-loadable/issues).

## License

[MIT](LICENSE)
