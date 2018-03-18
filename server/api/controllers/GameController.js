/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Game = require('../tasks/Game');
const MAX_PLAYERS = 2;

module.exports = {
  createGame(req, res) {
    this.log(req);

    Game.createGame()
      .then(game => res.send(game));
  },

  joinGame(req, res) {
    this.log(req);
    if (!req.isSocket) return res.badRequest();

    Game.incrementPlayerCount(req.params.id)
      .then(game => {
        // if (game.players > MAX_PLAYERS) return res.notFound();

        Game.findGame(game.id)
          .then(Game.stripCoordinates)
          .then(game => {
            sails.sockets.join(req.socket, `game-${game.id}`);
            res.send(game);
          });
      });
  },

  gameOver(req, res) {
    this.log(req);
    if (!req.isSocket) return res.badRequest();

    const {id} = req.params;
    const {player} = req.body;

    sails.sockets.broadcast(`game-${id}`, 'over', {player});
    res.ok();
  },

  log({method, url}) {
    sails.log(method, url);
  }
};
