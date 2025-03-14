/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate that a field is not empty
 * @param {string} value - The value to check
 * @returns {boolean} Whether the value is not empty
 */
export const isNotEmpty = (value) => {
    return value !== null && value !== undefined && String(value).trim() !== '';
};

/**
 * Validate that a value is a number and within a range
 * @param {number|string} value - The value to check
 * @param {number} min - The minimum allowed value
 * @param {number} max - The maximum allowed value
 * @returns {boolean} Whether the value is a valid number within range
 */
export const isNumberInRange = (value, min = null, max = null) => {
    const num = Number(value);

    if (isNaN(num)) {
        return false;
    }

    if (min !== null && num < min) {
        return false;
    }

    if (max !== null && num > max) {
        return false;
    }

    return true;
};

/**
 * Validate minimum length of a string
 * @param {string} value - The string to check
 * @param {number} minLength - The minimum length required
 * @returns {boolean} Whether the string meets the minimum length
 */
export const hasMinLength = (value, minLength) => {
    return String(value).length >= minLength;
};

/**
 * Validate that two values match
 * @param {any} value1 - The first value
 * @param {any} value2 - The second value
 * @returns {boolean} Whether the values match
 */
export const valuesMatch = (value1, value2) => {
    return value1 === value2;
}; 