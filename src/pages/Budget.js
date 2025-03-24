import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBudgets } from '../contexts/BudgetContext';
import { formatCurrency } from '../utils/formatters';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './Budget.css';

const Budget = () => {
    const {
        budgets,
        loading,
        error,
        getAllBudgets,
        deleteBudget,
        toggleBudgetActive
    } = useBudgets();

    useEffect(() => {
        getAllBudgets();
    }, [getAllBudgets]);

    if (loading) {
        return <div className="loading">Loading budgets...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="budget-page">
            <div className="budget-header">
                <h1>Budget Management</h1>
                <div className="budget-actions">
                    <Link to="/budgets" className="btn btn-secondary">
                        Try New Budgets Interface
                    </Link>
                    <Link to="/budget/new" className="btn btn-primary">
                        <FaPlus /> Add Budget
                    </Link>
                </div>
            </div>

            {budgets.length === 0 ? (
                <div className="no-budgets">
                    <p>No budgets found. Create your first budget to start tracking your spending.</p>
                </div>
            ) : (
                <div className="budget-list">
                    {budgets.map((budget) => (
                        <div key={budget.id} className={`budget-card ${budget.active ? 'active' : 'inactive'}`}>
                            <div className="budget-card-header">
                                <h2>{budget.name}</h2>
                                <div className="budget-actions">
                                    <button
                                        className="btn-icon toggle"
                                        onClick={() => toggleBudgetActive(budget.id)}
                                        title={budget.active ? "Deactivate Budget" : "Activate Budget"}
                                    >
                                        {budget.active ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                    <Link
                                        to={`/budget/edit/${budget.id}`}
                                        className="btn-icon edit"
                                        title="Edit Budget"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="btn-icon delete"
                                        onClick={() => deleteBudget(budget.id)}
                                        title="Delete Budget"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            <div className="budget-amount">
                                <div className="budget-amount-details">
                                    <span>Budget: {formatCurrency(budget.amount)}</span>
                                    <span>Remaining: {formatCurrency(budget.remaining)}</span>
                                </div>
                                <div className="budget-category">
                                    {budget.category || 'All Categories'}
                                </div>
                            </div>

                            <div className="budget-progress-container">
                                <div
                                    className="budget-progress-bar"
                                    style={{
                                        width: `${Math.min(100, budget.progressPercentage)}%`,
                                        backgroundColor: budget.progressPercentage > 100 ? 'var(--color-danger)' :
                                            budget.progressPercentage > 75 ? 'var(--color-warning)' :
                                                'var(--color-primary)'
                                    }}
                                ></div>
                            </div>

                            <div className="budget-status">
                                <span className="budget-percentage">
                                    {Math.round(budget.progressPercentage)}% used
                                </span>
                                <span className="budget-dates">
                                    {budget.startDate && budget.endDate ? (
                                        `${new Date(budget.startDate).toLocaleDateString()} - ${new Date(budget.endDate).toLocaleDateString()}`
                                    ) : (
                                        'No date range'
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Budget; 