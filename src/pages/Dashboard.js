import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    CircularProgress,
    IconButton,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Avatar,
    Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Line, Doughnut } from 'react-chartjs-2';
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
import { useAuth } from '../contexts/AuthContext';

// Register ChartJS components
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

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const StatCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalExpenses: 0,
        monthlyExpenses: 0,
        recentExpenses: [],
        categoryData: [],
        trendData: [],
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call to fetch dashboard data
            // For now using mock data
            const mockData = {
                totalExpenses: 2500,
                monthlyExpenses: 850,
                recentExpenses: [
                    { id: 1, description: 'Groceries', amount: 150, date: '2024-02-20', category: 'Food' },
                    { id: 2, description: 'Internet Bill', amount: 60, date: '2024-02-19', category: 'Utilities' },
                    { id: 3, description: 'Gas', amount: 45, date: '2024-02-18', category: 'Transportation' },
                ],
                categoryData: [
                    { category: 'Food', amount: 450 },
                    { category: 'Transportation', amount: 200 },
                    { category: 'Utilities', amount: 300 },
                    { category: 'Entertainment', amount: 150 },
                ],
                trendData: [
                    { month: 'Jan', amount: 800 },
                    { month: 'Feb', amount: 850 },
                    { month: 'Mar', amount: 750 },
                ],
            };
            setStats(mockData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: stats.trendData.map(item => item.month),
        datasets: [
            {
                label: 'Monthly Expenses',
                data: stats.trendData.map(item => item.amount),
                fill: true,
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const categoryChartData = {
        labels: stats.categoryData.map(item => item.category),
        datasets: [
            {
                data: stats.categoryData.map(item => item.amount),
                backgroundColor: [
                    '#2196f3',
                    '#ff4081',
                    '#4caf50',
                    '#ff9800',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
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
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Dashboard
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<BarChartIcon />}
                        onClick={() => navigate('/analytics')}
                    >
                        View Analytics
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/expenses/new')}
                    >
                        Add Expense
                    </Button>
                </Stack>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <AccountBalanceWalletIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Total Expenses
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                ${stats.totalExpenses.toLocaleString()}
                            </Typography>
                        </Box>
                    </StatCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <ReceiptIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Monthly Expenses
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                ${stats.monthlyExpenses.toLocaleString()}
                            </Typography>
                        </Box>
                    </StatCard>
                </Grid>
            </Grid>

            {/* Charts and Recent Expenses */}
            <Grid container spacing={3}>
                {/* Expense Trend Chart */}
                <Grid item xs={12} md={8}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Expense Trend
                            </Typography>
                            <Box height={300}>
                                <Line data={chartData} options={chartOptions} />
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Category Distribution */}
                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Category Distribution
                            </Typography>
                            <Box height={300}>
                                <Doughnut data={categoryChartData} options={chartOptions} />
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Recent Expenses */}
                <Grid item xs={12}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Expenses
                            </Typography>
                            <List>
                                {stats.recentExpenses.map((expense, index) => (
                                    <React.Fragment key={expense.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={expense.description}
                                                secondary={new Date(expense.date).toLocaleDateString()}
                                            />
                                            <ListItemSecondaryAction>
                                                <Typography variant="body2" color="text.secondary">
                                                    ${expense.amount.toLocaleString()}
                                                </Typography>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < stats.recentExpenses.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 