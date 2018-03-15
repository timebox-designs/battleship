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
        boardA: [],
        boardB: [],
        deployed: [],
        cell: EMPTY_CELL,
        mode: 0
    };

    componentDidMount() {
        let id = this.props.match.params.id;

        socket.get(`/game/${id}`)
            .then(game => {
                const {board, player} = game;

                this.setState({
                    boardA: withLabels(board[1 - player].pieces),
                    boardB: withLabels(board[player].pieces),
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
        let {boardB, deployed, ship} = this.state;
        const strategy = OrientationStrategy[ship.orientation];

        if (isEmptyCell(cell) || strategy.isCollision(boardB, cell, ship)) return;

        const alreadyDeployed = deployed.filter(item => item.id === ship.id)[0];
        if (alreadyDeployed) {
            boardB = strategy.removeShip(boardB, alreadyDeployed);
            deployed = _.reject(deployed, active => active.id === ship.id)
        }

        this.setState({
            boardB: strategy.addShip(boardB, cell, ship),
            deployed: [...deployed, {cell, ...ship}],
            cell: EMPTY_CELL
        });
    };

    render() {
        const {boardA, boardB, deployed, cell, ship, player, error} = this.state;
        const strategy = OrientationStrategy[ship.orientation];

        if (error) return <Redirect to={`/error/${error}`}/>;

        let mode = 0;
        if (deployed.length === SHIPS.length) mode += 1;

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
                            {(mode === 0) &&
                            <div className='offset-1 col-5'>
                                <ShipyardContainer
                                    ships={SHIPS}
                                    selected={ship}
                                    onSelectionChange={this.handleSelectionChange}/>
                            </div>}
                            {(mode === 1) &&
                            <div className='offset-1 col-5'>
                                <h4>Target acquired</h4>
                                <Board
                                    board={boardA}
                                    ship={() => ({})}
                                    onClick={this.handleClick}
                                    onMouseEnter={this.handleMouseEnter}
                                    onMouseLeave={this.handleMouseLeave}/>
                            </div>}
                            <div className='col-5'>
                                <h4>Your ships</h4>
                                <Board
                                    board={boardB}
                                    ship={strategy.segments(boardB, cell, ship)}
                                    onClick={this.handleClick}
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

/*
                <div className='row'>
                    <div className='col mt-4'>
                        <button className='btn btn-info btn-lg float-right'
                                disabled={deployed.length !== SHIPS.length}>
                            Engage enemy
                        </button>
                    </div>
                    <div className='col'>
                        <ChatContainer player={player}/>
                    </div>
                </div>
*/

export default Game;
