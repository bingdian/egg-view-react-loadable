import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  StaticRouter,
  Switch,
} from 'react-router-dom';
import routes from './routes';
import BaseComponent from './component/BaseComponent';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {
            routes.map(route => (
              <Route
                exact
                strict
                key={route.path}
                path={route.path}
                name={route.name}
                render={
                  ({ match }) => (
                    <BaseComponent
                      component={route.component}
                      match={match}
                      name={route.name}
                      data={this.props.data}
                    />
                  )
                }
              />
            ))
          }
        </Switch>
      </Router>
    );
  }
}

const clientRender = () => {
  const initState = window.__INITIAL_STATE__ || {};
  ReactDOM.render(<App data={initState} />, document.getElementById('app'));
};

const serverRender = () => {
  return context => {
    const { url }   = context;
    const initState = {};

    Object.entries(context).forEach(item => {
      const key        = item[0];
      initState[key] = item[1];
    });

    return (
      <StaticRouter location={url} context={{}}>
        <Switch>
          {
            routes.map(route => (
              <Route
                exact
                strict
                key={route.path}
                path={route.path}
                name={route.name}
                render={
                  ({ match }) => (
                    <BaseComponent
                      component={route.component}
                      match={match}
                      name={route.name}
                      data={initState}
                    />
                  )
                }
              />
            ))
          }
        </Switch>
      </StaticRouter>
    );
  };
};

export default IS_NODE_ENV ? serverRender() : clientRender();
