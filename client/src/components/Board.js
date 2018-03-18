import React from 'react';
import classNames from 'classnames';

const LABLES = 'ABCDEFGH'.split('');
const withLabels = (board) => [LABLES, ...board].map((row, i) => [i, ...row]);

const isValid = (index) => index >= 0;

const asPiece = (value) => {
    switch (value) {
        case 'S':
        case 'X':
        case 'x':
            return null;
        default:
            return value || null;
    }
};

const isShip = (value) => value === 'S';
const isHit = (value) => value === 'X';
const isMiss = (value) => value === 'x';


const Column = ({column, index, ...props}) => (
    <div className={classNames({
        'board-col': true,
        'ship': isShip(column),
        'hit': isHit(column),
        'miss': isMiss(column)
    })}
         onClick={() => isValid(index) && props.onClick(index)}
         onMouseEnter={() => isValid(index) && props.onMouseEnter(index)}
         onMouseLeave={props.onMouseLeave}>
        {asPiece(column)}
    </div>
);


const Row = ({row, ship, index, ...props}) => (
    <div className={`board-row ${ship(index)}`}>
        {row.map((column, i) =>
            <Column column={column}
                    index={i - 1}
                    key={i}
                    onClick={(col) => isValid(index) && props.onClick({row: index, col})}
                    onMouseEnter={(col) => isValid(index) && props.onMouseEnter({row: index, col})}
                    onMouseLeave={props.onMouseLeave}/>)}
    </div>
);


const Board = ({board, ship, ...props}) => (
    <div>
        {withLabels(board.coordinates).map((row, i) =>
            <Row row={row}
                 ship={ship}
                 index={i - 1}
                 key={i}
                 onClick={props.onClick}
                 onMouseEnter={props.onMouseEnter}
                 onMouseLeave={props.onMouseLeave}/>)}
    </div>
);

export default Board;
