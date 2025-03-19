import React from 'react';
import './SocialButton.css';

const SocialButton = ({
    provider,
    icon,
    onClick,
    className = '',
    disabled = false
}) => {
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

    return (
        <button
            type="button"
            className={`social-button social-button-${provider} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="social-button-icon">{icon}</span>}
            <span className="social-button-text">
                Continue with {providerName}
            </span>
        </button>
    );
};

export default SocialButton; 