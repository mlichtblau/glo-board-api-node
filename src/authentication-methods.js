'use strict';

var AuthenticationRequest = require('./authentication-request');
var HttpManager = require('./http-manager');

module.exports = {

  /**
   * Request an access token using the Authorization Code flow.
   * Requires that client ID and client secret has been set previous to the call.
   * @param {string} code The authorization code returned in the callback in the Authorization Code flow.
   * @param {requestCallback} [callback] Optional callback method to be called instead of the promise.
   * @returns {Promise|undefined} A promise that if successful, resolves into an object containing the access token,
   *          refresh token, token type and time to expiration. If rejected, it contains an error object.
   *          Not returned if a callback is given.
   */
  authorizationCodeGrant: function(code, callback) {
    return AuthenticationRequest.builder()
      .withPath('/oauth/access_token')
      .withBodyParameters({
        grant_type: 'authorization_code',
        code: code,
        client_id: this.getClientId(),
        client_secret: this.getClientSecret()
      })
      .build()
      .execute(HttpManager.post, callback);
  },

  /**
   * Retrieve a URL where the user can give the application permissions.
   * @param {string[]} scopes The scopes corresponding to the permissions the application needs.
   * @param {string} state A parameter that you can use to maintain a value between the request and the callback. It is useful to prevent CSRF exploits.
   * @returns {string} The URL where the user can give application permissions.
   */
  createAuthorizeURL: function(scopes, state) {
    return AuthenticationRequest.builder()
      .withHost('app.gitkraken.com')
      .withPath('/oauth/authorize')
      .withQueryParameters({
        client_id: this.getClientId(),
        response_type: 'code',
        scope: scopes.join('%20'),
        state: state,
      })
      .build()
      .getURL();
  },
};
