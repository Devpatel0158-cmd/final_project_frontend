import React from 'react';
import './Divider.css';

const Divider = ({ text, className = '' }) => {
    return (
        <div className={`divider ${className}`}>
            {text && <span className="divider-text">{text}</span>}
        </div>
    );
};

export default Divider;
