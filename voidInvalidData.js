module.exports = function (fn) {
  return function (data) {
    return !data || data instanceof Error ? void 0 : fn.apply(this, arguments);
  }
}
