import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import socket from '../util/socket';
import _ from 'underscore';

import ORIENTATION from '../tasks/Orientation';
import OrientationStrategy from '../tasks/OrientationStrategy';
import ChatContainer from './ChatContainer';
import ShipyardContainer from './ShipyardContainer';
import TargetLabel from './TargetLabel';
import Button from './Button';
import Board from './Board';

const EMPTY_CELL = {row: -1, col: -1};

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

const isSetup = (mode) => mode === MODE.setup;
const isPlay = (mode) => mode === MODE.play;

const isHit = (value) => value === 'X';
const isMiss = (value) => value === 'x';

const copyCoordinates = (coordinates) => coordinates.map(row => [...row]);
const copyGameBoard = (game) => game.map(board => ({...board, coordinates: copyCoordinates(board.coordinates)}));


class Game extends Component {
    state = {
        mode: MODE.setup,
        ship: {...battleship, orientation: ORIENTATION.horizontal},
        board: [],
        deployed: [],
        cell: EMPTY_CELL,
        targets: 0,
        turn: 0, // player 1
        gameOver: false
    };

    componentWillMount() {
        let id = this.props.match.params.id;

        socket.get(`/game/${id}`)
            .then(game => {
                const {board, player} = game;
                this.setState({board, player, id});
            })
            .catch(error => this.setState({error}));

        socket.on('setup', message => {
            const {player} = this.state;
            const opponent = 1 - player;

            this.setState({
                targets: message.targets[opponent],
                inPlay: message.inPlay
            });
        });

        socket.on('fire', message => {
            const {board, player, targets, turn} = this.state;
            const {cell, opponent, hitOrMiss} = message;

            const me = player === opponent;
            const boardCopy = copyGameBoard(board);

            boardCopy[(me ? player : opponent)].coordinates[cell.row][cell.col] = hitOrMiss;

            this.setState({
                board: boardCopy,
                targets: !me && isHit(hitOrMiss) ? targets - 1 : targets,
                turn: 1 - turn
            }, () => this.callGame())
        });

        socket.on('over', message => {
            // console.log(`player ${message.player} won`);
            this.setState({gameOver: true});
        });
    }

    callGame = () => {
        const {id, player, targets, inPlay} = this.state;

        if (inPlay > 1 && targets === 0) {
            socket.put(`/game/${id}/over`, {player});
        }
    };

    fireOnOpponent = (cell) => {
        const {board, player, inPlay, turn} = this.state;
        const opponent = 1 - player;

        const targetArea = board[opponent].coordinates[cell.row][cell.col];

        if (isHit(targetArea) || isMiss(targetArea)) return;

        if (turn === player && inPlay > 1) {
            socket.put(`/board/${board[opponent].id}/fire`, {cell, opponent});
        }
    };

    engageEnemy = () => {
        const {board, player} = this.state;

        socket.put(`/board/${board[player].id}`, {board: board[player]})
            .then(() => this.setState({mode: MODE.play}));
    };

    changeActiveShip = (ship) => this.setState({ship});
    activateCell = (cell) => this.setState({cell});
    clearCell = () => this.setState({cell: EMPTY_CELL});

    placeShipOnBoard = (cell) => {
        let {board, player, ship, deployed} = this.state;
        let playerBoard = board[player];

        const strategy = OrientationStrategy[ship.orientation];

        if (strategy.isCollision(playerBoard, cell, ship)) return;

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

    render() {
        const {board, deployed, cell, ship, player, error, mode, targets, gameOver} = this.state;
        const strategy = OrientationStrategy[ship.orientation];

        if (error) return <Redirect to={`/error/${error}`}/>;
        if (board.length === 0) return null;

        return (
            <div className='d-flex' style={{height: '100vh'}}>
                <section style={{width: '75vw'}}>
                    {!gameOver &&
                    <div className='container'>
                        <div className='row margin-top'>
                            <div className='offset-1 col'>
                                <h1 className='title'>
                                    BATTLESHIP
                                    <small>It's your turn</small>
                                </h1>
                            </div>
                        </div>
                        <div className='row margin-top'>
                            {isSetup(mode) &&
                            <div className='offset-1 col-5 background'>
                                <ShipyardContainer
                                    ships={SHIPS}
                                    selected={ship}
                                    onSelectionChange={this.changeActiveShip}/>
                            </div>}
                            {isPlay(mode) &&
                            <div className='offset-1 col-5'>
                                <h4>Firing Range</h4>
                                <Board
                                    board={board[1 - player]}
                                    ship={_.noop}
                                    onClick={this.fireOnOpponent}
                                    onMouseEnter={this.activateCell}
                                    onMouseLeave={this.clearCell}/>
                                <TargetLabel targets={targets}/>
                            </div>}
                            <div className='col-5'>
                                <h4>Battle Squadron</h4>
                                <Board
                                    board={board[player]}
                                    ship={isSetup(mode) ? strategy.segments(board[player], cell, ship) : _.noop}
                                    onClick={isSetup(mode) ? this.placeShipOnBoard : _.noop}
                                    onMouseEnter={this.activateCell}
                                    onMouseLeave={this.clearCell}/>
                                {isSetup(mode) &&
                                <div className='row mt-4'>
                                    <div className='offset-7 col'>
                                        <Button disabled={deployed.length === 0}
                                                onClick={this.engageEnemy}>
                                            Engage Enemy <i className='fas fa-anchor'/>
                                        </Button>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>}
                    {gameOver &&
                    <div className='container'>
                        <div className='row margin-top'>
                            <div className='col'>
                                <h1 className='title'>Game Over</h1>
                            </div>
                        </div>
                    </div>}
                </section>

                <section style={{width: '25vw', height: '100vh'}}>
                    <ChatContainer player={player}/>
                </section>
            </div>
        );
    }
}

export default Game;
