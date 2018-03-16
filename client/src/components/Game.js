import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import socket from '../util/socket';
import _ from 'underscore';

import ORIENTATION from '../tasks/Orientation';
import OrientationStrategy from '../tasks/OrientationStrategy';
import ChatContainer from './ChatContainer';
import ShipyardContainer from './ShipyardContainer';
import Board from './Board';

const EMPTY_CELL = {row: -1, col: -1};

const isEmptyCell = (cell) => cell.row === EMPTY_CELL.row && cell.col === EMPTY_CELL.col;
const isValidCell = (cell) => cell.row !== EMPTY_CELL.row && cell.col !== EMPTY_CELL.col;

const SHIPS = [
    {id: 0, name: 'Aircraft Carrier', length: 5},
    {id: 1, name: 'Battleship', length: 4},
    {id: 2, name: 'Destroyer', length: 3},
    {id: 3, name: 'Submarine', length: 3},
    {id: 4, name: 'Patrol Boat', length: 2}
];

const battleship = SHIPS[1];

const MODE = {
    setup: 'setup',
    play: 'play'
};

class Game extends Component {
    state = {
        ship: {...battleship, orientation: ORIENTATION.horizontal},
        board: [],
        deployed: [],
        cell: EMPTY_CELL,
        mode: MODE.setup
    };

    componentDidMount() {
        let id = this.props.match.params.id;

        socket.get(`/game/${id}`)
            .then(game => {
                const {board, player} = game;

                this.setState({board, player});
                socket.on(game.room, console.log);
            })
            .catch(error => this.setState({error}));
    }

    handleSelectionChange = (ship) => this.setState({ship});
    handleMouseEnter = (cell) => isValidCell(cell) && this.setState({cell});
    handleMouseLeave = () => this.setState({cell: EMPTY_CELL});

    handleEngageClick = () => {
        const {board, player} = this.state;
        const playerBoard = board[player];

        socket.post(`/board/${playerBoard.id}`, {board: playerBoard})
            .then(() => {
                this.setState({mode: MODE.play});
            });
    };

    handleClick = (cell) => {
        let {board, player, ship, deployed} = this.state;
        let playerBoard = board[player];

        const strategy = OrientationStrategy[ship.orientation];

        if (isEmptyCell(cell) || strategy.isCollision(playerBoard, cell, ship)) return;

        const alreadyDeployed = deployed.filter(item => item.id === ship.id)[0];
        if (alreadyDeployed) {
            playerBoard = strategy.removeShip(playerBoard, alreadyDeployed);
            deployed = _.reject(deployed, active => active.id === ship.id)
        }

        playerBoard = strategy.addShip(playerBoard, cell, ship);

        this.setState({
            board: player === 0 ? [playerBoard, board[1]] : [board[0], playerBoard],
            deployed: [...deployed, {cell, ...ship}],
            cell: EMPTY_CELL
        });
    };

    handleFireClick = (cell) => {
        if (!isValidCell(cell)) return;

        console.log('fire on cell', cell);
    };

    render() {
        const {board, deployed, cell, ship, player, error, mode} = this.state;
        const strategy = OrientationStrategy[ship.orientation];

        if (error) return <Redirect to={`/error/${error}`}/>;
        if (board.length === 0) return null;

        return (
            <div className='d-flex' style={{height: '100vh'}}>
                <section style={{width: '75vw'}}>
                    <div className='container'>
                        <div className='row' style={{marginTop: '4em'}}>
                            <div className='offset-1 col'>
                                <h1 className='title'>BATTLESHIP</h1>
                            </div>
                        </div>
                        <div className='row' style={{marginTop: '4em'}}>
                            {(mode === MODE.setup) &&
                            <div className='offset-1 col-5'>
                                <ShipyardContainer
                                    ships={SHIPS}
                                    selected={ship}
                                    onSelectionChange={this.handleSelectionChange}/>
                                <button className='btn btn-primary float-right'
                                        disabled={deployed.length === 0}
                                        onClick={this.handleEngageClick}>
                                    Engage Enemy <i className='fas fa-anchor'/>
                                </button>
                            </div>}
                            {(mode === MODE.play) &&
                            <div className='offset-1 col-5'>
                                <h4>Target acquired</h4>
                                <Board
                                    board={board[1 - player]}
                                    ship={() => ({})}
                                    onClick={this.handleFireClick}
                                    onMouseEnter={this.handleMouseEnter}
                                    onMouseLeave={this.handleMouseLeave}/>
                            </div>}
                            <div className='col-5'>
                                <h4>Battle Squadron</h4>
                                <Board
                                    board={board[player]}
                                    ship={mode === MODE.setup ? strategy.segments(board[player], cell, ship) : () => ({})}
                                    onClick={mode === MODE.setup ? this.handleClick : () => ({})}
                                    onMouseEnter={this.handleMouseEnter}
                                    onMouseLeave={this.handleMouseLeave}/>
                            </div>
                        </div>
                    </div>
                </section>

                <section style={{width: '25vw', height: '100vh'}}>
                    <ChatContainer player={player}/>
                </section>
            </div>
        );
    }
}

export default Game;
