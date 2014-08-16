'use strict';
var Reflux = require('reflux');

module.exports = Dispatcher;

function Dispatcher() {
  if (!(this instanceof Dispatcher)) return new Dispatcher;
  var actions = {};
  this.actions = this.action = getAction.bind(actions)
}

function getAction(actionName) {
  return this[actionName] || (this[actionName] = Reflux.createAction());
}
