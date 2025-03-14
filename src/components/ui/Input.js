import React from 'react';
import './Input.css';

const Input = ({
    type = 'text',
    label,
    name,
    id,
    value,
    onChange,
    placeholder = '',
    required = false,
    error,
    disabled = false,
    className = '',
    fullWidth = true,
}) => {
    return (
        <div className={`input-group ${fullWidth ? 'input-full-width' : ''} ${className}`}>
            {label && (
                <label className="input-label" htmlFor={id || name}>
                    {label} {required && <span className="required-mark">*</span>}
                </label>
            )}
            <input
                id={id || name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`input-field ${error ? 'input-error' : ''}`}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Input; 