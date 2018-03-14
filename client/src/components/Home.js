import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import fetch from '../util/fetch';

class Home extends Component {
    state = {
        game: 0
    };

    handleClick = () => {
        fetch.post('/game')
            .then(game => this.setState({game: game.id}))
            .catch(error => console.error(error));
    };

    render() {
        if (this.state.game) return <Redirect to={`/game/${this.state.game}`}/>;

        return (
            <div className='row'>
                <div className='col'>
                    <button className='btn btn-primary' onClick={this.handleClick}>Start New Game</button>
                </div>
            </div>
        );
    }
}

export default Home;
