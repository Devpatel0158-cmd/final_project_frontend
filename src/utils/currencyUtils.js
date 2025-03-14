/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return 'Invalid amount';
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Parse a currency string into a number
 * @param {string} currencyString - The currency string to parse
 * @returns {number|null} The parsed amount or null if invalid
 */
export const parseCurrency = (currencyString) => {
    if (!currencyString) return null;

    // Remove currency symbol and other non-numeric characters except decimal points
    const amount = parseFloat(currencyString.replace(/[^0-9.-]+/g, ''));

    return isNaN(amount) ? null : amount;
};

/**
 * Calculate total from an array of numbers
 * @param {number[]} amounts - Array of numbers to sum
 * @returns {number} The total sum
 */
export const calculateTotal = (amounts) => {
    if (!Array.isArray(amounts)) return 0;

    return amounts.reduce((total, amount) => {
        const num = parseFloat(amount);
        return total + (isNaN(num) ? 0 : num);
    }, 0);
}; 