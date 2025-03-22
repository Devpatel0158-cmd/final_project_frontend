import React from 'react';
import { useExpenses } from '../../contexts/ExpenseContext';
import Card from '../ui/Card';
import Loader from '../ui/Loader';
import { formatCurrency } from '../../utils/currencyUtils';
import './ExpenseSummary.css';

const ExpenseSummary = () => {
    const { stats, loading } = useExpenses();

    if (loading) {
        return (
            <div className="expense-summary-loading">
                <Loader size="medium" />
            </div>
        );
    }

    return (
        <div className="expense-summary">
            <Card title="Expense Summary" className="summary-card">
                <div className="summary-grid">
                    <div className="summary-item">
                        <div className="summary-label">Total Expenses</div>
                        <div className="summary-value">{formatCurrency(stats.totalExpenses)}</div>
                    </div>

                    <div className="summary-item">
                        <div className="summary-label">Average Expense</div>
                        <div className="summary-value">{formatCurrency(stats.averageExpense)}</div>
                    </div>

                    <div className="summary-item">
                        <div className="summary-label">Highest Expense</div>
                        <div className="summary-value">{formatCurrency(stats.highestExpense)}</div>
                    </div>

                    <div className="summary-item">
                        <div className="summary-label">Lowest Expense</div>
                        <div className="summary-value">{formatCurrency(stats.lowestExpense)}</div>
                    </div>
                </div>

                {Object.keys(stats.expensesByCategory).length > 0 ? (
                    <div className="category-breakdown">
                        <h3>Category Breakdown</h3>
                        <ul className="category-list">
                            {Object.entries(stats.expensesByCategory)
                                .sort(([, amountA], [, amountB]) => amountB - amountA)
                                .map(([category, amount]) => (
                                    <li key={category} className="category-item">
                                        <span className="category-name">{category}</span>
                                        <span className="category-amount">{formatCurrency(amount)}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                ) : (
                    <div className="no-categories">
                        <p>No expense categories recorded yet.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ExpenseSummary; 