import React from 'react';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <p>Welcome to your financial dashboard. Here you can see an overview of your expenses.</p>

            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Expenses</h3>
                    <p className="summary-amount">$0.00</p>
                </div>
                <div className="summary-card">
                    <h3>Monthly Budget</h3>
                    <p className="summary-amount">$0.00</p>
                </div>
                <div className="summary-card">
                    <h3>Remaining</h3>
                    <p className="summary-amount">$0.00</p>
                </div>
            </div>

            <div className="recent-expenses">
                <h3>Recent Expenses</h3>
                <p>No expenses recorded yet. Add your first expense to see it here.</p>
            </div>
        </div>
    );
};

export default Dashboard; 