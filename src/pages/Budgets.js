import React from 'react';
import { Link } from 'react-router-dom';
import BudgetList from '../components/budgets/BudgetList';
import './Budgets.css';

const Budgets = () => {
    return (
        <div className="budgets-page">
            <div className="budgets-container">
                <div className="page-header">
                    <div className="page-title">
                        <h1>Budget Management</h1>
                        <p>Manage your budget allocations to track your spending</p>
                    </div>
                    <Link to="/budget" className="btn btn-secondary">
                        Return to Original Budget
                    </Link>
                </div>

                <BudgetList />
            </div>
        </div>
    );
};

export default Budgets; 