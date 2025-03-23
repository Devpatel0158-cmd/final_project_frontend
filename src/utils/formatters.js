/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Format a date string to a human-readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

/**
 * Format a date string to YYYY-MM-DD format for inputs
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

/**
 * Format a number to have 2 decimal places
 * @param {number} num - The number to format
 * @returns {string} The formatted number with 2 decimal places
 */
export const formatNumber = (num) => {
    return Number(num).toFixed(2);
}; 