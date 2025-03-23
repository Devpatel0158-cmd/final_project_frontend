import React from 'react';
import './Checkbox.css';

const Checkbox = ({
    label,
    id,
    name,
    checked,
    onChange,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`checkbox-container ${className}`}>
            <label className="checkbox-label">
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className="checkbox-input"
                    {...props}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </span>
            </label>
        </div>
    );
};

export default Checkbox; 