import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../contexts/ExpenseContext';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, createExpense } from '../../models/Expense';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import FormGroup from '../components/forms/FormGroup';
import FormError from '../components/forms/FormError';
import { formatDateForInput, formatNumber } from '../../utils/formatters';
import './ExpenseForm.css';

const ExpenseForm = ({
    expenseId = null,
    onSave,
    onCancel
}) => {
    const { addExpense, updateExpense, getExpenseById } = useExpenses();

    // Initialize with an empty expense
    const [expense, setExpense] = useState(() => createExpense());
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // If expenseId is provided, load the expense data
    useEffect(() => {
        if (expenseId) {
            const existingExpense = getExpenseById(expenseId);
            if (existingExpense) {
                setExpense(existingExpense);
            }
        }
    }, [expenseId, getExpenseById]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setExpense(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear any error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAmountChange = (e) => {
        let { value } = e.target;

        // Allow only numbers and decimal point
        if (value && !/^[0-9]*\.?[0-9]*$/.test(value)) {
            return;
        }

        // Convert to number for storage
        const numValue = value === '' ? 0 : parseFloat(value);

        setExpense(prev => ({
            ...prev,
            amount: numValue
        }));

        // Clear any error for this field
        if (errors.amount) {
            setErrors(prev => ({ ...prev, amount: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        setLoading(true);

        try {
            // Add or update the expense
            const result = expenseId
                ? await updateExpense(expenseId, expense)
                : await addExpense(expense);

            if (result.success) {
                if (onSave) {
                    onSave(result.expense);
                }
            } else {
                setErrors(result.errors || {});
            }
        } catch (error) {
            console.error('Failed to save expense:', error);
            setErrors({ general: 'Failed to save expense. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="expense-form-container">
            <Card title={expenseId ? 'Edit Expense' : 'Add New Expense'}>
                {errors.general && (
                    <div className="expense-form-error">
                        <FormError>{errors.general}</FormError>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="expense-form">
                    {/* Amount Field */}
                    <FormGroup>
                        <Input
                            label="Amount"
                            type="text"
                            name="amount"
                            id="amount"
                            value={expense.amount === 0 && !submitted ? '' : formatNumber(expense.amount)}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            required
                            error={errors.amount}
                        />
                        {errors.amount && <FormError>{errors.amount}</FormError>}
                    </FormGroup>

                    {/* Description Field */}
                    <FormGroup>
                        <Input
                            label="Description"
                            type="text"
                            name="description"
                            id="description"
                            value={expense.description}
                            onChange={handleChange}
                            placeholder="What was this expense for?"
                            required
                            error={errors.description}
                        />
                        {errors.description && <FormError>{errors.description}</FormError>}
                    </FormGroup>

                    {/* Category Field */}
                    <FormGroup>
                        <Select
                            label="Category"
                            name="category"
                            id="category"
                            value={expense.category}
                            onChange={handleChange}
                            required
                            error={errors.category}
                        >
                            {EXPENSE_CATEGORIES.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Select>
                        {errors.category && <FormError>{errors.category}</FormError>}
                    </FormGroup>

                    {/* Date Field */}
                    <FormGroup>
                        <Input
                            label="Date"
                            type="date"
                            name="date"
                            id="date"
                            value={formatDateForInput(expense.date)}
                            onChange={handleChange}
                            required
                            error={errors.date}
                        />
                        {errors.date && <FormError>{errors.date}</FormError>}
                    </FormGroup>

                    {/* Payment Method Field */}
                    <FormGroup>
                        <Select
                            label="Payment Method"
                            name="paymentMethod"
                            id="paymentMethod"
                            value={expense.paymentMethod}
                            onChange={handleChange}
                        >
                            {PAYMENT_METHODS.map(method => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </Select>
                    </FormGroup>

                    {/* Notes Field */}
                    <FormGroup>
                        <TextArea
                            label="Notes (Optional)"
                            name="notes"
                            id="notes"
                            value={expense.notes}
                            onChange={handleChange}
                            placeholder="Add any additional details"
                            rows={3}
                        />
                    </FormGroup>

                    {/* Recurring Expense Checkbox */}
                    <FormGroup>
                        <Checkbox
                            label="Recurring Expense"
                            name="isRecurring"
                            id="isRecurring"
                            checked={expense.isRecurring}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    {/* Show recurring frequency options if isRecurring is checked */}
                    {expense.isRecurring && (
                        <FormGroup>
                            <Select
                                label="Frequency"
                                name="recurringFrequency"
                                id="recurringFrequency"
                                value={expense.recurringFrequency || 'monthly'}
                                onChange={handleChange}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annually">Annually</option>
                            </Select>
                        </FormGroup>
                    )}

                    {/* Form Actions */}
                    <div className="expense-form-actions">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : expenseId ? 'Update Expense' : 'Add Expense'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ExpenseForm; 