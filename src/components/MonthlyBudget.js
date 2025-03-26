import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FlightIcon from '@mui/icons-material/Flight';
import PetsIcon from '@mui/icons-material/Pets';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { toast } from 'react-toastify';
import api from '../utils/api';

// Map of category icons
const categoryIcons = {
  'Food & Dining': <RestaurantIcon />,
  'Shopping': <ShoppingCartIcon />,
  'Housing': <HomeIcon />,
  'Transportation': <DirectionsCarIcon />,
  'Healthcare': <LocalHospitalIcon />,
  'Education': <SchoolIcon />,
  'Entertainment': <SportsEsportsIcon />,
  'Travel': <FlightIcon />,
  'Pets': <PetsIcon />,
  'Other': <MoreHorizIcon />
};

const BudgetCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    backgroundColor: value > 100 ? theme.palette.error.main :
      value > 80 ? theme.palette.warning.main :
        theme.palette.success.main,
  },
  marginTop: 5,
  marginBottom: 8,
}));

// Enhanced text styling for better visibility
const SpentText = styled(Typography)(({ theme }) => ({
  color: '#555555',
  fontWeight: 500,
  fontSize: '0.875rem',
  marginBottom: '4px',
}));

const RemainingText = styled(Typography)(({ theme, negative }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: negative ? theme.palette.error.main : theme.palette.success.main,
}));

const BudgetAmount = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: '#222222',
  marginBottom: '12px',
}));

function MonthlyBudget() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    period: 'monthly'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      console.log('Fetching budgets...');
      const response = await api.get('/budgets');
      console.log('Budgets response:', response);
      if (response.data && response.data.success) {
        setBudgets(response.data.data);
      } else {
        console.error('Invalid budgets response format:', response);
        toast.error('Failed to load budgets: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      console.error('Error details:', error.response || error);
      toast.error('Failed to fetch budgets: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await api.get('/categories');
      console.log('Categories response:', response);
      if (response.data && response.data.success) {
        setCategories(response.data.data);
      } else {
        console.error('Invalid categories response format:', response);
        toast.error('Failed to load categories: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      console.error('Error details:', error.response || error);
      toast.error('Failed to fetch categories: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenDialog = (budget = null) => {
    setSelectedBudget(budget);
    setFormData({
      amount: budget ? budget.amount : '',
      categoryId: budget ? budget.categoryId : '',
      period: budget ? budget.period : 'monthly'
    });
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBudget(null);
    setFormData({ amount: '', categoryId: '', period: 'monthly' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || !formData.categoryId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      let startDate, endDate;

      if (formData.period === 'yearly') {
        startDate = new Date();
        startDate.setMonth(0, 1); // January 1st
        endDate = new Date();
        endDate.setMonth(11, 31); // December 31st
      } else {
        startDate = new Date();
        startDate.setDate(1); // First day of current month
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // Last day of current month
      }

      const budgetData = {
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        period: formData.period,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };

      if (selectedBudget) {
        await api.put(`/budgets/${selectedBudget.id}`, budgetData);
        toast.success('Budget updated successfully');
      } else {
        await api.post('/budgets', budgetData);
        toast.success('Budget added successfully');
      }

      handleCloseDialog();
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await api.delete(`/budgets/${budgetId}`);
      toast.success('Budget deleted successfully');
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || <MoreHorizIcon />;
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f5f0e8',
        borderRadius: 2
      }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      background: '#f5f0e8',
      borderRadius: 2,
      minHeight: 'calc(100vh - 100px)',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalanceWalletIcon
            sx={{
              fontSize: 36,
              color: 'primary.main',
              mr: 2
            }}
          />
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: '#333333', fontWeight: 700 }}>
              Monthly Budgets
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666666', mt: 1 }}>
              Total Budget: ${budgets.reduce((total, budget) => total + parseFloat(budget.amount), 0).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Budget
        </Button>
      </Box>

      <Grid container spacing={3}>
        {budgets.map((budget) => (
          <Grid item xs={12} sm={6} md={4} key={budget.id}>
            <BudgetCard sx={{ background: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getCategoryIcon(budget.category.name)}
                  </ListItemIcon>
                  <Typography variant="h6" sx={{ color: '#333333', fontWeight: 600 }}>
                    {budget.category.name}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(budget)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(budget.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#666666', fontWeight: 500, display: 'block', mb: 0.5 }}>
                  Budget Amount
                </Typography>
                <BudgetAmount>
                  ${parseFloat(budget.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </BudgetAmount>
              </Box>

              <Box sx={{ mb: 2 }}>
                <SpentText>
                  Spent: ${budget.spent.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </SpentText>
                <ProgressBar
                  variant="determinate"
                  value={Math.min(budget.percentageUsed, 100)}
                />
              </Box>

              <RemainingText negative={budget.remaining < 0}>
                Remaining: ${budget.remaining < 0 ? '-' : ''}${Math.abs(budget.remaining).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </RemainingText>
            </BudgetCard>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            background: 'var(--card-background)',
            color: 'var(--text-primary)',
            borderRadius: 2,
            boxShadow: 'var(--shadow-md)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'var(--text-primary)' }}>
          {selectedBudget ? 'Edit Budget' : 'Add New Budget'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="category-label" sx={{ color: 'var(--text-secondary)' }}>Category</InputLabel>
            <Select
              labelId="category-label"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              label="Category"
              sx={{
                color: 'var(--text-primary)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--border-color)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--border-hover)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--primary-color)',
                },
              }}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  value={category.id}
                  sx={{
                    color: 'var(--text-primary)',
                    '&:hover': {
                      backgroundColor: 'var(--hover-color)',
                    },
                  }}
                >
                  <ListItemIcon>
                    {getCategoryIcon(category.name)}
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: 'var(--text-primary)',
                '& fieldset': {
                  borderColor: 'var(--border-color)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--border-hover)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--primary-color)',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-secondary)',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: 'var(--text-secondary)',
              '&:hover': {
                backgroundColor: 'var(--hover-color)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: 'var(--primary-color)',
              '&:hover': {
                backgroundColor: 'var(--primary-hover)',
              },
            }}
          >
            {selectedBudget ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MonthlyBudget; 