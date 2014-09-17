'use strict';
var test = require('tape');
var vid = require('../voidInvalidData');

test('pre-defined errors for async management', function (t) {
  var a = 1;
  var iset = vid(function (data) {
    a = data;
  });
  t.plan(5);
  t.equal(a, 1);
  iset(2);
  t.equal(a, 2);
  iset(null);
  t.notEqual(a, null);
  var e = new Error;
  iset(e);
  t.notEqual(a, e);
  t.equal(a, 2);
});
