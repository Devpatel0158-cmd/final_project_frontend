const STORAGE_KEY = 'expenseTracker_categories';

export const CategoryService = {
    /**
     * Get all categories
     * @returns {Promise<Array>} - Array of category objects
     */
    getAll: async () => {
        try {
            const categories = localStorage.getItem(STORAGE_KEY);
            return categories ? JSON.parse(categories) : [];
        } catch (error) {
            console.error('Error retrieving categories:', error);
            throw error;
        }
    },

    /**
     * Get a category by ID
     * @param {string} id - Category ID
     * @returns {Promise<Object|null>} - Category object or null if not found
     */
    getById: async (id) => {
        try {
            const categories = await CategoryService.getAll();
            return categories.find(category => category.id === id) || null;
        } catch (error) {
            console.error(`Error retrieving category with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Add a new category
     * @param {Object} category - Category object to add
     * @returns {Promise<Object>} - Added category
     */
    add: async (category) => {
        try {
            const categories = await CategoryService.getAll();

            // Check if category with same name already exists
            const existingCategory = categories.find(c => c.name.toLowerCase() === category.name.toLowerCase());
            if (existingCategory) {
                throw new Error(`Category with name "${category.name}" already exists`);
            }

            const updatedCategories = [...categories, category];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCategories));
            return category;
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },

    /**
     * Update an existing category
     * @param {string} id - Category ID to update
     * @param {Object} categoryData - Updated category data
     * @returns {Promise<Object>} - Updated category
     */
    update: async (id, categoryData) => {
        try {
            const categories = await CategoryService.getAll();

            // Check if category exists
            const categoryIndex = categories.findIndex(category => category.id === id);
            if (categoryIndex === -1) {
                throw new Error(`Category with ID ${id} not found`);
            }

            // Check if updated name conflicts with existing category
            const nameConflict = categories.find(c =>
                c.id !== id &&
                c.name.toLowerCase() === categoryData.name.toLowerCase()
            );

            if (nameConflict) {
                throw new Error(`Category with name "${categoryData.name}" already exists`);
            }

            // Update category
            const updatedCategories = [...categories];
            updatedCategories[categoryIndex] = categoryData;

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCategories));
            return categoryData;
        } catch (error) {
            console.error(`Error updating category with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete a category
     * @param {string} id - Category ID to delete
     * @returns {Promise<boolean>} - True if successfully deleted
     */
    delete: async (id) => {
        try {
            const categories = await CategoryService.getAll();

            // Check if category exists
            const category = categories.find(category => category.id === id);
            if (!category) {
                throw new Error(`Category with ID ${id} not found`);
            }

            const updatedCategories = categories.filter(category => category.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCategories));
            return true;
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Initialize categories with default values
     * @param {Array} defaultCategories - Array of default category objects
     * @returns {Promise<Array>} - Array of initialized categories
     */
    initializeWithDefaults: async (defaultCategories) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
            return defaultCategories;
        } catch (error) {
            console.error('Error initializing categories with defaults:', error);
            throw error;
        }
    }
}; 