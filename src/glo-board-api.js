'use strict';

var ApiRequest = require('./api-request');
var HttpManager = require('./http-manager');

function GloBoardAPI(credentials) {
  this._credentials = credentials || {};
}

GloBoardAPI.prototype = {
  setCredentials: function(credentials) {
    for (var key in credentials) {
      if (credentials.hasOwnProperty(key)) {
        this._credentials[key] = credentials[key];
      }
    }
  },

  getCredentials: function() {
    return this._credentials;
  },

  resetCredentials: function() {
    this._credentials = null;
  },

  setClientId: function(clientId) {
    this._setCredential('clientId', clientId);
  },

  setClientSecret: function(clientSecret) {
    this._setCredential('clientSecret', clientSecret);
  },

  setAccessToken: function(accessToken) {
    this._setCredential('accessToken', accessToken);
  },

  getClientId: function() {
    return this._getCredential('clientId');
  },

  getClientSecret: function() {
    return this._getCredential('clientSecret');
  },

  getAccessToken: function() {
    return this._getCredential('accessToken');
  },

  resetClientId: function() {
    this._resetCredential('clientId');
  },

  resetClientSecret: function() {
    this._resetCredential('clientSecret');
  },

  resetAccessToken: function() {
    this._resetCredential('accessToken');
  },

  _setCredential: function(credentialKey, value) {
    this._credentials = this._credentials || {};
    this._credentials[credentialKey] = value;
  },

  _getCredential: function(credentialKey) {
    if (!this._credentials) {
      return;
    } else {
      return this._credentials[credentialKey];
    }
  },

  _resetCredential: function(credentialKey) {
    if (!this._credentials) {
      return;
    } else {
      this._credentials[credentialKey] = null;
    }
  },

  /** BOARDS **/

  /**
   * Look up boards the user has access to.
   * @param {Object} options
   * @returns {Promise} - A promise that if successful, returns a list of boards the user has access to.
   */
  getBoards: function(options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards')
      .withQueryParameters(options)
      .build()
      .execute(HttpManager.get);
  },

  /**
   * Look up a board.
   * @param {string} boardId - The board's ID.
   * @param {Object} options
   * @returns {Promise} - A promise that if successful, returns an object containing information about the board.
   */
  getBoard: function(boardId, options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId)
      .withQueryParameters(options)
      .build()
      .execute(HttpManager.get);
  },

  /**
   * Create a board.
   * @param {string} boardName - The name of the board.
   * @returns {Promise} - A promise that if successful, returns the created board.
   */
  createBoard: function(boardName) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards')
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters({ name: boardName })
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Edit a board.
   * @param {string} boardId - The board's ID.
   * @param {string} options - The new board options. Currently only supports name.
   * @returns {Promise} - A promise that if successful, returns an object containing information about the edited board.
   */
  editBoard: function(boardId, options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId)
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(options)
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Delete a board.
   * @param {string} boardId - The board's ID.
   * @returns {Promise} - A promise that if successful, returns an empty object.
   */
  deleteBoard: function (boardId) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId)
      .build()
      .execute(HttpManager.del);
  },

  /** COLUMNS **/

  /**
   * Create a new column in a board
   * @param {string} boardId - The board's ID.
   * @param {string} columnName - The name of the column.
   * @param {number} position - The positon of the column in the board.
   * @returns {Promise} - A promise that if successful, returns the created column
   */
  createColumn: function (boardId, columnName, position) {
    if (!position) position = 0;
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/columns')
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters({ name: columnName, position })
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Edit a column.
   * @param {string} boardId - The board's ID.
   * @param {string} columnId - The column's ID.
   * @param {string} options - The new board options. Currently only supports name, and position.
   * @returns {Promise} - A promise that if successful, returns an object containing information about the edited column.
   */
  editColumn: function (boardId, columnId, options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/columns/' + columnId)
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(options)
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Delete a column.
   * @param {string} boardId - The board's ID.
   * @param {string} columnId - The column's ID.
   * @returns {Promise} - A promise that if successful, returns an empty object.
   */
  deleteColumn: function (boardId, columnId) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/columns/' + columnId)
      .build()
      .execute(HttpManager.del);
  },

  /** CARDS **/

  /**
   * Look up a list of cards for a board.
   * @param {string} boardId - The board's ID.
   * @param {Object} options
   * @returns {Promise} - A promise that if successful, returns the list of cards for the requested board.
   */
  getCardsOfBoard: function(boardId, options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards')
      .withQueryParameters(options)
      .build()
      .execute(HttpManager.get);
  },
  /**
   * Create a new card in a column
   * @param {string} boardId - The board's ID.
   * @param {Object} columnId - The ID of the column.
   * @param {Object} card - The properties of the card to create.
   * @returns {Promise} - A promise that if successful, returns the created card
   */

  createCard: function (boardId, columnId, card) {
    options['column_id'] = columnId;
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards')
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(card)
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Create a batch of cards
   * @param {string} boardId - The board's ID.
   * @param {Array} cards - The properties of the cards to create.
   * @param {Boolean} sendNotification - Default: false
   * @returns {Promise} - A promise that if successful, returns the created cards
   */
  createBatchOfCards: function (boardId, cards, sendNotification = false) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards')
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters({ cards, send_notification: sendNotification })
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Look up a card.
   * @param {string} boardId - The board's ID.
   * @param {string} cardId - The card's ID.
   * @param {Object} options
   * @returns {Promise} - A promise that if successful, returns the card.
   */
  getCard: function(boardId, cardId, options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards/' + cardId)
      .withQueryParameters(options)
      .build()
      .execute(HttpManager.get);
  },

  /**
   * Edit a card.
   * @param {string} boardId - The board's ID.
   * @param {string} cardId - The card's ID.
   * @param {string} cardProperties - The new card properties.
   * @returns {Promise} - A promise that if successful, returns an object containing information about the edited Card.
   */
  editCard: function(boardId, cardId, cardProperties) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards/' + cardId)
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(cardProperties)
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Delete a card.
   * @param {string} boardId - The board's ID.
   * @param {string} cardId - The card's ID.
   * @returns {Promise} - A promise that if successful, returns an empty object.
   */
  deleteCard: function (boardId, cardId) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards/' + cardId)
      .build()
      .execute(HttpManager.del);
  },

  /**
   * Look up a list of cards for a column.
   * @param {string} boardId - The board's ID.
   * @param {string} columnId - The column's ID.
   * @param {Object} options
   * @returns {Promise} - A promise that if successful, returns the cards of the column.
   */
  getCardsOfColumn: function(boardId, columnId, options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/columnId/' + columnId + '/cards')
      .withQueryParameters(options)
      .build()
      .execute(HttpManager.get);
  },

  /** LABELS **/

  /**
   * Create a new label in a board
   * @param {string} boardId - The board's ID.
   * @param {string} name - The name of the label.
   * @param {Object} color - The color object of the label.
   * @returns {Promise} - A promise that if successful, returns the created label
   */
  createLabel: function (boardId, name, color) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/labels')
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters({ name, color })
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Edit a label of a board.
   * @param {string} boardId - The board's ID.
   * @param {string} labelId - The label's ID.
   * @param {string} labelProperties - The new label properties.
   * @returns {Promise} - A promise that if successful, returns the edited label.
   */
  editLabel: function(boardId, labelId, labelProperties) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/labels/' + labelId)
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(labelProperties)
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Delete a label.
   * @param {string} boardId - The board's ID.
   * @param {string} labelId - The label's ID.
   * @returns {Promise} - A promise that if successful, returns an empty object.
   */
  deleteLabel: function (boardId, labelId) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/labels/' + labelId)
      .build()
      .execute(HttpManager.del);
  },

  /** TODO: ATTACHMENTS **/

  /** COMMENTS **/

  /**
   * Look up the list of comments for a card.
   * @param {string} boardId - The board's ID.
   * @param {string} cardId - The card's ID.
   * @param {Object} options
   * @returns {Promise} - A promise that if successful, returns a list of comments of the card.
   */
  getCommentsOfCard: function(boardId, cardId, options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards/' + cardId + '/comments')
      .withQueryParameters(options)
      .build()
      .execute(HttpManager.get);
  },

  /**
   * Create a new comment in a card
   * @param {string} boardId - The board's ID.
   * @param {string} cardId - The card's ID.
   * @param {string} comment - The new comment.
   * @returns {Promise} - A promise that if successful, returns the created comment.
   */
  createComment: function (boardId, cardId, comment) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards/' + cardId)
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(comment)
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Edit a comment.
   * @param {string} boardId - The board's ID.
   * @param {string} cardId - The card's ID.
   * @param {string} commentId - The comment's ID.
   * @param {string} commentProperties - The new comment properties.
   * @returns {Promise} - A promise that if successful, returns the edited comment.
   */
  editComment: function(boardId, cardId, commentId, commentProperties) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards/' + cardId + '/comments/' + commentId)
      .withHeaders({ 'Content-Type': 'application/json' })
      .withBodyParameters(commentProperties)
      .build()
      .execute(HttpManager.post);
  },

  /**
   * Delete a comment.
   * @param {string} boardId - The board's ID.
   * @param {string} cardId - The card's ID.
   * @param {string} commentId - The comment's ID.
   * @returns {Promise} - A promise that if successful, returns an empty object.
   */
  deleteComment: function (boardId, cardId, commentId) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/boards/' + boardId + '/cards/' + cardId + '/comments/' + commentId)
      .build()
      .execute(HttpManager.del);
  },

  /** USER **/

  /**
   * Look up the authenticated User.
   * @param {Object} options
   * @returns {Promise} - A promise that if successful, returns the authenticated user.
   */
  getUser: function(options) {
    return ApiRequest.builder(this.getAccessToken())
      .withPath('/v1/glo/user')
      .withQueryParameters(options)
      .build()
      .execute(HttpManager.get);
  },

};

GloBoardAPI._addMethods = function(methods) {
  for (var i in methods) {
    if (methods.hasOwnProperty(i)) {
      this.prototype[i] = methods[i];
    }
  }
};

module.exports = GloBoardAPI;
