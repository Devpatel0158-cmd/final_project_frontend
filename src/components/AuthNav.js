import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import './AuthNav.css';

const AuthNav = () => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="auth-nav">
            {isAuthenticated ? (
                <div className="auth-nav-user">
                    <span className="user-greeting">Hello, {user?.name || 'User'}</span>
                    <Button
                        variant="outline"
                        size="small"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            ) : (
                <div className="auth-nav-links">
                    <Link to="/login">
                        <Button variant="outline" size="small">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary" size="small">Register</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AuthNav; 