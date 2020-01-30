'use strict';

const mock = require('egg-mock');

describe('test/view-react-loadable-ssr.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/view-react-loadable-ssr-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect(/window\.__INITIAL_STATE__/)
      .expect(/csrf/)
      .expect(200);
  });

  it('should GET /about', () => {
    return app.httpRequest()
      .get('/about')
      .expect(/window\.__INITIAL_STATE__/)
      .expect(/csrf/)
      .expect(200);
  });
});