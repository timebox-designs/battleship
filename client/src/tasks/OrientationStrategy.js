import _ from 'underscore';
import {isHorizontal} from './Orientation';

const BOARD_SIZE = 8;
const BOARD_SEGMENT = 0;
const SHIP_SEGMENT = 'S';

const shipTemplate = (col) => `s${col}`;

const collisionTemplate = (col) => `c${col}`;

const isEmptyCell = (cell) => cell.row === 0 && cell.col === 0;

const isSegment = (value) => value === SHIP_SEGMENT;

const toSegments = (segments, value, i) => isSegment(value) ? [...segments, i] : segments;


// Higher order functions

const transpose = (matrix) => _.zip.apply(null, matrix);

const fill = (value, n) => _.times(n, _.constant(value));

const vector = (start, length) => _.range(start, start + length);

const shipCoordinates = (row, col) => _.zip(row, col);

const addShip = (board, shipCoordinates, segment) => {
    const copy = board.map(row => [...row]);

    shipCoordinates.forEach(coordinate => copy[coordinate[0]][coordinate[1]] = segment);
    return copy;
};

const removeShip = (board, ship) => {
    const orientation = isHorizontal(ship.orientation) ? horizontal : vertical;
    return addShip(board, orientation.coordinates(ship.cell, ship), BOARD_SEGMENT);
};

const collision = (boardVector, shipVector) =>
    _.intersection(boardVector, shipVector).length > 0 || _.last(shipVector) > BOARD_SIZE;


// Horizontal ship strategy

const horizontal = {
    isCollision: (board, cell, ship) => {
        const boardVector = board[cell.row].reduce(toSegments, []);
        return collision(boardVector, vector(cell.col, ship.length));
    },

    segments: (board, cell, ship) => (index) => {
        if (isEmptyCell(cell) || index !== cell.row) return '';

        const template = horizontal.isCollision(board, cell, ship) ? collisionTemplate : shipTemplate;
        return vector(cell.col, ship.length).map(template).join(' ');
    },

    coordinates: (cell, ship) => shipCoordinates(fill(cell.row, ship.length), vector(cell.col, ship.length)),

    addShip: (board, cell, ship) => addShip(board, horizontal.coordinates(cell, ship), SHIP_SEGMENT),

    removeShip: (board, ship) => removeShip(board, ship)
};


// Vertical ship strategy

const vertical = {
    isCollision: (board, cell, ship) => {
        const boardVector = transpose(board)[cell.col].reduce(toSegments, []);
        return collision(boardVector, vector(cell.row, ship.length));
    },

    segments: (board, cell, ship) => (index) => {
        if (isEmptyCell(cell)) return '';

        const template = vertical.isCollision(board, cell, ship) ? collisionTemplate : shipTemplate;
        return _.contains(vector(cell.row, ship.length), index) ? template(cell.col) : '';
    },

    coordinates: (cell, ship) => shipCoordinates(vector(cell.row, ship.length), fill(cell.col, ship.length)),

    addShip: (board, cell, ship) => addShip(board, vertical.coordinates(cell, ship), SHIP_SEGMENT),

    removeShip: (board, ship) => removeShip(board, ship)
};

export default {horizontal, vertical};
