'use strict';
var test = require('tape');
var Dispatcher = require('../');

test('allStoresReady() method', function (t) {
  var dispatcher = new Dispatcher;
  var loading = Dispatcher.loading;
  console.log(loading);
  var store = dispatcher.store;
  t.plan(6);

  store('a', {
    init: function () {
      setTimeout(function () {
        this.trigger(loading);
        setTimeout(function () {
          this.trigger('hello');
        }.bind(this), 100);
      }.bind(this), 100);
    }
  });

  store('b', {
    init: function () {
      setTimeout(function () {
        this.trigger(loading);
        setTimeout(function () {
          this.trigger('world');
        }.bind(this), 100);
      }.bind(this), 100);
    }
  });

  t.equal(store('a').getDefaultData(), undefined);
  t.equal(store('b').getDefaultData(), undefined);

  var as = dispatcher.allStoresReady(['a', 'b'], function () {
    t.equal(store('a').getDefaultData(), 'hello');
    t.equal(store('b').getDefaultData(), 'world');
  });

  setTimeout(function () {
    t.ok(store('a').getDefaultData().isLoading);
    t.ok(store('b').getDefaultData().isLoading);
  }, 150);

});
