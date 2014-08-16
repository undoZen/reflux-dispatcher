'use strict';
var test = require('tape');
var dispatcher = require('../')();
var action = dispatcher.action;
var store = dispatcher.store;
var _ = require('reflux/src/utils');

test('overwrite store', function (t) {
  // overwritten store listeners should be cleaned so there should be only two test assert
  t.plan(2)

  store('greeting').define({
    init: function () {
      this.listenTo(action('hello'), this.sayHello);
    },
    sayHello: function (name) {
      t.equal(name, 'world');
    }
  });

  action('hello')('world');

  // overwriten should be happen at least in next tick
  _.nextTick(function () {

    store('greeting').define({
      init: function () {
        this.listenTo(action('hello'), this.sayHello);
      },
      sayHello: function (name) {
        t.equal(name, 'undoZen');
        t.end();
      }
    });

    action('hello')('undoZen');
  });

});
