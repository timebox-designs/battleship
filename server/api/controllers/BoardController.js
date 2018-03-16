/**
 * BoardController
 *
 * @description :: Server-side logic for managing boards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Board = require('../tasks/Board');

module.exports = {
  create(req, res) {
    this.log(req);

    if (!req.isSocket) {
      return res.badRequest();
    }

    Board.updateBoard(req.body)
      .then(() => res.ok());
  },

  log({method, url}) {
    sails.log(method, url);
  }
};
