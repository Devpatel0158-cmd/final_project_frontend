/**
 * Format a date to a human-readable string
 * @param {Date|string|number} date - The date to format
 * @param {string} format - The format to use (default: 'MM/DD/YYYY')
 * @returns {string} The formatted date string
 */
export const formatDate = (date, format = 'MM/DD/YYYY') => {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return 'Invalid date';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    let result = format;
    result = result.replace('YYYY', year);
    result = result.replace('MM', month);
    result = result.replace('DD', day);

    return result;
};

/**
 * Get the current date as a string in YYYY-MM-DD format (for input[type="date"])
 * @returns {string} The current date in YYYY-MM-DD format
 */
export const getCurrentDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/**
 * Calculate the difference in days between two dates
 * @param {Date|string|number} date1 - The first date
 * @param {Date|string|number} date2 - The second date
 * @returns {number} The number of days between the dates
 */
export const getDaysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return null;
    }

    // Get the difference in milliseconds
    const diffTime = Math.abs(d2 - d1);
    // Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}; 