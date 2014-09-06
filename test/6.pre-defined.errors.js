'use strict';
var test = require('tape');
var Dispatcher = require('../');

test('pre-defined errors for async management', function (t) {
  t.plan(4);
  t.assert(Dispatcher.loading instanceof Error);
  t.assert(Dispatcher.ready instanceof Error);
  var dispatcher = new Dispatcher;
  t.assert(dispatcher.loading instanceof Error);
  t.assert(dispatcher.ready instanceof Error);
});
