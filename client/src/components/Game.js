import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import classNames from 'classnames';
import _ from 'underscore';
import socket from '../util/socket';


import Board from './Board';
import ORIENTATION, {isHorizontal} from '../tasks/Orientation';
import OrientationStrategy from '../tasks/OrientationStrategy';

const EMPTY_CELL = {row: 0, col: 0};

const LABLES = 'ABCDEFGH'.split('');
const withLabels = (board) => [LABLES, ...board].map((row, i) => [i, ...row]);

const Orientation = ({value, onChange}) => {
    const toggleOrientation = () => isHorizontal(value) ? ORIENTATION.vertical : ORIENTATION.horizontal;

    return (
        <div className='form-check'>
            <input className='form-check-input'
                   type='checkbox' id='orientation'
                   value={value}
                   onChange={() => onChange(toggleOrientation())}/>
            <label className='form-check-label'
                   htmlFor='orientation'>
                Vertically
            </label>
        </div>
    );
};

const Ship = ({name, length, onClick}) => {
    return (
        <div onClick={onClick}>
            {_.range(length).map(i => <span key={i} className='segment'/>)}
            <span className='name'>{name}</span>
        </div>
    );
};

const Shipyard = ({ships, selected, onChange}) => {
    const isSelected = (ship) => ship.id === selected.id;

    return (
        <ul className='shipyard'>
            {ships.map(ship =>
                <li className={classNames({'ship': true, 'selected': isSelected(ship)})} key={ship.id}>
                    <Ship {...ship} onClick={() => onChange(ship)}/>
                </li>)}
        </ul>
    );
};

const ShipyardContainer = ({ships, selected, onSelectionChange}) => {
    return (
        <div>
            <div className='row'>
                <div className='col-10'>
                    <h3>Deploy Ships</h3>
                    <Shipyard
                        ships={ships}
                        selected={selected}
                        onChange={(ship) => onSelectionChange({...ship, orientation: selected.orientation})}/>
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                    <Orientation
                        value={selected.orientation}
                        onChange={(orientation) => onSelectionChange({...selected, orientation})}/>
                </div>
            </div>
        </div>
    );
};

const SHIPS = [
    {id: 0, name: 'Aircraft Carrier', length: 5},
    {id: 1, name: 'Battleship', length: 4},
    {id: 2, name: 'Destroyer', length: 3},
    {id: 3, name: 'Submarine', length: 3},
    {id: 4, name: 'Patrol Boat', length: 2}
];

const battleship = SHIPS[1];

const isEmptyCell = (cell) => cell.row === 0 && cell.col === 0;

class Game extends Component {
    state = {
        ship: {...battleship, orientation: ORIENTATION.horizontal},
        board: [],
        deployed: [],
        cell: EMPTY_CELL
    };

    componentDidMount() {
        let id = this.props.match.params.id;

        socket.get(`/game/${id}`)
            .then(game => {
                const board = game.board[game.player].pieces;
                this.setState({'board': withLabels(board)});

                socket.on(game.room, console.log);
            })
            .catch(error => this.setState({error}));
    }

    handleMouseEnter = (cell) => (cell.row && cell.col) && this.setState({cell});
    handleMouseLeave = () => this.setState({cell: EMPTY_CELL});
    handleSelectionChange = (ship) => this.setState({ship});

    handleClick = (cell) => {
        let {board, deployed, ship} = this.state;
        const strategy = OrientationStrategy[ship.orientation];

        if (isEmptyCell(cell) || strategy.isCollision(board, cell, ship)) return;

        const alreadyDeployed = deployed.filter(item => item.id === ship.id)[0];
        if (alreadyDeployed) {
            board = strategy.removeShip(board, alreadyDeployed);
            deployed = _.reject(deployed, active => active.id === ship.id)
        }

        this.setState({
            board: strategy.addShip(board, cell, ship),
            deployed: [...deployed, {cell, ...ship}],
            cell: EMPTY_CELL
        });
    };

    render() {
        const {error, board, deployed, cell, ship} = this.state;
        const strategy = OrientationStrategy[ship.orientation];

        if (error) return <Redirect to={`/error/${error}`}/>;

        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-4'>
                        <ShipyardContainer
                            ships={SHIPS}
                            selected={ship}
                            onSelectionChange={this.handleSelectionChange}/>
                    </div>
                    <div className='col-4'>
                        <Board
                            board={board}
                            ship={strategy.segments(board, cell, ship)}
                            onClick={this.handleClick}
                            onMouseEnter={this.handleMouseEnter}
                            onMouseLeave={this.handleMouseLeave}/>
                    </div>
                </div>
                <div className='col-8 mt-4'>
                    <button className='btn btn-info btn-lg float-right'
                            disabled={deployed.length !== SHIPS.length}>
                        Engage enemy
                    </button>
                </div>
            </div>
        );
    }
}

export default Game;
