/**
 * Budget Model
 * 
 * Defines the structure and validation for budget objects
 */

import { EXPENSE_CATEGORIES } from './Expense';

/**
 * Creates a new budget object with default values
 * @returns {Object} A new budget object
 */
export const createBudget = () => ({
    id: null,
    name: '',
    amount: 0,
    period: 'monthly', // monthly, quarterly, yearly
    category: '', // Empty string means 'overall' budget
    startDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    endDate: null, // null means 'ongoing'
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
});

/**
 * Budget period options
 */
export const BUDGET_PERIODS = [
    'monthly',
    'quarterly',
    'yearly'
];

/**
 * Validates a budget object
 * @param {Object} budget - The budget to validate
 * @returns {Object} Object containing isValid flag and any validation errors
 */
export const validateBudget = (budget) => {
    const errors = {};

    // Name validation
    if (!budget.name || budget.name.trim() === '') {
        errors.name = 'Name is required';
    } else if (budget.name.length > 50) {
        errors.name = 'Name must be less than 50 characters';
    }

    // Amount validation
    if (!budget.amount || budget.amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }

    // Period validation
    if (!budget.period || !BUDGET_PERIODS.includes(budget.period)) {
        errors.period = 'Please select a valid period';
    }

    // Category validation - can be empty (for overall budget) or must be valid
    if (budget.category && !EXPENSE_CATEGORIES.includes(budget.category)) {
        errors.category = 'Please select a valid category';
    }

    // Date validation
    if (!budget.startDate) {
        errors.startDate = 'Start date is required';
    }

    // If endDate is provided, it must be after startDate
    if (budget.endDate && new Date(budget.endDate) <= new Date(budget.startDate)) {
        errors.endDate = 'End date must be after start date';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Calculate remaining budget based on expenses
 * @param {Object} budget - The budget object
 * @param {Array} expenses - Array of expense objects
 * @returns {number} The remaining budget amount
 */
export const calculateRemainingBudget = (budget, expenses) => {
    if (!budget || !expenses || !Array.isArray(expenses)) {
        return budget ? budget.amount : 0;
    }

    // Filter expenses based on category and date range
    const filteredExpenses = expenses.filter(expense => {
        // Check if the expense falls within the budget period
        const expenseDate = new Date(expense.date);
        const startDate = new Date(budget.startDate);

        let endDate;
        if (budget.endDate) {
            endDate = new Date(budget.endDate);
        } else {
            // If no end date, use current date
            endDate = new Date();
        }

        const isInDateRange = expenseDate >= startDate && expenseDate <= endDate;

        // Check if the expense matches the budget category (if specified)
        const matchesCategory = !budget.category || expense.category === budget.category;

        return isInDateRange && matchesCategory;
    });

    // Calculate total expenses
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate remaining amount
    return budget.amount - totalExpenses;
};

/**
 * Calculate budget progress percentage
 * @param {Object} budget - The budget object
 * @param {number} remainingAmount - The remaining budget amount
 * @returns {number} The budget progress percentage (0-100)
 */
export const calculateBudgetProgress = (budget, remainingAmount) => {
    if (!budget || budget.amount <= 0) {
        return 0;
    }

    const spentAmount = budget.amount - remainingAmount;
    const progressPercentage = (spentAmount / budget.amount) * 100;

    // Ensure progress is between 0 and 100
    return Math.min(Math.max(0, progressPercentage), 100);
}; 