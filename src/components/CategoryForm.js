import React, { useState, useEffect } from 'react';
import '../styles/components/Categories.css';

const CATEGORY_COLORS = [
    '#4caf50', // green
    '#2196f3', // blue
    '#f44336', // red
    '#ff9800', // orange
    '#9c27b0', // purple
    '#00bcd4', // cyan
    '#ffeb3b', // yellow
    '#795548', // brown
    '#607d8b', // blue-grey
    '#e91e63', // pink
];

const CategoryForm = ({ category, onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(CATEGORY_COLORS[0]);
    const [errors, setErrors] = useState({});

    // Initialize form when editing an existing category
    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
            setColor(category.color || CATEGORY_COLORS[0]);
        }
    }, [category]);

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Category name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = {
            id: category?.id, // Keep the ID if editing
            name: name.trim(),
            description: description.trim(),
            color
        };

        onSubmit(formData);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setColor(CATEGORY_COLORS[0]);
        setErrors({});
    };

    return (
        <div className="category-form">
            <h2>{category ? 'Edit Category' : 'Add New Category'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="category-name">Category Name</label>
                    <input
                        id="category-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="category-description">Description (Optional)</label>
                    <textarea
                        id="category-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a short description"
                    />
                </div>

                <div className="form-group">
                    <label>Color</label>
                    <div className="color-options">
                        {CATEGORY_COLORS.map((colorOption) => (
                            <div
                                key={colorOption}
                                className={`color-option ${color === colorOption ? 'selected' : ''}`}
                                style={{ backgroundColor: colorOption }}
                                onClick={() => setColor(colorOption)}
                            />
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                            resetForm();
                            onCancel();
                        }}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                        {category ? 'Update' : 'Create'} Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm; 