'use strict';
var test = require('tape');
var Dispatcher = require('../');

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

  t.deepEqual(store('age').getDefaultData(), [21]);

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
      this.data = this.getDefaultData()[0];
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

  t.deepEqual(store('age').getDefaultData(), [25]);

  var a = store('person', {
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
    t.deepEqual(store('person').getDefaultData()[0], {name: 'undozen', age: 27});
  });

  action('pass years')(2);

});
