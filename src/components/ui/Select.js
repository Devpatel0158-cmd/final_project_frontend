import React from 'react';
import './Select.css';

const Select = ({
    label,
    name,
    id,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    required = false,
    error,
    disabled = false,
    className = '',
    fullWidth = true,
}) => {
    return (
        <div className={`select-group ${fullWidth ? 'select-full-width' : ''} ${className}`}>
            {label && (
                <label className="select-label" htmlFor={id || name}>
                    {label} {required && <span className="required-mark">*</span>}
                </label>
            )}
            <select
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`select-field ${error ? 'select-error' : ''}`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Select; 