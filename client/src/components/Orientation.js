import React from 'react';
import ORIENTATION, {isHorizontal} from '../tasks/Orientation';

const Orientation = ({value, onChange}) => {
    const toggleOrientation = () => isHorizontal(value) ? ORIENTATION.vertical : ORIENTATION.horizontal;

    return (
        <div className='form-check'>
            <input className='form-check-input'
                   type='checkbox' id='orientation'
                   value={value}
                   onChange={() => onChange(toggleOrientation())}/>
            <label className='form-check-label'
                   htmlFor='orientation'>
                Vertically
            </label>
        </div>
    );
};

export default Orientation;