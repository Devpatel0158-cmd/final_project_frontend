import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseSummary from '../components/expenses/ExpenseSummary';
import RecentExpenses from '../components/expenses/RecentExpenses';
import Button from '../components/ui/Button';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <Link to="/expenses/new">
                    <Button variant="primary">Add New Expense</Button>
                </Link>
            </div>

            <div className="dashboard-grid">
                {/* Summary section */}
                <div className="dashboard-section summary-section">
                    <ExpenseSummary />
                </div>

                {/* Recent expenses section */}
                <div className="dashboard-section recent-section">
                    <RecentExpenses />
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 