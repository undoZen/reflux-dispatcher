'use strict';
var Reflux = require('reflux');
var _ = require('reflux/src/utils');

module.exports = Dispatcher;

function Dispatcher() {
  if (!(this instanceof Dispatcher)) return new Dispatcher;
  var actions = {};
  this.actions = this.action = getAction;
  var storeUnsubscribes = {};
  function getAction(actionName) { //get monkey patched action
    if (actions[actionName]) return actions[actionName];
    var action = actions[actionName] = Reflux.createAction();
    var _listen = action.listen;
    // monkey patch listen method
    action.listen = function(callback, bindContext) {
      var unsubscribe = _listen.apply(action, arguments);
      var storeName = bindContext && bindContext.storeName;
      if (storeName) {
        (storeUnsubscribes[storeName] || (storeUnsubscribes[storeName] = [])).push(unsubscribe);
      }
      return unsubscribe;
    };
    return action;
  }

  var stores = {};
  this.stores = this.store = getOrSetStore;
  function getOrSetStore(storeName, definition) {
    var store = stores[storeName];
    if (store && !definition) return store;

    var store = stores[storeName] = {
      storeName: storeName,
      listen: function () { },
      listenTo: function () { },
      trigger: function () { }
    }
    if (!definition) return store;
    var unsubscribe;
    while( (unsubscribe = (storeUnsubscribes[storeName] || []).shift()) ){
      console.log(unsubscribe.toString());
      unsubscribe();
    }
    store = stores[storeName] = Reflux.createStore(_.extend(store, definition));
    console.log(store);
    return store;
  }
}
