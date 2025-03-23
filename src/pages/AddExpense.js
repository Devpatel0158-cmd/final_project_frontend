import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/expenses/ExpenseForm';

const AddExpense = () => {
    const navigate = useNavigate();

    const handleSave = () => {
        navigate('/expenses');
    };

    const handleCancel = () => {
        navigate('/expenses');
    };

    return (
        <ExpenseForm
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
};

export default AddExpense; 