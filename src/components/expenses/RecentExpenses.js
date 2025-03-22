import React from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../../contexts/ExpenseContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './RecentExpenses.css';

const RecentExpenses = () => {
    const { expenses, loading } = useExpenses();

    // Get the 5 most recent expenses
    const recentExpenses = expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    if (loading) {
        return (
            <Card className="recent-expenses">
                <h2>Recent Expenses</h2>
                <div className="recent-expenses-loading">
                    <Loader />
                </div>
            </Card>
        );
    }

    return (
        <Card className="recent-expenses">
            <h2>Recent Expenses</h2>

            {recentExpenses.length > 0 ? (
                <>
                    <ul className="expense-list">
                        {recentExpenses.map((expense) => (
                            <li key={expense.id} className="expense-item">
                                <div className="expense-info">
                                    <div className="expense-description">{expense.description}</div>
                                    <div className="expense-meta">
                                        <span className="expense-date">{formatDate(expense.date)}</span>
                                        <Badge color="secondary">{expense.category}</Badge>
                                    </div>
                                </div>
                                <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                            </li>
                        ))}
                    </ul>
                    <div className="view-all-expenses">
                        <Link to="/expenses">
                            <Button variant="text">View All Expenses</Button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="no-expenses">
                    <p>You haven't recorded any expenses yet.</p>
                    <Link to="/expenses/new">
                        <Button>Add Your First Expense</Button>
                    </Link>
                </div>
            )}
        </Card>
    );
};

export default RecentExpenses; 