'use strict';
var test = require('tape');
var vid = require('../voidBuiltinData');
var errors = require('../errors');

test('pre-defined errors for async management', function (t) {
  var a = 1;
  var iset = vid(function (data) {
    a = data;
  });
  t.plan(7);
  t.equal(a, 1);
  iset(2);
  t.equal(a, 2);
  iset(null);
  t.equal(a, null);
  var e = new Error;
  iset(e);
  t.equal(a, e);
  iset(errors.ready);
  t.notEqual(a, errors.ready);
  iset(errors.loading);
  t.notEqual(a, errors.loading);
  t.equal(a, e);
});
