/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    players: {
      type: 'integer',
      defaultsTo: 0
    },

    inPlay: {
      type: 'integer',
      defaultsTo: 0
    },

    board: {
      collection: 'board',
      via: 'game'
    }
  }
};
