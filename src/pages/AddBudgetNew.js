import React from 'react';
import BudgetForm from '../components/budgets/BudgetForm';
import './BudgetFormPages.css';

const AddBudgetNew = () => {
    return (
        <div className="budget-form-page">
            <div className="budget-form-container">
                <div className="page-title">
                    <h1>Create New Budget</h1>
                    <p>Set up a budget to help track your spending</p>
                </div>

                <BudgetForm />
            </div>
        </div>
    );
};

export default AddBudgetNew; 