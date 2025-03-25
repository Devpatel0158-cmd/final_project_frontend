import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useBudgets } from '../contexts/BudgetContext';
import BudgetForm from '../components/budgets/BudgetForm';

const EditBudgetNew = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getBudgetById, loading } = useBudgets();
    const [budget, setBudget] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const budgetData = getBudgetById(id);

                if (!budgetData) {
                    setNotFound(true);
                    return;
                }

                setBudget(budgetData);
            } catch (error) {
                console.error('Error fetching budget:', error);
                setNotFound(true);
            }
        };

        fetchBudget();
    }, [id, getBudgetById]);

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (notFound) {
        return (
            <Box sx={{ p: 3 }}>
                <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Budget Not Found
                    </Typography>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        The budget you are trying to edit could not be found.
                    </Alert>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/budgets')}
                    >
                        Back to Budgets
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Edit Budget
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Update your budget information
                </Typography>

                {budget && <BudgetForm budget={budget} />}
            </Paper>
        </Box>
    );
};

export default EditBudgetNew; 