'use strict';
var test = require('tape');
var dispatcher = require('../')();
var action = dispatcher.action;
var store = dispatcher.store;

test('define store', function (t) {
  t.plan(1)

  store('greeting').define({
    init: function () {
      this.listenTo(action('hello'), this.sayHello);
    },
    sayHello: function (name) {
      t.equal(name, 'world');
    }
  });

  action('hello')('world');
});
