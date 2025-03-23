import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as budgetService from '../services/budgetService';
import { validateBudget, calculateRemainingBudget, calculateBudgetProgress } from '../models/Budget';
import { useExpenses } from './ExpenseContext';

// Create the budget context
const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
    const { expenses } = useExpenses();

    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Compute budgets with additional calculated properties
    const budgetsWithCalculations = budgets.map(budget => {
        const remainingAmount = calculateRemainingBudget(budget, expenses);
        const progressPercentage = calculateBudgetProgress(budget, remainingAmount);

        return {
            ...budget,
            remainingAmount,
            progressPercentage,
            isOverBudget: remainingAmount < 0
        };
    });

    // Load budgets from storage on component mount
    useEffect(() => {
        try {
            const storedBudgets = budgetService.getAllBudgets();
            setBudgets(storedBudgets);
        } catch (err) {
            setError('Failed to load budgets');
            console.error('Error loading budgets:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Recalculate budgets when expenses change
    useEffect(() => {
        // No need to fetch budgets again, just trigger a re-render
        // to recalculate the computed properties
        setBudgets(prevBudgets => [...prevBudgets]);
    }, [expenses]);

    // Add a new budget
    const addBudget = useCallback(async (budgetData) => {
        try {
            // Validate budget data
            const { isValid, errors } = validateBudget(budgetData);
            if (!isValid) {
                return { success: false, errors };
            }

            // Add the budget
            const newBudget = budgetService.addBudget(budgetData);

            // Update state
            setBudgets(prevBudgets => [newBudget, ...prevBudgets]);

            return { success: true, budget: newBudget };
        } catch (err) {
            setError('Failed to add budget');
            console.error('Error adding budget:', err);
            return { success: false, errors: { general: 'Failed to add budget' } };
        }
    }, []);

    // Update an existing budget
    const updateBudget = useCallback(async (id, budgetData) => {
        try {
            // Validate budget data
            const { isValid, errors } = validateBudget({
                ...budgetService.getBudgetById(id),
                ...budgetData
            });

            if (!isValid) {
                return { success: false, errors };
            }

            // Update the budget
            const updatedBudget = budgetService.updateBudget(id, budgetData);

            if (!updatedBudget) {
                return { success: false, errors: { general: 'Budget not found' } };
            }

            // Update state
            setBudgets(prevBudgets => prevBudgets.map(budget =>
                budget.id === id ? updatedBudget : budget
            ));

            return { success: true, budget: updatedBudget };
        } catch (err) {
            setError('Failed to update budget');
            console.error('Error updating budget:', err);
            return { success: false, errors: { general: 'Failed to update budget' } };
        }
    }, []);

    // Delete a budget
    const deleteBudget = useCallback(async (id) => {
        try {
            const isDeleted = budgetService.deleteBudget(id);

            if (!isDeleted) {
                return { success: false, error: 'Budget not found' };
            }

            // Update state
            setBudgets(prevBudgets => prevBudgets.filter(budget => budget.id !== id));

            return { success: true };
        } catch (err) {
            setError('Failed to delete budget');
            console.error('Error deleting budget:', err);
            return { success: false, error: 'Failed to delete budget' };
        }
    }, []);

    // Toggle budget active status
    const toggleBudgetActive = useCallback(async (id) => {
        try {
            const budget = budgetService.getBudgetById(id);

            if (!budget) {
                return { success: false, error: 'Budget not found' };
            }

            const updatedBudget = budgetService.setBudgetActive(id, !budget.isActive);

            // Update state
            setBudgets(prevBudgets => prevBudgets.map(budget =>
                budget.id === id ? updatedBudget : budget
            ));

            return { success: true, budget: updatedBudget };
        } catch (err) {
            setError('Failed to toggle budget status');
            console.error('Error toggling budget status:', err);
            return { success: false, error: 'Failed to toggle budget status' };
        }
    }, []);

    // Get budget by ID
    const getBudgetById = useCallback((id) => {
        // Find the budget in the state (to get the calculated properties)
        return budgetsWithCalculations.find(budget => budget.id === id) || null;
    }, [budgetsWithCalculations]);

    // Get only active budgets with calculations
    const getActiveBudgets = useCallback(() => {
        return budgetsWithCalculations.filter(budget => budget.isActive);
    }, [budgetsWithCalculations]);

    // Context value to be provided
    const contextValue = {
        budgets: budgetsWithCalculations,
        loading,
        error,
        addBudget,
        updateBudget,
        deleteBudget,
        toggleBudgetActive,
        getBudgetById,
        getActiveBudgets
    };

    return (
        <BudgetContext.Provider value={contextValue}>
            {children}
        </BudgetContext.Provider>
    );
};

// Custom hook for using the budget context
export const useBudgets = () => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudgets must be used within a BudgetProvider');
    }
    return context;
};

export default BudgetContext;
