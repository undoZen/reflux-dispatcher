'use strict';
module.exports = function (data) {
  return data === undefined || data !== null && !!data.isLoading;
}