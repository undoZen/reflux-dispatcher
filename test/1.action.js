'use strict';
var test = require('tape');
var dispatcher = require('../')();
var action = dispatcher.action;

test('action don\' need to be defined before use', function (t) {
  t.plan(1)
  function cb(name) {
    t.equal(name, 'world');
  }
  action('hello').listen(cb);
  action('hello')('world');
});
