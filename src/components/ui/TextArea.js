import React from 'react';
import './TextArea.css';

const TextArea = ({
    label,
    id,
    name,
    value,
    onChange,
    placeholder = '',
    rows = 4,
    required = false,
    error = null,
    disabled = false,
    className = '',
    ...props
}) => {
    const textareaClassName = `form-textarea ${error ? 'has-error' : ''} ${className}`;

    return (
        <div className="textarea-container">
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}
            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={textareaClassName}
                required={required}
                disabled={disabled}
                {...props}
            />
        </div>
    );
};

export default TextArea; 