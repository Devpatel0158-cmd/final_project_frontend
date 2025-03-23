import React from 'react';
import './Badge.css';

const Badge = ({
    children,
    color = 'primary',
    size = 'medium',
    className = '',
    ...props
}) => {
    const badgeClassName = `badge badge-${color} badge-${size} ${className}`;

    return (
        <span className={badgeClassName} {...props}>
            {children}
        </span>
    );
};

export default Badge; 