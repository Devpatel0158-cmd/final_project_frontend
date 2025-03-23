import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExpenses } from '../contexts/ExpenseContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { EXPENSE_CATEGORIES } from '../models/Expense';
import { formatCurrency, formatDate } from '../utils/formatters';
import './Expenses.css';

const Expenses = () => {
    const { expenses, loading, deleteExpense } = useExpenses();
    const navigate = useNavigate();

    // Filtering state
    const [filters, setFilters] = useState({
        searchTerm: '',
        category: '',
        sortBy: 'date'
    });

    // Filtered expenses
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    // Apply filters
    useEffect(() => {
        let result = [...expenses];

        // Filter by search term
        if (filters.searchTerm.trim()) {
            const searchLower = filters.searchTerm.toLowerCase();
            result = result.filter(
                expense =>
                    expense.description.toLowerCase().includes(searchLower) ||
                    expense.notes?.toLowerCase().includes(searchLower)
            );
        }

        // Filter by category
        if (filters.category) {
            result = result.filter(expense => expense.category === filters.category);
        }

        // Sort expenses
        if (filters.sortBy === 'date') {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (filters.sortBy === 'amount') {
            result.sort((a, b) => b.amount - a.amount);
        } else if (filters.sortBy === 'category') {
            result.sort((a, b) => a.category.localeCompare(b.category));
        }

        setFilteredExpenses(result);
    }, [expenses, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            searchTerm: '',
            category: '',
            sortBy: 'date'
        });
    };

    const handleEdit = (id) => {
        navigate(`/expenses/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            const result = await deleteExpense(id);
            if (!result.success) {
                alert('Failed to delete expense. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="expenses-loading">
                <Loader size="large" />
            </div>
        );
    }

    return (
        <div className="expenses-container">
            <div className="expenses-header">
                <h1>Expenses</h1>
                <Link to="/expenses/new">
                    <Button variant="primary">Add New Expense</Button>
                </Link>
            </div>

            <Card className="filter-card">
                <div className="filters-container">
                    <div className="filter-group">
                        <Input
                            type="text"
                            name="searchTerm"
                            placeholder="Search expenses..."
                            value={filters.searchTerm}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-group">
                        <Select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Categories</option>
                            {EXPENSE_CATEGORIES.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="filter-group">
                        <Select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="category">Sort by Category</option>
                        </Select>
                    </div>

                    <Button
                        variant="outline"
                        size="small"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                </div>
            </Card>

            {filteredExpenses.length > 0 ? (
                <Card className="expenses-list-card">
                    <ul className="expenses-list">
                        {filteredExpenses.map(expense => (
                            <li key={expense.id} className="expense-item">
                                <div className="expense-details">
                                    <div className="expense-primary">
                                        <div className="expense-description">{expense.description}</div>
                                        <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                                    </div>

                                    <div className="expense-secondary">
                                        <div className="expense-meta">
                                            <span className="expense-date">{formatDate(expense.date)}</span>
                                            <Badge color="secondary">{expense.category}</Badge>
                                            {expense.isRecurring && (
                                                <Badge color="info">Recurring</Badge>
                                            )}
                                        </div>

                                        <div className="expense-actions">
                                            <Button
                                                variant="outline"
                                                size="small"
                                                onClick={() => handleEdit(expense.id)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="small"
                                                onClick={() => handleDelete(expense.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            ) : (
                <Card className="no-expenses-card">
                    <div className="no-expenses">
                        <h3>No expenses found</h3>
                        {filters.searchTerm || filters.category ? (
                            <p>Try changing or clearing your filters</p>
                        ) : (
                            <p>Start tracking your expenses by adding your first one</p>
                        )}

                        {(!filters.searchTerm && !filters.category) && (
                            <Link to="/expenses/new">
                                <Button variant="primary">Add New Expense</Button>
                            </Link>
                        )}

                        {(filters.searchTerm || filters.category) && (
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Expenses; 