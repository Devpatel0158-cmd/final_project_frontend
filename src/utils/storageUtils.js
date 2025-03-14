/**
 * Save data to local storage
 * @param {string} key - The key to use for storage
 * @param {any} data - The data to store
 */
export const saveToStorage = (key, data) => {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

/**
 * Retrieve data from local storage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value to return if key not found
 * @returns {any} The retrieved data or defaultValue if not found
 */
export const getFromStorage = (key, defaultValue = null) => {
    try {
        const serializedData = localStorage.getItem(key);
        if (serializedData === null) {
            return defaultValue;
        }
        return JSON.parse(serializedData);
    } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Remove data from local storage
 * @param {string} key - The key to remove
 */
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};

/**
 * Clear all data from local storage
 */
export const clearStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}; 