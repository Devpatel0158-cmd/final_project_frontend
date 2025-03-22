/**
 * Expense Model
 * 
 * Defines the structure and validation for expense objects
 */

/**
 * Common expense categories
 */
export const EXPENSE_CATEGORIES = [
    'Food and Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Health and Wellness',
    'Personal Care',
    'Education',
    'Travel',
    'Gifts and Donations',
    'Business',
    'Investments',
    'Taxes',
    'Insurance',
    'Debt Payments',
    'Miscellaneous'
];

/**
 * Expense payment methods
 */
export const PAYMENT_METHODS = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Mobile Payment',
    'Check',
    'Other'
];

/**
 * Creates a new expense object with default values
 * @returns {Object} A new expense object
 */
export const createExpense = () => ({
    id: null,
    amount: 0,
    description: '',
    category: 'Miscellaneous',
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    paymentMethod: 'Cash',
    notes: '',
    receipt: null,
    isRecurring: false,
    recurringFrequency: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
});

/**
 * Validates an expense object
 * @param {Object} expense - The expense to validate
 * @returns {Object} Object containing isValid flag and any validation errors
 */
export const validateExpense = (expense) => {
    const errors = {};

    // Amount validation
    if (!expense.amount || expense.amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }

    // Description validation
    if (!expense.description || expense.description.trim() === '') {
        errors.description = 'Description is required';
    } else if (expense.description.length > 100) {
        errors.description = 'Description must be less than 100 characters';
    }

    // Category validation
    if (!expense.category || expense.category.trim() === '') {
        errors.category = 'Category is required';
    }

    // Date validation
    if (!expense.date) {
        errors.date = 'Date is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Formats an expense for display
 * @param {Object} expense - The expense to format
 * @returns {Object} The formatted expense
 */
export const formatExpenseForDisplay = (expense) => {
    return {
        ...expense,
        formattedDate: new Date(expense.date).toLocaleDateString(),
        formattedAmount: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(expense.amount)
    };
}; 