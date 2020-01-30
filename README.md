# egg-view-react-loadable

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-view-react-loadable.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-view-react-loadable
[travis-image]: https://img.shields.io/travis/bingdian/egg-view-react-loadable.svg?style=flat-square
[travis-url]: https://travis-ci.org/bingdian/egg-view-react-loadable
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
    path.join(app.baseDir, 'app/ssr'),
  ].join(','),
  mapping: {
    '.html': 'nunjucks',
    '.js': 'reactLoadable',
  },
};

exports.reactLoadable = {
  statsFile: path.join(app.baseDir, 'app/ssr/loadable-stats.json'),
  layout: {
    path: path.join(app.baseDir, 'app/view/layout.html'),
    viewEngine: 'nunjucks',
  },
};
```

```html
<!--  {app_root}/view/layout.html -->
<!doctype html>
<head>
    <meta charSet="utf-8"/>
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"/>
    <title>example</title>
    ${styleTags}
</head>
<body>
    <div id="app">${content}</div>
    ${initStateContent}
    ${scriptTags}
</body>
</html>
```

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/bingdian/egg-view-react-loadable/issues).

## License

[MIT](LICENSE)
