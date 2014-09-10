'use strict';
var test = require('tape');
var dispatcher = require('../')();
var action = dispatcher.action;
var store = dispatcher.store;
var _ = require('reflux/src/utils');

test('overwrite store', function (t) {
  t.plan(4)

  store('greeting', {
    init: function () {
      this.listenTo(action('hello'), function (name) {
        t.equal('Hello, world!', this.sayHello(name));
      }.bind(this));
    },
    sayHello: function (name) {
      return 'Hello, ' + name + '!';
    }
  });

  action('hello')('world');

  _.nextTick(function () {

    store('greeting', {
      init: function () {
        this.listenTo(action('hello'), function (name) {
          t.equal('Hi, world!', this.sayHello(name));
        }.bind(this));
      },
      sayHello: function (name) {
        return 'Hi, ' + name + '!';
      }
    });

    action('hello')('world');

    _.nextTick(function () {

      dispatcher.enableHotReload = false

      store('greeting', {
        init: function () {
          this.listenTo(action('hello'), function (name) {
            t.equal('Hi, world!', this.sayHello(name));
            // if store were overwritted, this test should fail
          }.bind(this));
        },
        sayHello: function (name) {
          return 'Hello, ' + name + '!';
        }
      });

      action('hello')('world');

      _.nextTick(function () {

        dispatcher.enableHotReload = true

        store('greeting', {
          init: function () {
            this.listenTo(action('hello'), function (name) {
              t.equal('Hello, world!', this.sayHello(name));
              // if store were overwritted, this test should fail
            }.bind(this));
          },
          sayHello: function (name) {
            return 'Hello, ' + name + '!';
          }
        });

        action('hello')('world');

      });
    });
  });
});
