import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/">Expense Tracker</NavLink>
            </div>
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
        </nav>
    );
};

export default Navbar; 