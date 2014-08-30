'use strict';
var Reflux = require('reflux');
var is = require('is-type');
var _ = require('reflux/src/utils');

exports = module.exports = Dispatcher;
exports.Reflux = Reflux;

function Dispatcher(options) {
  if (!(this instanceof Dispatcher)) return new Dispatcher(options);

  options = options || {};
  var defaultDataForStores = {};
  if (options.data) {
    for (var k in options.data) {
      if (options.data.hasOwnProperty(k)) {
        setDefaultData(k, options.data[k]);
      }
    }
  }
  function setDefaultData(storeName, data) {
    if (is.array(data)) {
      defaultDataForStores[storeName] = data;
    } else {
      defaultDataForStores[storeName] = [data];
    }
  }

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
    definition = definition || {};

    var defaultDataFunc;
    if ('getDefaultData' in definition) {
      if (is.function(definition.getDefaultData)) {
        defaultDataFunc = definition.getDefaultData;
        delete definition.getDefaultData;
      }
    }

    var store = stores[storeName] = {
      storeName: storeName
    }
    if (!definition) return store;
    var _init = definition.init;
    _.extend(definition, {
      init: function () {
        if (defaultDataFunc && !defaultDataForStores[storeName]) {
          setDefaultData(storeName, defaultDataFunc.call(this));
        }
        if (is.function(_init)) {
          _init.call(this);
        }
      },
      getDefaultData: function () {
        return defaultDataForStores[storeName];
      }
    });

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

    // monkey patch trigger method to save data
    var _trigger = store.trigger;
    store.trigger = function () {
      defaultDataForStores[storeName] = Array.prototype.slice.call(arguments);
      _trigger.apply(this, arguments);
    }

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
