import React from 'react';

const Expenses = () => {
    return (
        <div className="expenses-container">
            <h2>Expenses</h2>
            <p>Track and manage all your expenses here.</p>

            <div className="add-expense-section">
                <h3>Add New Expense</h3>
                <p>Form coming soon...</p>
            </div>

            <div className="expenses-list-section">
                <h3>Your Expenses</h3>
                <p>No expenses found. Add your first expense using the form above.</p>
            </div>
        </div>
    );
};

export default Expenses; 