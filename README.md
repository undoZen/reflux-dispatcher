reflux-dispatcher
=================

a hot reload friendly dispatcher for reflux

##Usage

    var dispatcher = require('reflux-dispatcher')();
    var action = dispatcher.actions;
    var store = dispatcher.stores;

    //actions don't need to be deslared before use
    action('signin').listen(function(user) {
      console.log('hello ', user.username);
    });
    action('signin')({username: 'undozen', password: '123'});

##License
[MIT](http://undozen.mit-license.org/2014)
