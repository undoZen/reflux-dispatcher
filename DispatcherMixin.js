var Dispatcher = require('./');

module.exports = {
  contextTypes: {
    dispatcher: Dispatcher
  },
  childContextTypes: {
    dispatcher: Dispatcher
  },
  getChildContext: function() {
    return {
      dispatcher: this.dispatcher
    };
  },
  getInitialState: function() {
    this.dispatcher = (this.props && this.props.dispatcher) || (this.context && this.context.dispatcher);
    if (!this.dispatcher) {
      console.log(this);
      console.warn('no dispatcher instance found, creating a new one...');
      this.dispatcher = new Dispatcher;
    }
    this.store = this.dispatcher.store;
    this.action = this.dispatcher.action;
    return {};
  }
};
