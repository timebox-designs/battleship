/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  subscribe(req, res) {
    if (!req.isSocket) {
      return res.badRequest();
    }

    sails.sockets.join(req.socket, 'chat');
    return res.ok();
  }
};
