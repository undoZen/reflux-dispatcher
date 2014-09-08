'use strict';
var test = require('tape');
var Dispatcher = require('../');

test('allStoresReady() method', function (t) {
  var dispatcher = new Dispatcher;
  var store = dispatcher.store;
  t.plan(6);

  store('a', {
    init: function () {
      setTimeout(function () {
        this.trigger('hello');
        this.trigger(Dispatcher.ready);
      }.bind(this));
    }
  });

  store('b', {
    init: function () {
      setTimeout(function () {
        this.trigger('world');
        this.trigger(Dispatcher.ready);
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
    t.equal(store('a').getDefaultData(), 'hello');
    t.equal(store('b').getDefaultData(), 'world');
  }, 200);
});
