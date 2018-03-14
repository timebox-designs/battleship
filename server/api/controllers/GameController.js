/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const Game = require('../tasks/Game');

module.exports = {
  create(req, res) {
    this.log(req);

    Game.createGame()
      .then(game => res.send(game));
  },

  subscribe(req, res) {
    this.log(req);

    if (!req.isSocket) {
      return res.badRequest();
    }

    Game.subscribe({id: req.params.id})
      .then(game => {
        sails.sockets.join(req.socket, game.room);
        res.send(game);
      }).catch(() => res.notFound());
  },

  log({method, url}) {
    sails.log(method, url);
  }
};
