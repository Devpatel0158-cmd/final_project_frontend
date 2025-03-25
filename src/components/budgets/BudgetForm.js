import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    InputAdornment,
    FormControlLabel,
    Switch,
    CircularProgress,
    Alert,
    Divider,
    Stack
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useBudgets } from '../../contexts/BudgetContext';
import { EXPENSE_CATEGORIES } from '../../models/Expense';

const BudgetForm = ({ budget = null }) => {
    const navigate = useNavigate();
    const { addBudget, updateBudget } = useBudgets();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formValues, setFormValues] = useState({
        name: '',
        amount: '',
        category: '',
        startDate: new Date(),
        endDate: null,
        isActive: true
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (budget) {
            setFormValues({
                name: budget.name || '',
                amount: budget.amount ? budget.amount.toString() : '',
                category: budget.category || '',
                startDate: budget.startDate ? new Date(budget.startDate) : new Date(),
                endDate: budget.endDate ? new Date(budget.endDate) : null,
                isActive: budget.isActive !== undefined ? budget.isActive : true
            });
        }
    }, [budget]);

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: name === 'isActive' ? checked : value
        }));

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDateChange = (name, date) => {
        setFormValues(prev => ({
            ...prev,
            [name]: date
        }));

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formValues.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formValues.amount) {
            errors.amount = 'Amount is required';
        } else if (isNaN(formValues.amount) || parseFloat(formValues.amount) <= 0) {
            errors.amount = 'Amount must be a positive number';
        }

        if (formValues.endDate && formValues.startDate > formValues.endDate) {
            errors.endDate = 'End date cannot be before start date';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const budgetData = {
                name: formValues.name,
                amount: parseFloat(formValues.amount),
                category: formValues.category,
                startDate: formValues.startDate.toISOString(),
                endDate: formValues.endDate ? formValues.endDate.toISOString() : null,
                isActive: formValues.isActive
            };

            let result;
            if (budget) {
                result = await updateBudget(budget.id, budgetData);
            } else {
                result = await addBudget(budgetData);
            }

            if (result.success) {
                navigate('/budgets');
            } else {
                setFormErrors(result.errors || {});
                setError(result.errors?.general || 'Failed to save budget');
            }
        } catch (err) {
            console.error('Error saving budget:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Budget Name"
                            value={formValues.name}
                            onChange={handleInputChange}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            placeholder="e.g., Monthly Groceries"
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="amount"
                            name="amount"
                            label="Budget Amount"
                            type="number"
                            value={formValues.amount}
                            onChange={handleInputChange}
                            error={!!formErrors.amount}
                            helperText={formErrors.amount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                name="category"
                                value={formValues.category}
                                onChange={handleInputChange}
                                label="Category"
                            >
                                <MenuItem value="">
                                    <em>All Categories</em>
                                </MenuItem>
                                {EXPENSE_CATEGORIES.map(category => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Optional - for category-specific budget</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Start Date"
                            value={formValues.startDate}
                            onChange={(date) => handleDateChange('startDate', date)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!formErrors.startDate,
                                    helperText: formErrors.startDate
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="End Date (Optional)"
                            value={formValues.endDate}
                            onChange={(date) => handleDateChange('endDate', date)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!formErrors.endDate,
                                    helperText: formErrors.endDate
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formValues.isActive}
                                    onChange={handleInputChange}
                                    name="isActive"
                                    color="primary"
                                />
                            }
                            label="Active Budget"
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => navigate('/budgets')}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={24} sx={{ mr: 1 }} />
                                Saving...
                            </>
                        ) : (
                            budget ? 'Update Budget' : 'Create Budget'
                        )}
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
};

export default BudgetForm; 