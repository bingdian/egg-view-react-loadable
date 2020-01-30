import React, { Component } from 'react';

class BaseComponent extends Component {
  render() {
    const { data, match, component } = this.props;
    const Page                       = component;

    return (
      <React.Fragment>
        <Page data={data} match={match} />
      </React.Fragment>
    );
  }
}

export default BaseComponent;
