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

const MAX_PLAYERS = 2;

module.exports = {
  createGame() {
    return Game.create()
      .then(game =>
        Promise.all([0, 1].map(() => Board.create({coordinates, game: game.id})))
          .then(() => Promise.resolve(game))
      )
  },

  subscribe({id}) {
    return Game.findOne({id})
      .then(game => Game.update(id, {room: `game-${id}`, subscription: game.subscription + 1}))
      .then(() => Game.findOne({id}).populate('board')
        .then(game => {
          // if (game.subscription > MAX_PLAYERS) return Promise.reject();

          const board = game.board.map(board => ({...board, coordinates}));
          return Promise.resolve({...game, board, player: (game.subscription - 1) % 2});
        }));
  },

  update(id, options) {
    return Game.update(id, options);
  }
};
