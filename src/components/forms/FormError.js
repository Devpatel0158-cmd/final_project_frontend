import React from 'react';
import './FormError.css';

const FormError = ({ children }) => {
    if (!children) return null;

    return (
        <div className="form-error">
            {children}
        </div>
    );
};

export default FormError; 