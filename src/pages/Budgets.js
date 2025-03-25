import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    LinearProgress,
    IconButton,
    Divider,
    Chip,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Fab,
    CircularProgress,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useBudgets } from '../contexts/BudgetContext';

// Styled Components
const BudgetCard = styled(Card)(({ theme, active }) => ({
    position: 'relative',
    height: '100%',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[6],
    },
    opacity: active ? 1 : 0.7,
    border: active ? `1px solid ${theme.palette.primary.main}` : 'none',
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
    height: 10,
    borderRadius: 5,
    '& .MuiLinearProgress-bar': {
        backgroundColor: value > 100 ? theme.palette.error.main :
            value > 75 ? theme.palette.warning.main :
                theme.palette.success.main,
    }
}));

const StatusChip = styled(Chip)(({ theme, active }) => ({
    backgroundColor: active ? theme.palette.success.light : theme.palette.grey[300],
    color: active ? theme.palette.success.contrastText : theme.palette.text.primary,
}));

const AddFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
}));

const Budgets = () => {
    const navigate = useNavigate();
    const { budgets, loading, error, deleteBudget, toggleBudgetActive } = useBudgets();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleMenuClick = (event, budget) => {
        setAnchorEl(event.currentTarget);
        setSelectedBudget(budget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditBudget = () => {
        navigate(`/budgets/edit/${selectedBudget.id}`);
        handleMenuClose();
    };

    const handleToggleActive = async () => {
        await toggleBudgetActive(selectedBudget.id);
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedBudget(null);
    };

    const handleDeleteConfirm = async () => {
        await deleteBudget(selectedBudget.id);
        setDeleteDialogOpen(false);
        setSelectedBudget(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Budget Management
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Manage your budgets to track and control your spending
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Budget List */}
            {budgets.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        No budgets found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Create your first budget to start tracking your spending
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/budgets/new')}
                    >
                        Create Budget
                    </Button>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {budgets.map(budget => {
                        const progressValue = (100 - budget.progressPercentage);
                        return (
                            <Grid item xs={12} sm={6} md={4} key={budget.id}>
                                <BudgetCard active={budget.isActive}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                                                {budget.name}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuClick(e, budget)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Box>

                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <StatusChip
                                                active={budget.isActive}
                                                label={budget.isActive ? "Active" : "Inactive"}
                                                size="small"
                                                icon={budget.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                                            />
                                            {budget.category && (
                                                <Chip
                                                    icon={<CategoryIcon />}
                                                    label={budget.category}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="h5" fontWeight="bold" mb={1}>
                                            ${budget.amount.toLocaleString()}
                                        </Typography>

                                        <Box mb={2}>
                                            <Typography variant="body2" display="flex" alignItems="center" mb={0.5}>
                                                <DateRangeIcon fontSize="small" sx={{ mr: 0.5 }} />
                                                {new Date(budget.startDate).toLocaleDateString()} -
                                                {budget.endDate ? new Date(budget.endDate).toLocaleDateString() : ' Ongoing'}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 1.5 }} />

                                        <Box my={2}>
                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Remaining:
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="bold"
                                                    color={budget.remainingAmount < 0 ? 'error.main' : 'success.main'}
                                                >
                                                    ${budget.remainingAmount.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <ProgressBar
                                                variant="determinate"
                                                value={budget.progressPercentage}
                                            />
                                            <Box display="flex" justifyContent="flex-end" mt={0.5}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {Math.round(budget.progressPercentage)}% used
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end', padding: 2, pt: 0 }}>
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => {
                                                setSelectedBudget(budget);
                                                handleEditBudget();
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </CardActions>
                                </BudgetCard>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Add Budget FAB */}
            <AddFab color="primary" aria-label="add" onClick={() => navigate('/budgets/new')}>
                <AddIcon />
            </AddFab>

            {/* Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEditBudget}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit Budget
                </MenuItem>
                <MenuItem onClick={handleToggleActive}>
                    {selectedBudget?.isActive ? (
                        <>
                            <CancelIcon fontSize="small" sx={{ mr: 1 }} />
                            Deactivate Budget
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                            Activate Budget
                        </>
                    )}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete Budget
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Delete Budget</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this budget? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Budgets; 