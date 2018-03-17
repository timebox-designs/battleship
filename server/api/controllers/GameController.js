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

    if (!req.isSocket) {
      return res.badRequest();
    }

    Game.incrementPlayerCount(req.params.id)
      .then(game => {
        // if (game.players > MAX_PLAYERS) return res.notFound();

        Game.findGame(game.id)
          .then(game => {
            sails.sockets.join(req.socket, `game-${game.id}`);
            res.send(game);
          });
      });
  },

  log({method, url}) {
    sails.log(method, url);
  }
};
