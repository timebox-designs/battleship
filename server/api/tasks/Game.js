const coordinates = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const strip = (board) => board.map(board => ({...board, coordinates}));

module.exports = {
  createGame() {
    return Game.create()
      .then(game =>
        Promise.all([0, 1].map(() => Board.create({coordinates, game: game.id})))
          .then(() => Promise.resolve(game))
      )
  },

  findGame(id) {
    return Game.findOne(id).populate('board')
      .then(game => Promise.resolve({...game, player: (game.players - 1) % 2}));
  },

  incrementPlayerCount(id) {
    return Game.findOne(id)
      .then(game => Game.update(id, {players: game.players + 1}))
      .then(games => Promise.resolve(games[0]));
  },

  incrementInPlay(id) {
    return Game.findOne(id)
      .then(game => Game.update(id, {inPlay: game.inPlay + 1}))
      .then(games => Promise.resolve(games[0]));
  },

  stripCoordinates(game) {
    return Promise.resolve({...game, board: strip(game.board)});
  }
};
