'use strict';
var Reflux = require('reflux');

module.exports = Dispatcher;

function Dispatcher() {
  if (!(this instanceof Dispatcher)) return new Dispatcher;
  var actions = {};
  this.actions = this.action = getAction.bind(actions)
  var stores = {};
  this.stores = this.store = getStore.bind(stores)
}

function getAction(actionName) {
  return this[actionName] || (this[actionName] = Reflux.createAction());
}

function getStore(storeName) {
  if (this[storeName]) return this[storeName];
  this[storeName] = {
    define: Reflux.createStore
  };
  return this[storeName];
}
