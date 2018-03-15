import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import fetch from '../util/fetch';

import battleship from '../img/battleship.png';

class Home extends Component {
    state = {
        game: 0
    };

    handleClick = () => {
        fetch.post('/game')
            .then(game => this.setState({game: game.id}))
            .catch(error => console.log(error));
    };

    render() {
        if (this.state.game) return <Redirect to={`/game/${this.state.game}`}/>;

        return (
            <div className='container splash'>
                <div className='row'>
                    <div className='col'>
                        <h1 className='splash-title'>BATTLESHIP</h1>
                        <img className='splash-img rounded-circle' src={battleship} alt='Battleship'/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <button className='btn btn-link splash-btn' onClick={this.handleClick}>
                            Start Game <i className='splash-icon fas fa-arrow-alt-circle-right'/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
