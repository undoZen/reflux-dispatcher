'use strict';
var test = require('tape');
var dispatcher = require('../')({
  age: 25
});
var action = dispatcher.action;
var store = dispatcher.store;

test('define store', function (t) {
  t.plan(1)

  store('age', {
    age: 21,
    init: function () {
      this.listenTo(action('pass years'), this.inc);
      this.trigger(this.getData());
    },
    inc: function (years) {
      this.age += years;
      this.trigger(this.getData());
    },
    getData: function () {
      return this.age;
    }
  });

  t.equal(store('age').getDefaultData(), 25);

});
