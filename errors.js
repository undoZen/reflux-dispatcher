/*
 * pre-defined errors for async state management, e.g.
 *
 * store('user').listenTo(store('login'), function (data) {
 *   if (data is Dispatcher.loading) {
 *     // show loading spinner
 *   }
 * });
 *
 */

function ReadyError() {
  this.status = 'ready';
}
ReadyError.prototype = new Error;

function LoadingError() {
  this.status = 'loading';
}
LoadingError.prototype = new Error;

exports.ReadyError = ReadyError;
exports.LoadingError = LoadingError;
exports.ready = new ReadyError;
exports.loading = new LoadingError;
