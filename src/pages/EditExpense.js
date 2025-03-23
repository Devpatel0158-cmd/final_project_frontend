import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/expenses/ExpenseForm';

const EditExpense = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSave = () => {
        navigate('/expenses');
    };

    const handleCancel = () => {
        navigate('/expenses');
    };

    return (
        <ExpenseForm
            expenseId={id}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
};

export default EditExpense; 