import React from 'react';
import Home from './Home';
import Game from './Game';
import {Route, Switch} from 'react-router-dom'

const App = () => {
    return (
        <div className='container game'>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/game/:id' component={Game}/>
            </Switch>
        </div>
    );
};

export default App;
