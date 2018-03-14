import React, {Component} from 'react';
import ChatContainer from './ChatContainer';
import Board from "./Board";
import socket from '../util/socket';

class Game extends Component {
    state = {
        game: null
    };

    componentDidMount() {
        let id = this.props.match.params.id;

        socket.get(`/game/${id}`)
            .then(game => {
                this.setState({game});
                socket.on(game.room, console.log);
            });
    }

    render() {
        const {game} = this.state;
        if (!game) return null;

        return (
            <div className='row'>
                <div className='col-8'>
                    <h1>Battleship</h1>
                    <Board board={game.board[game.player].pieces}/>
                    <Board board={game.board[1 - game.player].pieces}/>
                </div>

                <ChatContainer player={game.player}/>
            </div>
        );
    }
}

export default Game;
