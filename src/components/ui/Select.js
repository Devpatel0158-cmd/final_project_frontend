import React from 'react';
import './Select.css';

const Select = ({
    label,
    id,
    name,
    value,
    onChange,
    children,
    required = false,
    error = null,
    disabled = false,
    className = '',
    ...props
}) => {
    const selectClassName = `form-select ${error ? 'has-error' : ''} ${className}`;

    return (
        <div className="select-container">
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={selectClassName}
                required={required}
                disabled={disabled}
                {...props}
            >
                {children}
            </select>
        </div>
    );
};

export default Select; 