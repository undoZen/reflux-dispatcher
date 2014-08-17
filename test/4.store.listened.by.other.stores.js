'use strict';
var test = require('tape');
var dispatcher = require('../')();
var action = dispatcher.action;
var store = dispatcher.store;

test('define store', function (t) {
  t.plan(2)

  store('age', {
    age: 25,
    init: function () {
      this.listenTo(action('pass years'), this.incr);
    },
    incr: function (years) {
      this.age += years;
      this.trigger(this.getData());
    },
    getData: function () {
      return this.age;
    }
  });

  store('person', {
    name: 'undoZen',
    age: store('age').getData(),
    init: function () {
      this.listenTo(store('age'), this.howTimeFlies);
    },
    howTimeFlies: function(age) {
      console.log('How time flies! I\'m', age, 'now!');
      this.age = age;
      this.trigger(this.getData());
    },
    getData: function() {
      return {
        name: this.name,
        age: this.age
      }
    }
  });

  t.equal(store('age').getData(), 25);

  action('pass years')(2);
  store('person').listen(function (data) {
    t.deepEqual(data, {name: 'undoZen', age: 27});
  });
});
