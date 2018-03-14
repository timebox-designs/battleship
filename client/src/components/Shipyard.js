import React from 'react';
import classNames from 'classnames';
import _ from 'underscore';

const Ship = ({name, length, onClick}) => {
    return (
        <div onClick={onClick}>
            {_.range(length).map(i => <span key={i} className='segment'/>)}
            <span className='name'>{name}</span>
        </div>
    );
};

const Shipyard = ({ships, selected, onChange}) => {
    const isSelected = (ship) => ship.id === selected.id;

    return (
        <ul className='shipyard'>
            {ships.map(ship =>
                <li className={classNames({'ship': true, 'selected': isSelected(ship)})} key={ship.id}>
                    <Ship {...ship} onClick={() => onChange(ship)}/>
                </li>)}
        </ul>
    );
};

export default Shipyard;
