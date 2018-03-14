import React, {Component} from 'react';
import FormContainer from './FormContainer';
import MessageContainer from './MessageContainer';
import socket from '../util/socket';

class ChatContainer extends Component {
    state = {
        messages: []
    };

    componentDidMount() {
        socket.get('/chat/subscribe');
        socket.on('chatter', payload => this.addMessage(payload.message));
    }

    addMessage = (message) => {
        this.setState((state) => ({
            messages: [...state.messages, message]
        }));
    };

    handleSubmit = (message) => {
        socket.post('/chat', {message});
    };

    render() {
        const {messages} = this.state;

        return (
            <div className='col-4 chat bg-info'>
                <MessageContainer player={this.props.player} messages={messages}/>
                <FormContainer onSubmit={this.handleSubmit}/>
            </div>
        );
    }
}

export default ChatContainer;
