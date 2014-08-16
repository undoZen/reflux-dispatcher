'use strict';
var Reflux = require('reflux');

module.exports = Dispatcher;

function Dispatcher() {
  if (!(this instanceof Dispatcher)) return new Dispatcher;
  var actions = {};
  this.actions = this.action = getAction;
  function getAction(actionName) { //get monkey patched action
    if (actions[actionName]) return actions[actionName];
    var action = actions[actionName] = Reflux.createAction();
    var _listen = action.listen;
    // monkey patch listen method
    action.listen = function(callback, bindContext) {
      var unsubscribe = _listen.apply(action, arguments);
      var storeName = bindContext && bindContext.__name_for_dispatcher;
      if (storeName) {
        stores[storeName].unsubscribeHandlers.push(unsubscribe);
      }
      return unsubscribe;
    };
    return action;
  }

  var stores = {};
  this.stores = this.store = getStore;
  function getStore(storeName) { //get proxied store
    if (stores[storeName]) return stores[storeName];
    var proxiedStore = {
      store: null, //actual store
      unsubscribeHandlers: [],
      define: function (definition) {
        definition.__name_for_dispatcher = storeName
        if (this.store) { //defined before, should clean up
          this.unsubscribeHandlers.forEach(function (unsubscribe) {
            unsubscribe();
          });
        }
        this.store = Reflux.createStore(definition);
        return this.store;
      }
    };
    proxiedStore.name = storeName;
    stores[storeName] = proxiedStore;
    return stores[storeName];
  }
}
