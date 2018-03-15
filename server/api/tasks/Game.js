const a = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 'S', 'S', 'S', 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const b = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 'S', 0, 0, 0],
  [0, 0, 0, 0, 'S', 0, 0, 0],
  [0, 0, 0, 0, 'S', 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const MAX_PLAYERS = 2;

module.exports = {
  createGame() {
    return Game.create()
      .then(game =>
        Promise.all([a, b].map((pieces) => Board.create({pieces, game: game.id})))
          .then(() => Promise.resolve(game))
      )
  },

  subscribe({id}) {
    return Game.findOne({id})
      .then(game => Game.update(id, {room: `game-${id}`, subscription: game.subscription + 1}))
      .then(() => Game.findOne({id}).populate('board')
        .then(game => {
          // if (game.subscription > MAX_PLAYERS) return Promise.reject();
          return Promise.resolve({...game, player: (game.subscription - 1) % 2});
        }));
  },

  update(id, options) {
    return Game.update(id, options);
  }
};
