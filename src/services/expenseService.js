import { getFromStorage, saveToStorage } from '../utils/storageUtils';
import { createExpense } from '../models/Expense';

// Storage key for expenses
const EXPENSES_STORAGE_KEY = 'expense_tracker_expenses';

/**
 * Get all expenses from local storage
 * @returns {Array} Array of expense objects
 */
export const getAllExpenses = () => {
    return getFromStorage(EXPENSES_STORAGE_KEY, []);
};

/**
 * Get an expense by ID
 * @param {string|number} id - The expense ID
 * @returns {Object|null} The expense object or null if not found
 */
export const getExpenseById = (id) => {
    const expenses = getAllExpenses();
    return expenses.find(expense => expense.id === id) || null;
};

/**
 * Add a new expense
 * @param {Object} expenseData - The expense data to add
 * @returns {Object} The added expense
 */
export const addExpense = (expenseData) => {
    const expenses = getAllExpenses();

    // Create a new expense with the provided data
    const newExpense = {
        ...createExpense(),
        ...expenseData,
        id: Date.now().toString(), // Use timestamp as ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add the new expense to the array
    const updatedExpenses = [newExpense, ...expenses];

    // Save to local storage
    saveToStorage(EXPENSES_STORAGE_KEY, updatedExpenses);

    return newExpense;
};

/**
 * Update an existing expense
 * @param {string|number} id - The ID of the expense to update
 * @param {Object} expenseData - The updated expense data
 * @returns {Object|null} The updated expense or null if not found
 */
export const updateExpense = (id, expenseData) => {
    const expenses = getAllExpenses();

    // Find the index of the expense with the given ID
    const index = expenses.findIndex(expense => expense.id === id);

    // If expense not found, return null
    if (index === -1) {
        return null;
    }

    // Update the expense
    const updatedExpense = {
        ...expenses[index],
        ...expenseData,
        updatedAt: new Date().toISOString()
    };

    // Create a new array with the updated expense
    const updatedExpenses = [
        ...expenses.slice(0, index),
        updatedExpense,
        ...expenses.slice(index + 1)
    ];

    // Save to local storage
    saveToStorage(EXPENSES_STORAGE_KEY, updatedExpenses);

    return updatedExpense;
};

/**
 * Delete an expense by ID
 * @param {string|number} id - The ID of the expense to delete
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteExpense = (id) => {
    const expenses = getAllExpenses();

    // Find the index of the expense with the given ID
    const index = expenses.findIndex(expense => expense.id === id);

    // If expense not found, return false
    if (index === -1) {
        return false;
    }

    // Create a new array without the deleted expense
    const updatedExpenses = [
        ...expenses.slice(0, index),
        ...expenses.slice(index + 1)
    ];

    // Save to local storage
    saveToStorage(EXPENSES_STORAGE_KEY, updatedExpenses);

    return true;
};

/**
 * Filter expenses based on criteria
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered expenses
 */
export const filterExpenses = (filters = {}) => {
    let expenses = getAllExpenses();

    // Filter by category
    if (filters.category) {
        expenses = expenses.filter(expense => expense.category === filters.category);
    }

    // Filter by date range
    if (filters.startDate) {
        expenses = expenses.filter(expense => new Date(expense.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
        expenses = expenses.filter(expense => new Date(expense.date) <= new Date(filters.endDate));
    }

    // Filter by amount range
    if (filters.minAmount !== undefined) {
        expenses = expenses.filter(expense => expense.amount >= filters.minAmount);
    }

    if (filters.maxAmount !== undefined) {
        expenses = expenses.filter(expense => expense.amount <= filters.maxAmount);
    }

    // Filter by search term (description or notes)
    if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        expenses = expenses.filter(expense =>
            expense.description.toLowerCase().includes(searchTermLower) ||
            (expense.notes && expense.notes.toLowerCase().includes(searchTermLower))
        );
    }

    // Sort expenses
    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'date':
                expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'amount':
                expenses.sort((a, b) => b.amount - a.amount);
                break;
            case 'category':
                expenses.sort((a, b) => a.category.localeCompare(b.category));
                break;
            default:
                // By default, sort by most recent
                expenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    } else {
        // Default sort by date (newest first)
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return expenses;
};

/**
 * Get expense statistics
 * @returns {Object} Object with expense statistics
 */
export const getExpenseStats = () => {
    const expenses = getAllExpenses();

    if (expenses.length === 0) {
        return {
            totalExpenses: 0,
            averageExpense: 0,
            highestExpense: 0,
            lowestExpense: 0,
            expensesByCategory: {},
            recentExpenses: []
        };
    }

    // Calculate total
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate average
    const averageExpense = totalExpenses / expenses.length;

    // Find highest and lowest
    const highestExpense = Math.max(...expenses.map(expense => expense.amount));
    const lowestExpense = Math.min(...expenses.map(expense => expense.amount));

    // Group by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
    }, {});

    // Get recent expenses (last 5)
    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return {
        totalExpenses,
        averageExpense,
        highestExpense,
        lowestExpense,
        expensesByCategory,
        recentExpenses
    };
}; 