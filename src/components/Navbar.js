import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthNav from './AuthNav';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/">Expense Tracker</NavLink>
            </div>

            {isAuthenticated ? (
                <ul className="navbar-links">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/expenses" className={({ isActive }) => isActive ? 'active' : ''}>
                            Expenses
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/budget" className={({ isActive }) => isActive ? 'active' : ''}>
                            Budget
                        </NavLink>
                    </li>
                </ul>
            ) : (
                <div className="navbar-spacer"></div>
            )}

            <AuthNav />
        </nav>
    );
};

export default Navbar; 