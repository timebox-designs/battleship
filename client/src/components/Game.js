import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import socket from '../util/socket';
import _ from 'underscore';

import ORIENTATION from '../tasks/Orientation';
import OrientationStrategy from '../tasks/OrientationStrategy';
import ChatContainer from './ChatContainer';
import ShipyardContainer from './ShipyardContainer';
import Board from './Board';

const EMPTY_CELL = {row: 0, col: 0};

const LABLES = 'ABCDEFGH'.split('');
const withLabels = (board) => [LABLES, ...board].map((row, i) => [i, ...row]);
const isEmptyCell = (cell) => cell.row === 0 && cell.col === 0;

const SHIPS = [
    {id: 0, name: 'Aircraft Carrier', length: 5},
    {id: 1, name: 'Battleship', length: 4},
    {id: 2, name: 'Destroyer', length: 3},
    {id: 3, name: 'Submarine', length: 3},
    {id: 4, name: 'Patrol Boat', length: 2}
];

const battleship = SHIPS[1];

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
                const {board, player} = game;

                this.setState({
                    board: withLabels(board[player].pieces),
                    player: game.player
                });

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
        const {board, deployed, cell, ship, player, error} = this.state;
        const strategy = OrientationStrategy[ship.orientation];

        if (error) return <Redirect to={`/error/${error}`}/>;

        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-8'>
                        <div className='row'>
                            <div className='col'>
                                <ShipyardContainer
                                    ships={SHIPS}
                                    selected={ship}
                                    onSelectionChange={this.handleSelectionChange}/>
                            </div>
                            <div className='col'>
                                <Board
                                    board={board}
                                    ship={strategy.segments(board, cell, ship)}
                                    onClick={this.handleClick}
                                    onMouseEnter={this.handleMouseEnter}
                                    onMouseLeave={this.handleMouseLeave}/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col mt-4'>
                                <button className='btn btn-info btn-lg float-right'
                                        disabled={deployed.length !== SHIPS.length}>
                                    Engage enemy
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <ChatContainer player={player}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
