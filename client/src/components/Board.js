// import React, {Component} from 'react';
// import classNames from 'classnames';
//
// const lables = 'ABCDEFGH'.split('');
//
// const asPiece = (value) => {
//     switch (value) {
//         case 'S':
//             return null;
//         case 'x':
//             return 'X';
//         default:
//             return value || null;
//     }
// };
//
// const isShip = (value) => {
//     return value === 'S' || value === 'X';
// };
//
// class Column extends Component {
//     state = {
//         hover: false
//     };
//
//     handleMouseEnter = () => {
//         this.setState({hover: true});
//     };
//
//     handleMouseLeave = () => {
//         this.setState({hover: false});
//     };
//
//     render() {
//         let {value} = this.props;
//
//         return (
//             <div className={classNames({'square': true, 'ship': isShip(value), 'hover': this.state.hover})}
//                  onMouseEnter={this.handleMouseEnter}
//                  onMouseLeave={this.handleMouseLeave}>
//                 {asPiece(value)}
//             </div>
//         );
//     }
// }
//
// const Row = ({value: row}) => {
//     return (
//         <div className='board-row'>
//             {row.map((column, i) => <Column key={i} value={column}/>)}
//         </div>
//     );
// };
//
// class Board extends Component {
//     state = {
//         board: this.props.board
//     };
//
//     addLabels(board) {
//         return [lables, ...board].map((row, i) => [i, ...row]);
//     }
//
//     render() {
//         const {board} = this.state;
//
//         return (
//             <div>
//                 {this.addLabels(board).map((row, i) => <Row key={i} value={row}/>)}
//             </div>
//         );
//     }
// }
//
// export default Board;

import React from 'react';
import classNames from 'classnames';


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

const Column = (props) => {
    const {column, index} = props;

    return (
        <div className={classNames({
            'board-col': true,
            'ship': isShip(column),
            'hit': isHit(column),
            'miss': isMiss(column)
        })}
             onClick={() => props.onClick(index)}
             onMouseEnter={() => props.onMouseEnter(index)}
             onMouseLeave={props.onMouseLeave}>
            {asPiece(column)}
        </div>
    );
};

const Row = (props) => {
    const {row, ship, index} = props;

    return (
        <div className={`board-row ${ship(index)}`}>
            {row.map((column, i) =>
                <Column column={column}
                        index={i}
                        key={i}
                        onClick={(col) => props.onClick({row: index, col})}
                        onMouseEnter={(col) => props.onMouseEnter({row: index, col})}
                        onMouseLeave={props.onMouseLeave}/>)}
        </div>
    );
};


const Board = (props) => {
    const {board, ship} = props;

    return (
        <div>
            {board.map((row, i) =>
                <Row row={row}
                     ship={ship}
                     index={i}
                     key={i}
                     onClick={props.onClick}
                     onMouseEnter={props.onMouseEnter}
                     onMouseLeave={props.onMouseLeave}/>)}
        </div>
    );
};

export default Board;
