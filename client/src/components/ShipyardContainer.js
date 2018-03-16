import React from 'react';
import Orientation from './Orientation';
import Shipyard from './Shipyard';

const ShipyardContainer = ({ships, selected, onSelectionChange}) => {
    return (
        <div>
            <div className='row'>
                <div className='col-10'>
                    <h4>Deploy Squadron</h4>
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
};

export default ShipyardContainer;