var GloBoardAPI = require('./glo-board-api');
var AuthenticationMethods = require('./authentication-methods');
GloBoardAPI._addMethods(AuthenticationMethods);
module.exports = GloBoardAPI;
