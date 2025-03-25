import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CategoryService } from '../services/CategoryService';

const CategoryContext = createContext();

export const INITIAL_CATEGORIES = [
    { id: '1', name: 'Food', color: '#4CAF50', description: 'Groceries, restaurants, and food delivery' },
    { id: '2', name: 'Transportation', color: '#2196F3', description: 'Gas, public transit, and rideshares' },
    { id: '3', name: 'Entertainment', color: '#9C27B0', description: 'Movies, games, and other entertainment expenses' },
    { id: '4', name: 'Housing', color: '#FF9800', description: 'Rent, mortgage, and home maintenance' },
    { id: '5', name: 'Utilities', color: '#607D8B', description: 'Electric, water, internet, and other utility bills' },
    { id: '6', name: 'Healthcare', color: '#F44336', description: 'Medical expenses and insurance' },
    { id: '7', name: 'Education', color: '#00BCD4', description: 'Tuition, books, and courses' },
    { id: '8', name: 'Shopping', color: '#E91E63', description: 'Clothing, electronics, and other retail expenses' },
];

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Initialize categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const savedCategories = await CategoryService.getAll();

                // If no categories exist, initialize with defaults
                if (!savedCategories || savedCategories.length === 0) {
                    await CategoryService.initializeWithDefaults(INITIAL_CATEGORIES);
                    setCategories(INITIAL_CATEGORIES);
                } else {
                    setCategories(savedCategories);
                }
                setError('');
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Get a category by ID
    const getCategoryById = useCallback((id) => {
        return categories.find(category => category.id === id);
    }, [categories]);

    // Add a new category
    const addCategory = useCallback(async (categoryData) => {
        try {
            const newCategory = {
                ...categoryData,
                id: uuidv4(),
                createdAt: new Date().toISOString()
            };

            await CategoryService.add(newCategory);

            setCategories(prevCategories => [...prevCategories, newCategory]);
            return { success: true, category: newCategory };
        } catch (err) {
            console.error('Error adding category:', err);
            return {
                success: false,
                errors: { general: 'Failed to add category' }
            };
        }
    }, []);

    // Update an existing category
    const updateCategory = useCallback(async (id, categoryData) => {
        try {
            const updatedCategory = {
                ...categoryData,
                id,
                updatedAt: new Date().toISOString()
            };

            await CategoryService.update(id, updatedCategory);

            setCategories(prevCategories =>
                prevCategories.map(cat => cat.id === id ? updatedCategory : cat)
            );

            return { success: true, category: updatedCategory };
        } catch (err) {
            console.error('Error updating category:', err);
            return {
                success: false,
                errors: { general: 'Failed to update category' }
            };
        }
    }, []);

    // Delete a category
    const deleteCategory = useCallback(async (id) => {
        try {
            await CategoryService.delete(id);

            setCategories(prevCategories =>
                prevCategories.filter(cat => cat.id !== id)
            );

            return { success: true };
        } catch (err) {
            console.error('Error deleting category:', err);
            return {
                success: false,
                errors: { general: 'Failed to delete category' }
            };
        }
    }, []);

    // Context value
    const value = {
        categories,
        loading,
        error,
        getCategoryById,
        addCategory,
        updateCategory,
        deleteCategory
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};

// Custom hook for using the category context
export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};

export default CategoryContext; 