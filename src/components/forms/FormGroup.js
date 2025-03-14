import React from 'react';
import './FormGroup.css';

const FormGroup = ({ children, className = '' }) => {
    return <div className={`form-group ${className}`}>{children}</div>;
};

export default FormGroup; 