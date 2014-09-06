'use strict';
var test = require('tape');
var assert = require('assert');
var Dispatcher = require('../');
var _once = function (fn) {
  var called;
  return function () {
    if (called) return;
    called = true;
    return fn.apply(this, arguments);
  }
}

test('default data for store', function (t) {
  var dispatcher = Dispatcher();
  var action = dispatcher.action;
  var store = dispatcher.store;
  t.plan(1)

  store('age', {
    init: function () {
      this.listenTo(action('pass years'), this.inc);
      this.data = this.getDefaultData();
      this.trigger(this.getDefaultData());
    },
    inc: function (years) {
      this.data += years;
      this.trigger(this.data);
    },
    getDefaultData: function () {
      return 21;
    }
  });

  t.equal(store('age').getDefaultData(), 21);

});

test('save default data for store', function (t) {
  var dispatcher = Dispatcher({
    data: {
      age: 25
    }
  });
  var action = dispatcher.action;
  var store = dispatcher.store;
  t.plan(3)

  store('age', {
    init: function () {
      this.listenTo(action('pass years'), this.inc);
      this.data = this.getDefaultData();
      this.trigger(this.data);
    },
    inc: function (years) {
      this.data += years;
      this.trigger(this.data);
    },
    getDefaultData: function () {
      return 21;
    }
  });

  t.equal(store('age').getDefaultData(), 25);

  store('person', {
    data: {
      name: 'undozen'
    },
    init: function () {
      this.listenTo(store('age'), this.setAge, this.setAge);
    },
    setAge: function (age) {
      this.data.age = age;
      this.trigger(this.data);
    }
  });

  store('person').listen(function (data) {
    t.deepEqual(data, {name: 'undozen', age: 27});
    t.deepEqual(store('person').getDefaultData(), {name: 'undozen', age: 27});
  });

  action('pass years')(2);

});

test('ignore errors triggered by store', function (t) {
  var dispatcher = Dispatcher({
    data: {
      age: 25
    }
  });
  var action = dispatcher.action;
  var store = dispatcher.store;
  t.plan(3)

  store('age', {
    init: function () {
      this.listenTo(action('pass years'), this.inc);
      this.data = this.getDefaultData();
      this.trigger(this.data);
    },
    inc: function (years) {
      try {
        assert.equal(typeof years, 'number')
      } catch (e) {
        this.trigger(e);
        return;
      }
      this.data += years;
      this.trigger(this.data);
    },
    getDefaultData: function () {
      return 21;
    }
  });

  t.equal(store('age').getDefaultData(), 25);

  store('age').listen(function (data) {
    t.equal('AssertionError', data.name);
    t.equal(store('age').getDefaultData(), 25);
  });
  action('pass years')('two years');

});
