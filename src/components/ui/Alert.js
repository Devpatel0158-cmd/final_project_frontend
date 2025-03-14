import React, { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({
    type = 'info',
    message,
    onClose,
    autoClose = true,
    duration = 5000,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoClose && isVisible) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        <div className={`alert alert-${type}`}>
            <div className="alert-content">{message}</div>
            <button className="alert-close" onClick={handleClose}>
                &times;
            </button>
        </div>
    );
};

export default Alert; 