module.exports = {
  updateBoard({board}) {
    return Board.update(board.id, {coordinates: board.coordinates});
  }
};
