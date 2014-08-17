'use strict';
var test = require('tape');
var dispatcher = require('../')();
var action = dispatcher.action;
var store = dispatcher.store;

test('define store', function (t) {
  t.plan(3)

  store('age', {
    age: 25,
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

  store('person', {
    name: 'undoZen',
    age: store('age').getData(),
    init: function () {
      this.listenTo(store('age'), this.setAge);
    },
    setAge: function(age) {
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
    // should be called twice
    // newly defined store('age') should inherit listeners
    // (which is only store('persion') in this case)
    // from early defined version
    t.deepEqual(data, {name: 'undoZen', age: 27});
  });

  setTimeout(function () {
    store('age', { // redefine store('age') here
      age: 29,
      init: function () {
        this.listenTo(action('pass years'), this.inc);
        this.listenTo(action('return back'), this.dec);
        this.trigger(this.age);
      },
      inc: function (years) {
        this.age += years;
        this.trigger(this.getData());
      },
      dec: function (years) {
        this.age -= years;
        this.trigger(this.getData());
      },
      getData: function () {
        return this.age;
      }
    });

    action('return back')(2);
  }, 100);

});
