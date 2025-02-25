import React from 'react';

const Budget = () => {
    return (
        <div className="budget-container">
            <h2>Budget</h2>
            <p>Set and manage your budget targets.</p>

            <div className="budget-overview">
                <h3>Monthly Budget Overview</h3>
                <p>No budget set yet. Use the form below to create your first budget.</p>
            </div>

            <div className="budget-form-section">
                <h3>Set Budget</h3>
                <p>Form coming soon...</p>
            </div>

            <div className="category-budgets">
                <h3>Category Budgets</h3>
                <p>Define spending limits for each category to stay on track.</p>
            </div>
        </div>
    );
};

export default Budget; 