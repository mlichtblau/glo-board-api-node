'use strict';

function ApiError(message, statusCode) {
  this.name = 'ApiError';
  this.message = message || '';
  this.statusCode = statusCode;
}

ApiError.prototype = Error.prototype;

module.exports = ApiError;
