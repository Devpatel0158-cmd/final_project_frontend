import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudgets } from '../../contexts/BudgetsContext';
import { useCategories } from '../../contexts/CategoriesContext';
import './BudgetForm.css';

const BudgetForm = ({ budget = null }) => {
    const navigate = useNavigate();
    const { addBudget, updateBudget } = useBudgets();
    const { categories } = useCategories();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        categoryId: '',
        startDate: '',
        endDate: '',
        isActive: true
    });

    useEffect(() => {
        if (budget) {
            setFormData({
                title: budget.title,
                amount: budget.amount,
                categoryId: budget.categoryId || '',
                startDate: budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : '',
                endDate: budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : '',
                isActive: budget.isActive
            });
        }
    }, [budget]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const budgetData = {
                ...formData,
                amount: parseFloat(formData.amount),
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
            };

            if (budget) {
                await updateBudget(budget.id, budgetData);
            } else {
                await addBudget(budgetData);
            }

            navigate('/budgets');
        } catch (err) {
            setError(err.message || 'Failed to save budget');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="budget-form-container">
            <form onSubmit={handleSubmit} className="budget-form">
                <h2>{budget ? 'Edit Budget' : 'Create New Budget'}</h2>

                {error && <div className="form-error">{error}</div>}

                <div className="form-group">
                    <label htmlFor="title">Budget Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Monthly Groceries"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Budget Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="categoryId">Category (Optional)</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            min={formData.startDate}
                        />
                    </div>
                </div>

                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                    />
                    <label htmlFor="isActive">Active Budget</label>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/budgets')}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (budget ? 'Update Budget' : 'Create Budget')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BudgetForm; 