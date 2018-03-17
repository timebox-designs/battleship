/**
 * BoardController
 *
 * @description :: Server-side logic for managing boards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Board = require('../tasks/Board');
const Game = require('../tasks/Game');

const isSegment = (col) => col === 'S';
const countSegments = (board) => board.coordinates.reduce((cnt, row) => cnt + row.filter(isSegment).length, 0);

module.exports = {
  updateGame(req, res) {
    this.log(req);

    if (!req.isSocket) {
      return res.badRequest();
    }

    const {board} = req.body;

    Board.updateCoordinates(req.params.id, board.coordinates)
      .then(() => Game.incrementInPlay(board.game))
      .then(game => {
        sails.sockets.broadcast(`game-${game.id}`, 'setup', {inPlay: game.inPlay, targets: countSegments(board)});
        res.ok();
      });
  },

  log({method, url}) {
    sails.log(method, url);
  }
};
