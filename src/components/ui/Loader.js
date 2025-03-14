import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullPage = false }) => {
    const loaderClass = `loader loader-${size} ${fullPage ? 'loader-fullpage' : ''}`;

    return (
        <div className={loaderClass}>
            <div className="loader-spinner"></div>
            {fullPage && <p className="loader-text">Loading...</p>}
        </div>
    );
};

export default Loader; 