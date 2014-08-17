'use strict';
var Reflux = require('reflux');
var _ = require('reflux/src/utils');

module.exports = Dispatcher;

function Dispatcher() {
  if (!(this instanceof Dispatcher)) return new Dispatcher;

  var actions = {};
  this.actions = this.action = getAction;

  // unsubscribe handlers for hot reload
  // the actions or stores a store listened to will be all cleaned
  // before it's been replaced with new definition
  var storeUnsubscribes = {};

  // record which stores have been listened to this store
  // then after redefined, new version of this store should
  // keep sending events to these stores
  var storeListeners = {};

  function getAction(actionName) {
    if (actions[actionName]) return actions[actionName];
    var action = actions[actionName] = Reflux.createAction();
    // monkey patch listen method
    var _listen = action.listen;
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
      storeName: storeName
    }
    if (!definition) return store;

    var unsubscribe;
    while( (unsubscribe = (storeUnsubscribes[storeName] || []).shift()) ){
      unsubscribe();
    }

    store = stores[storeName] = Reflux.createStore(_.extend(store, definition));

    // monkey patch listen method
    var _listen = store.listen;
    store.listen = function(callback, bindContext) {
      var unsubscribe = _listen.apply(store, arguments);
      var listenerStoreName = bindContext && bindContext.storeName;
      if (listenerStoreName) {
        (storeUnsubscribes[listenerStoreName] || (storeUnsubscribes[listenerStoreName] = [])).push(unsubscribe);
        (storeListeners[storeName] || (storeListeners[storeName] = [])).push({
          unsubscribe: unsubscribe,
          callback: callback,
          storeListenedTo: store,
          listenerStore: bindContext
        });
      }
      return unsubscribe;
    };

    var listenerInfo;
    var _listeners = storeListeners[storeName] || [];
    storeListeners[storeName] = [];
    while( (listenerInfo = _listeners.shift()) ){
      listenerInfo.unsubscribe();
      listenerInfo.listenerStore.registered.splice(
        listenerInfo.listenerStore.registered.indexOf(listenerInfo.storeListenedTo),
        1
      );

      listenerInfo.listenerStore.listenTo(store, listenerInfo.callback);
    }
    return store;
  }
}
