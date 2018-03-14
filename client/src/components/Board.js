import React, {Component} from 'react';
import classNames from 'classnames';

const lables = 'ABCDEFGH'.split('');

const asPiece = (value) => {
    switch (value) {
        case 'S':
            return null;
        case 'x':
            return 'X';
        default:
            return value || null;
    }
};

const isShip = (value) => {
    return value === 'S' || value === 'X';
};

class Column extends Component {
    state = {
        hover: false
    };

    handleMouseEnter = () => {
        this.setState({hover: true});
    };

    handleMouseLeave = () => {
        this.setState({hover: false});
    };

    render() {
        let {value} = this.props;

        return (
            <div className={classNames({'square': true, 'ship': isShip(value), 'hover': this.state.hover})}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseLeave={this.handleMouseLeave}>
                {asPiece(value)}
            </div>
        );
    }
}

const Row = ({value: row}) => {
    return (
        <div className='board-row'>
            {row.map((column, i) => <Column key={i} value={column}/>)}
        </div>
    );
};

class Board extends Component {
    state = {
        board: this.props.board
    };

    addLabels(board) {
        return [lables, ...board].map((row, i) => [i, ...row]);
    }

    render() {
        const {board} = this.state;

        return (
            <div>
                {this.addLabels(board).map((row, i) => <Row key={i} value={row}/>)}
            </div>
        );
    }
}

export default Board;
