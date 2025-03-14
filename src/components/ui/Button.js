import React from 'react';
import './Button.css';

const Button = ({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    className = ''
}) => {
    const buttonClasses = [
        'custom-button',
        `button-${variant}`,
        `button-${size}`,
        fullWidth ? 'button-full-width' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button; 