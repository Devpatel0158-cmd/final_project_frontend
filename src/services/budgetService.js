import { getFromStorage, saveToStorage } from '../utils/storageUtils';
import { createBudget } from '../models/Budget';

// Storage key for budgets
const BUDGETS_STORAGE_KEY = 'expense_tracker_budgets';

/**
 * Get all budgets from local storage
 * @returns {Array} Array of budget objects
 */
export const getAllBudgets = () => {
    return getFromStorage(BUDGETS_STORAGE_KEY, []);
};

/**
 * Get a budget by ID
 * @param {string|number} id - The budget ID
 * @returns {Object|null} The budget object or null if not found
 */
export const getBudgetById = (id) => {
    const budgets = getAllBudgets();
    return budgets.find(budget => budget.id === id) || null;
};

/**
 * Get active budgets
 * @returns {Array} Array of active budget objects
 */
export const getActiveBudgets = () => {
    const budgets = getAllBudgets();
    return budgets.filter(budget => budget.isActive);
};

/**
 * Add a new budget
 * @param {Object} budgetData - The budget data to add
 * @returns {Object} The added budget
 */
export const addBudget = (budgetData) => {
    const budgets = getAllBudgets();

    // Create a new budget with the provided data
    const newBudget = {
        ...createBudget(),
        ...budgetData,
        id: Date.now().toString(), // Use timestamp as ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add the new budget to the array
    const updatedBudgets = [newBudget, ...budgets];

    // Save to local storage
    saveToStorage(BUDGETS_STORAGE_KEY, updatedBudgets);

    return newBudget;
};

/**
 * Update an existing budget
 * @param {string|number} id - The ID of the budget to update
 * @param {Object} budgetData - The updated budget data
 * @returns {Object|null} The updated budget or null if not found
 */
export const updateBudget = (id, budgetData) => {
    const budgets = getAllBudgets();

    // Find the index of the budget with the given ID
    const index = budgets.findIndex(budget => budget.id === id);

    // If budget not found, return null
    if (index === -1) {
        return null;
    }

    // Update the budget
    const updatedBudget = {
        ...budgets[index],
        ...budgetData,
        updatedAt: new Date().toISOString()
    };

    // Create a new array with the updated budget
    const updatedBudgets = [
        ...budgets.slice(0, index),
        updatedBudget,
        ...budgets.slice(index + 1)
    ];

    // Save to local storage
    saveToStorage(BUDGETS_STORAGE_KEY, updatedBudgets);

    return updatedBudget;
};

/**
 * Delete a budget by ID
 * @param {string|number} id - The ID of the budget to delete
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteBudget = (id) => {
    const budgets = getAllBudgets();

    // Find the index of the budget with the given ID
    const index = budgets.findIndex(budget => budget.id === id);

    // If budget not found, return false
    if (index === -1) {
        return false;
    }

    // Create a new array without the deleted budget
    const updatedBudgets = [
        ...budgets.slice(0, index),
        ...budgets.slice(index + 1)
    ];

    // Save to local storage
    saveToStorage(BUDGETS_STORAGE_KEY, updatedBudgets);

    return true;
};

/**
 * Activate or deactivate a budget
 * @param {string|number} id - The ID of the budget
 * @param {boolean} isActive - Whether to activate or deactivate
 * @returns {Object|null} The updated budget or null if not found
 */
export const setBudgetActive = (id, isActive) => {
    return updateBudget(id, { isActive });
}; 