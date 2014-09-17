var errors = require('./errors')
module.exports = function (fn) {
  return function (data) {
    return data instanceof errors.LoadingError || data instanceof errors.ReadyError
      ? void 0
      : fn.apply(this, arguments);
  }
}
