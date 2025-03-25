import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import CategoryForm from './CategoryForm';
import '../styles/components/Categories.css';

const CategoryManager = ({ initialCategories = [] }) => {
    const [categories, setCategories] = useState(initialCategories);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        if (!categories) return;

        if (searchTerm.trim() === '') {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter(
                cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredCategories(filtered);
        }
    }, [categories, searchTerm]);

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const handleAddCategory = () => {
        setCurrentCategory(null);
        setIsFormVisible(true);
    };

    const handleEditCategory = (category) => {
        setCurrentCategory(category);
        setIsFormVisible(true);
    };

    const handleDeleteCategory = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(cat => cat.id !== categoryId));
            // Here you would also call an API to delete the category
        }
    };

    const handleFormSubmit = (formData) => {
        if (formData.id) {
            // Update existing category
            setCategories(categories.map(cat =>
                cat.id === formData.id ? { ...cat, ...formData } : cat
            ));
            // Here you would also call an API to update the category
        } else {
            // Add new category with a temporary ID
            const newCategory = {
                ...formData,
                id: Date.now().toString() // temporary ID, replace with server-generated ID in production
            };
            setCategories([...categories, newCategory]);
            // Here you would also call an API to create the category
        }
        setIsFormVisible(false);
    };

    const handleCancelForm = () => {
        setIsFormVisible(false);
    };

    return (
        <div className="category-manager">
            <div className="category-header">
                <h1>Categories</h1>
                <button
                    className="btn-primary add-button"
                    onClick={handleAddCategory}
                >
                    <FaPlus /> Add Category
                </button>
            </div>

            {isFormVisible ? (
                <CategoryForm
                    category={currentCategory}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                />
            ) : (
                <div className="category-list">
                    {categories.length === 0 ? (
                        <div className="empty-state">
                            <p>No categories found. Create your first category to get started!</p>
                        </div>
                    ) : (
                        categories.map(category => (
                            <div
                                key={category.id}
                                className="category-card"
                                style={{ borderLeft: `4px solid ${category.color}` }}
                            >
                                <div className="category-info">
                                    <h3>{category.name}</h3>
                                    {category.description && (
                                        <p>{category.description}</p>
                                    )}
                                </div>
                                <div className="category-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleEditCategory(category)}
                                        aria-label={`Edit ${category.name}`}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="btn-icon danger"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        aria-label={`Delete ${category.name}`}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryManager; 