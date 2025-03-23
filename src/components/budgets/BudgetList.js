import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

import { BudgetContext } from '../../context/BudgetContext';
import { CategoryContext } from '../../context/CategoryContext';
import formatDate from '../../utils/formatDate';
import formatCurrency from '../../utils/formatCurrency';
import './BudgetList.css';

const BudgetList = () => {
    const { budgets, isLoading, deleteBudget } = useContext(BudgetContext);
    const { categories } = useContext(CategoryContext);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Get category name by id
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown Category';
    };

    // Handle delete confirmation
    const confirmDelete = (budgetId) => {
        setDeleteConfirm(budgetId);
    };

    // Handle delete cancellation
    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    // Handle actual deletion
    const handleDelete = async (budgetId) => {
        try {
            await deleteBudget(budgetId);
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="budget-list-loading">
                <p>Loading budgets...</p>
            </div>
        );
    }

    if (!budgets || budgets.length === 0) {
        return (
            <div className="budget-list-container">
                <div className="budget-list-header">
                    <h2>Your Budgets</h2>
                    <Link to="/budgets/new" className="add-budget-btn">
                        <FaPlus /> New Budget
                    </Link>
                </div>
                <div className="no-budgets">
                    <p>You haven't created any budgets yet. Get started by adding your first budget.</p>
                    <Link to="/budgets/new" className="btn btn-primary">
                        Create Budget
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="budget-list-container">
            <div className="budget-list-header">
                <h2>Your Budgets</h2>
                <Link to="/budgets/new" className="add-budget-btn">
                    <FaPlus /> New Budget
                </Link>
            </div>

            <div className="budget-list">
                {budgets.map((budget) => (
                    <div key={budget.id} className={`budget-item ${budget.active ? 'active' : 'inactive'}`}>
                        <div className="budget-details">
                            <h3>{budget.title}</h3>
                            <div className="budget-category">
                                {getCategoryName(budget.category)}
                            </div>
                            <div className="budget-amount">
                                {formatCurrency(budget.amount)}
                            </div>
                            <div className="budget-period">
                                <span>{formatDate(budget.startDate)}</span> to <span>{formatDate(budget.endDate)}</span>
                            </div>
                            <div className="budget-status">
                                {budget.active ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        <div className="budget-actions">
                            {deleteConfirm === budget.id ? (
                                <div className="delete-confirm">
                                    <p>Are you sure?</p>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(budget.id)}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={cancelDelete}
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to={`/budgets/edit/${budget.id}`}
                                        className="edit-btn"
                                        title="Edit Budget"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="delete-btn"
                                        onClick={() => confirmDelete(budget.id)}
                                        title="Delete Budget"
                                    >
                                        <FaTrash />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BudgetList; 