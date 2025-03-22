import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as expenseService from '../services/expenseService';
import { validateExpense } from '../models/Expense';

// Create the expense context
const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalExpenses: 0,
        averageExpense: 0,
        highestExpense: 0,
        lowestExpense: 0,
        expensesByCategory: {},
        recentExpenses: []
    });

    // Load expenses from storage on component mount
    useEffect(() => {
        try {
            const storedExpenses = expenseService.getAllExpenses();
            setExpenses(storedExpenses);
            setStats(expenseService.getExpenseStats());
        } catch (err) {
            setError('Failed to load expenses');
            console.error('Error loading expenses:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Add a new expense
    const addExpense = useCallback(async (expenseData) => {
        try {
            // Validate expense data
            const { isValid, errors } = validateExpense(expenseData);
            if (!isValid) {
                return { success: false, errors };
            }

            // Add the expense
            const newExpense = expenseService.addExpense(expenseData);

            // Update state
            setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
            setStats(expenseService.getExpenseStats());

            return { success: true, expense: newExpense };
        } catch (err) {
            setError('Failed to add expense');
            console.error('Error adding expense:', err);
            return { success: false, errors: { general: 'Failed to add expense' } };
        }
    }, []);

    // Update an existing expense
    const updateExpense = useCallback(async (id, expenseData) => {
        try {
            // Validate expense data
            const { isValid, errors } = validateExpense({
                ...expenseService.getExpenseById(id),
                ...expenseData
            });

            if (!isValid) {
                return { success: false, errors };
            }

            // Update the expense
            const updatedExpense = expenseService.updateExpense(id, expenseData);

            if (!updatedExpense) {
                return { success: false, errors: { general: 'Expense not found' } };
            }

            // Update state
            setExpenses(prevExpenses => prevExpenses.map(expense =>
                expense.id === id ? updatedExpense : expense
            ));
            setStats(expenseService.getExpenseStats());

            return { success: true, expense: updatedExpense };
        } catch (err) {
            setError('Failed to update expense');
            console.error('Error updating expense:', err);
            return { success: false, errors: { general: 'Failed to update expense' } };
        }
    }, []);

    // Delete an expense
    const deleteExpense = useCallback(async (id) => {
        try {
            const isDeleted = expenseService.deleteExpense(id);

            if (!isDeleted) {
                return { success: false, error: 'Expense not found' };
            }

            // Update state
            setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
            setStats(expenseService.getExpenseStats());

            return { success: true };
        } catch (err) {
            setError('Failed to delete expense');
            console.error('Error deleting expense:', err);
            return { success: false, error: 'Failed to delete expense' };
        }
    }, []);

    // Filter expenses
    const filterExpenses = useCallback((filters) => {
        return expenseService.filterExpenses(filters);
    }, []);

    // Get expense by ID
    const getExpenseById = useCallback((id) => {
        return expenseService.getExpenseById(id);
    }, []);

    // Context value to be provided
    const contextValue = {
        expenses,
        loading,
        error,
        stats,
        addExpense,
        updateExpense,
        deleteExpense,
        filterExpenses,
        getExpenseById
    };

    return (
        <ExpenseContext.Provider value={contextValue}>
            {children}
        </ExpenseContext.Provider>
    );
};

// Custom hook for using the expense context
export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
};

export default ExpenseContext; 