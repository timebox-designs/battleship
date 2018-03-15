import React from 'react';
import Home from './Home';
import Game from './Game';
import Error from './Error';
import {Route, Switch} from 'react-router-dom'

const App = () => {
    return (
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/game/:id' component={Game}/>
            <Route path='/error/:error' component={Error}/>
        </Switch>
    );
};

export default App;
