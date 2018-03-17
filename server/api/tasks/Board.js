module.exports = {
  updateCoordinates(id, coordinates) {
    return Board.update(id, {coordinates});
  }
};
