'use strict';
var test = require('tape');
var dispatcher = require('../')();
var action = dispatcher.action;
var store = dispatcher.store;
var _ = require('reflux/src/utils');

test('overwrite store', function (t) {
  // overwritten store listeners should be cleaned so there should be only to test assert
  t.plan(2)

  store('greeting', {
    init: function () {
      this.listenTo(action('hello'), this.sayHello);
    },
    sayHello: function (name) {
      t.equal(name, 'world');
    }
  });

  action('hello')('world');


  _.nextTick(function () {

    store('greeting', {
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
