'use strict';
var uid = 0;
module.exports = function (stores, callback) {
  var store = this.store;
  var ready = this.ready;
  var loading = this.loading;
  return store('__all_stores_ready_'+(uid++), {
    init: function () {
      var self = this;
      this.readyState = [];
      for (var i = 0; i < stores.length; i++) this.readyState.push(false);
      this.changed();
      stores.forEach(function (storeName, i) {
        self.listenTo(store(storeName), function (data) {
          if (data === ready || data === loading) {
            self.readyState[i] = data === ready;
            self.changed();
          }
        });
      });
    },
    changed: function () {
      this.trigger(this.readyState);
      if (this.readyState.every(function (r) { return r; })) {
        this.trigger(ready);
        if ('function' === typeof callback) {
          callback();
        }
      } else {
        this.trigger(loading);
      }
    }
  });
}
