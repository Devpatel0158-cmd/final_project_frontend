import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Button, CircularProgress, Divider, IconButton, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TimelineIcon from '@mui/icons-material/Timeline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Line, Doughnut } from 'react-chartjs-2';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  background: '#ffffff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderRadius: '12px',
  background: '#ffffff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
  },
}));

const ProgressBar = styled(Box)(({ value }) => ({
  width: '100%',
  height: '8px',
  backgroundColor: '#f1f5f9',
  borderRadius: '4px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${Math.min(value, 100)}%`,
    backgroundColor: value > 100 ? '#ef4444' : '#10b981',
    borderRadius: '4px',
    transition: 'width 0.5s ease-in-out',
  },
}));

const CategoryAvatar = styled(Avatar)(({ color }) => ({
  backgroundColor: color,
  width: 32,
  height: 32,
}));

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    monthlyBudget: 0,
    recentExpenses: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view dashboard');
          return;
        }

        // Fetch dashboard data
        const response = await api.get('/dashboard');
        if (response.data.success) {
          // Fetch monthly budgets to get the total
          const budgetsResponse = await api.get('/budgets');
          if (budgetsResponse.data.success) {
            const totalBudget = budgetsResponse.data.data.reduce((total, budget) =>
              total + parseFloat(budget.amount), 0);

            setStats({
              ...response.data.data,
              monthlyBudget: totalBudget
            });
          } else {
            setStats(response.data.data);
          }
        } else {
          toast.error(response.data.message || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Dashboard data error:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getCategoryData = () => {
    if (!Array.isArray(stats.recentExpenses) || stats.recentExpenses.length === 0) {
      return {
        labels: ['No Data'],
        data: [100],
        colors: ['#e2e8f0']
      };
    }

    const categoryTotals = {};
    const categoryColors = {};

    // First pass: collect all unique categories and their colors
    stats.recentExpenses.forEach(expense => {
      if (expense?.category) {
        const categoryName = expense.category.name;
        categoryColors[categoryName] = expense.category.color || '#94a3b8';
        categoryTotals[categoryName] = 0;
      }
    });

    // Second pass: sum up amounts for each category
    stats.recentExpenses.forEach(expense => {
      if (!expense?.amount) return;

      const categoryName = expense?.category?.name;
      if (categoryName) {
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + expense.amount;
      }
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedCategories.map(([category]) => category),
      data: sortedCategories.map(([, amount]) => amount),
      colors: sortedCategories.map(([category]) => categoryColors[category] || '#94a3b8'),
    };
  };

  const chartData = {
    labels: Array.isArray(stats.recentExpenses)
      ? stats.recentExpenses.map(expense =>
        new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
      : [],
    datasets: [
      {
        label: 'Daily Expenses',
        data: Array.isArray(stats.recentExpenses)
          ? stats.recentExpenses.map(expense => expense.amount)
          : [],
        fill: true,
        borderColor: 'var(--primary-color)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'var(--primary-color)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1e293b',
          font: {
            weight: '500',
            family: 'system-ui'
          }
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: 'system-ui'
        },
        titleFont: {
          family: 'system-ui'
        },
        callbacks: {
          label: function (context) {
            return `Amount: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          color: '#64748b',
          callback: (value) => `$${value.toLocaleString()}`
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b'
        }
      }
    }
  };

  const categoryData = getCategoryData();
  const doughnutData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.data,
        backgroundColor: categoryData.colors,
        borderColor: 'var(--card-background)',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#1e293b',
          padding: 20,
          font: {
            size: 12,
            family: 'system-ui'
          },
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: isNaN(data.datasets[0].data[i]),
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        bodyFont: {
          family: 'system-ui'
        },
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `$${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '75%'
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await api.delete(`/expenses/${expenseId}`);
      if (response.data.success) {
        toast.success('Expense deleted successfully');
        // Refresh dashboard data
        const dashboardResponse = await api.get('/dashboard');
        if (dashboardResponse.data.success) {
          setStats(dashboardResponse.data.data);
        }
      } else {
        toast.error(response.data.message || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Delete expense error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete expense');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const budgetProgress = (stats.monthlyExpenses / stats.monthlyBudget) * 100;
  const isOverBudget = budgetProgress > 100;

  return (
    <Box sx={{
      p: 3,
      background: '#f5f0e8',
      minHeight: 'calc(100vh - 100px)',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: '#1e293b',
            fontWeight: 600,
          }}
        >
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/expenses/new')}
          sx={{
            borderRadius: '8px',
            backgroundColor: '#3b82f6',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#2563eb',
            }
          }}
        >
          Add Expense
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard>
            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                Total Expenses
              </Typography>
              <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 600 }}>
                ${stats.totalExpenses.toLocaleString()}
              </Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard>
            <TrendingUpIcon sx={{ fontSize: 40, color: '#10b981' }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                Monthly Budget
              </Typography>
              <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 600 }}>
                ${stats.monthlyBudget.toLocaleString()}
              </Typography>
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard>
            <TrendingDownIcon
              sx={{
                fontSize: 40,
                color: isOverBudget ? '#ef4444' : '#10b981'
              }}
            />
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                Monthly Expenses
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: isOverBudget ? '#ef4444' : '#1e293b',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                ${stats.monthlyExpenses.toLocaleString()}
              </Typography>
              <ProgressBar value={budgetProgress} />
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={12} lg={8}>
          <StyledPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TimelineIcon sx={{ color: '#3b82f6' }} />
              <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                Expense Trend
              </Typography>
            </Box>
            <Box sx={{ height: 400 }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon sx={{ color: '#3b82f6' }} />
                <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                  Recent Transactions
                </Typography>
              </Box>
              {stats.recentExpenses?.length > 0 && (
                <Button
                  variant="text"
                  onClick={() => navigate('/expenses')}
                  sx={{ color: '#3b82f6' }}
                >
                  View All
                </Button>
              )}
            </Box>
            {stats.recentExpenses?.length === 0 ? (
              <Typography color="#64748b" sx={{ textAlign: 'center', py: 4 }}>
                No recent transactions
              </Typography>
            ) : (
              <List sx={{ width: '100%' }}>
                {stats.recentExpenses?.slice(0, 5).map((expense, index) => (
                  <React.Fragment key={expense.id || index}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 0,
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                        },
                        pr: '48px',
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteExpense(expense.id)}
                          sx={{
                            color: '#64748b',
                            '&:hover': {
                              color: '#ef4444',
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <CategoryAvatar
                        color={expense?.category?.color || '#94a3b8'}
                      >
                        {expense?.category?.name?.[0]}
                      </CategoryAvatar>
                      <ListItemText
                        primary={
                          <Typography color="#1e293b">
                            {expense.description || 'Untitled Expense'}
                          </Typography>
                        }
                        secondary={
                          <Typography color="#64748b" variant="body2">
                            {new Date(expense.date).toLocaleDateString()}
                          </Typography>
                        }
                        sx={{ ml: 2 }}
                      />
                      <Typography color="#1e293b" fontWeight={600} sx={{ mr: 4 }}>
                        ${expense.amount?.toLocaleString()}
                      </Typography>
                    </ListItem>
                    {index < Math.min(stats.recentExpenses.length - 1, 4) && (
                      <Divider sx={{ borderColor: '#e2e8f0' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 