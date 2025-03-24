import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBudgets } from '../contexts/BudgetContext';
import BudgetForm from '../components/budgets/BudgetForm';
import './BudgetFormPages.css';

const EditBudgetNew = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getBudgetById, loading } = useBudgets();
    const [budget, setBudget] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const budgetData = getBudgetById(id);

                if (!budgetData) {
                    setNotFound(true);
                    return;
                }

                setBudget(budgetData);
            } catch (error) {
                console.error('Error fetching budget:', error);
                setNotFound(true);
            }
        };

        fetchBudget();
    }, [id, getBudgetById]);

    if (loading) {
        return (
            <div className="budget-form-page">
                <div className="loading">Loading budget information...</div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="budget-form-page">
                <div className="not-found">
                    <h2>Budget Not Found</h2>
                    <p>The budget you are trying to edit could not be found.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/budgets')}
                    >
                        Back to Budgets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="budget-form-page">
            <div className="budget-form-container">
                <div className="page-title">
                    <h1>Edit Budget</h1>
                    <p>Update your budget information</p>
                </div>

                {budget && <BudgetForm budget={budget} />}
            </div>
        </div>
    );
};

export default EditBudgetNew; 