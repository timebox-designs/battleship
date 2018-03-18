import React from 'react';

const TargetLabel = ({targets}) => (
    <div className='targets'>
        Targets acquired <span className="badge badge-pill badge-dark">{targets}</span>
    </div>
);

export default TargetLabel;
