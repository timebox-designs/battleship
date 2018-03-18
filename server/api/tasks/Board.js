module.exports = {
  updateCoordinates(id, coordinates) {
    return Board.update(id, {coordinates});
  },

  findBoard(id) {
    return Board.findOne(id);
  }
};
