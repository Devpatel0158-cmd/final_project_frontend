import React from 'react';
import './Form.css';

const Form = ({
    children,
    onSubmit,
    className = '',
    noValidate = true
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
    };

    return (
        <form
            className={`custom-form ${className}`}
            onSubmit={handleSubmit}
            noValidate={noValidate}
        >
            {children}
        </form>
    );
};

export default Form; 