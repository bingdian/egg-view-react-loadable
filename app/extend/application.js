'use strict';

const Engine = require('../lib/engine');
const REACT_LOADABLE_ENGINE = Symbol('Application#react-loadable-engine');

module.exports = {
  get reactLoadable() {
    if (!this[ REACT_LOADABLE_ENGINE ]) {
      this[ REACT_LOADABLE_ENGINE ] = new Engine(this);
    }
    return this[ REACT_LOADABLE_ENGINE ];
  },
};
