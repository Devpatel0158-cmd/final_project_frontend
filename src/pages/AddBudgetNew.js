import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import BudgetForm from '../components/budgets/BudgetForm';

const AddBudgetNew = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Create New Budget
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Set up a budget to help track your spending
                </Typography>

                <BudgetForm />
            </Paper>
        </Box>
    );
};

export default AddBudgetNew; 