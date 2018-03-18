import React from 'react';

const Message = ({value}) => <li className='list-group-item'>{value}</li>;

const MessageContainer = ({player, messages}) => (
    <div className='card message-container'>
        <div className='card-header'>
            {`Player: ${player + 1}`}
        </div>
        <ul className='list-group list-group-flush'>
            {messages.map((message, i) => <Message key={i} value={message}/>)}
        </ul>
    </div>
);

export default MessageContainer;
