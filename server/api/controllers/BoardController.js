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
  updateBoard(req, res) {
    this.log(req);
    if (!req.isSocket) return res.badRequest();

    const {board} = req.body;

    Board.updateCoordinates(req.params.id, board.coordinates)
      .then(() => Game.incrementInPlay(board.game))
      .then(() => Game.findGame(board.game))
      .then(game => {

        sails.sockets.broadcast(`game-${game.id}`, 'setup', {
          targets: game.board.map(countSegments),
          inPlay: game.inPlay
        });

        res.ok();
      });
  },

  fireOnShip(req, res) {
    this.log(req);
    if (!req.isSocket) return res.badRequest();

    const {id} = req.params;
    const {cell, opponent} = req.body;

    Board.findBoard(id)
      .then(board => {

        const {row, col} = cell;
        const isHit = board.coordinates[row][col] === 'S';

        board.coordinates[row][col] = isHit ? 'X' : 'x';

        Board.updateCoordinates(id, board.coordinates)
          .then(() => {

            sails.sockets.broadcast(`game-${board.game}`, 'fire', {
              cell,
              opponent,
              hitOrMiss: board.coordinates[row][col]
            });

            res.ok()
          });
      });
  },

  log({method, url}) {
    sails.log(method, url);
  }
};
