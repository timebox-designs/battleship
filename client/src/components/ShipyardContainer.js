import React from 'react';
import Orientation from './Orientation';
import Shipyard from './Shipyard';

const ShipyardContainer = ({ships, selected, onSelectionChange}) => (
    <div>
        <div className='row'>
            <div className='col-10'>
                <h4 className='_tooltip'>
                    Deploy Squadron <sup><i className='fas fa-info-circle'/></sup>
                    <small className="_tooltiptext font-weight-light">Unlike the board game, only one ship is required to play</small>
                </h4>

                <Shipyard
                    ships={ships}
                    selected={selected}
                    onChange={(ship) => onSelectionChange({...ship, orientation: selected.orientation})}/>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
                <Orientation
                    value={selected.orientation}
                    onChange={(orientation) => onSelectionChange({...selected, orientation})}/>
            </div>
        </div>
    </div>
);

export default ShipyardContainer;
