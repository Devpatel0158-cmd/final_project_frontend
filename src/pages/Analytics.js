import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie, PolarArea } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const AnalyticsCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const Analytics = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('year');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [tabValue, setTabValue] = useState(0);
    const [analyticsData, setAnalyticsData] = useState({
        monthlyExpenses: [],
        categoryBreakdown: [],
        weekdayAnalysis: [],
        trendsByCategory: [],
        topExpenses: [],
        budgetComparison: [],
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeFilter, categoryFilter]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual API call
            // Mock data for now
            setTimeout(() => {
                const mockData = {
                    monthlyExpenses: [
                        { month: 'Jan', amount: 800 },
                        { month: 'Feb', amount: 950 },
                        { month: 'Mar', amount: 730 },
                        { month: 'Apr', amount: 880 },
                        { month: 'May', amount: 720 },
                        { month: 'Jun', amount: 850 },
                    ],
                    categoryBreakdown: [
                        { category: 'Food', amount: 450, color: '#2196f3' },
                        { category: 'Housing', amount: 800, color: '#ff4081' },
                        { category: 'Transportation', amount: 200, color: '#4caf50' },
                        { category: 'Utilities', amount: 300, color: '#ff9800' },
                        { category: 'Entertainment', amount: 150, color: '#9c27b0' },
                        { category: 'Healthcare', amount: 210, color: '#f44336' },
                    ],
                    weekdayAnalysis: [
                        { day: 'Monday', amount: 120 },
                        { day: 'Tuesday', amount: 95 },
                        { day: 'Wednesday', amount: 105 },
                        { day: 'Thursday', amount: 180 },
                        { day: 'Friday', amount: 210 },
                        { day: 'Saturday', amount: 230 },
                        { day: 'Sunday', amount: 140 },
                    ],
                    trendsByCategory: [
                        {
                            category: 'Food',
                            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            amounts: [120, 130, 110, 140, 125, 150]
                        },
                        {
                            category: 'Housing',
                            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            amounts: [300, 300, 300, 350, 350, 350]
                        },
                        {
                            category: 'Transportation',
                            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            amounts: [80, 75, 60, 85, 70, 65]
                        },
                    ],
                    topExpenses: [
                        { description: 'Rent', amount: 700, category: 'Housing' },
                        { description: 'Grocery Shopping', amount: 230, category: 'Food' },
                        { description: 'Electricity Bill', amount: 120, category: 'Utilities' },
                        { description: 'Gas', amount: 80, category: 'Transportation' },
                        { description: 'Internet', amount: 60, category: 'Utilities' },
                    ],
                    budgetComparison: [
                        { category: 'Food', budget: 500, actual: 450 },
                        { category: 'Housing', budget: 800, actual: 800 },
                        { category: 'Transportation', budget: 250, actual: 200 },
                        { category: 'Utilities', budget: 350, actual: 300 },
                        { category: 'Entertainment', budget: 200, actual: 150 },
                    ],
                };
                setAnalyticsData(mockData);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setLoading(false);
        }
    };

    const handleTimeFilterChange = (event) => {
        setTimeFilter(event.target.value);
    };

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Monthly Expenses Chart
    const monthlyExpensesData = {
        labels: analyticsData.monthlyExpenses.map(item => item.month),
        datasets: [
            {
                label: 'Monthly Expenses',
                data: analyticsData.monthlyExpenses.map(item => item.amount),
                fill: true,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderColor: '#2196f3',
                tension: 0.4,
            }
        ]
    };

    // Category Breakdown Chart
    const categoryBreakdownData = {
        labels: analyticsData.categoryBreakdown.map(item => item.category),
        datasets: [
            {
                data: analyticsData.categoryBreakdown.map(item => item.amount),
                backgroundColor: analyticsData.categoryBreakdown.map(item => item.color),
                borderWidth: 1,
            }
        ]
    };

    // Weekday Analysis Chart
    const weekdayAnalysisData = {
        labels: analyticsData.weekdayAnalysis.map(item => item.day),
        datasets: [
            {
                label: 'Spending by Day of Week',
                data: analyticsData.weekdayAnalysis.map(item => item.amount),
                backgroundColor: 'rgba(255, 64, 129, 0.7)',
                borderWidth: 1,
            }
        ]
    };

    // Category Trends Chart
    const categoryTrendsData = {
        labels: analyticsData.trendsByCategory.length > 0
            ? analyticsData.trendsByCategory[0].months
            : [],
        datasets: analyticsData.trendsByCategory.map(trend => ({
            label: trend.category,
            data: trend.amounts,
            tension: 0.4,
            borderWidth: 2,
            fill: false,
        }))
    };

    // Budget Comparison Chart
    const budgetComparisonData = {
        labels: analyticsData.budgetComparison.map(item => item.category),
        datasets: [
            {
                label: 'Budget',
                data: analyticsData.budgetComparison.map(item => item.budget),
                backgroundColor: 'rgba(76, 175, 80, 0.7)',
                stack: 'stack1',
            },
            {
                label: 'Actual',
                data: analyticsData.budgetComparison.map(item => item.actual),
                backgroundColor: 'rgba(33, 150, 243, 0.7)',
                stack: 'stack2',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `$${context.parsed.y || context.parsed}`;
                    }
                }
            }
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
                    Expense Analytics
                </Typography>
                <Stack direction="row" spacing={2}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Time Period</InputLabel>
                        <Select
                            value={timeFilter}
                            label="Time Period"
                            onChange={handleTimeFilterChange}
                        >
                            <MenuItem value="month">This Month</MenuItem>
                            <MenuItem value="quarter">This Quarter</MenuItem>
                            <MenuItem value="year">This Year</MenuItem>
                            <MenuItem value="all">All Time</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            label="Category"
                            onChange={handleCategoryFilterChange}
                        >
                            <MenuItem value="all">All Categories</MenuItem>
                            {analyticsData.categoryBreakdown.map(category => (
                                <MenuItem key={category.category} value={category.category}>
                                    {category.category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Overview" />
                    <Tab label="Trends" />
                    <Tab label="Budget Analysis" />
                </Tabs>
            </Box>

            {/* Tab Panels */}
            <Box hidden={tabValue !== 0}>
                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        {/* Monthly Expenses */}
                        <Grid item xs={12} md={8}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Monthly Expenses
                                    </Typography>
                                    <Box height={300}>
                                        <Line data={monthlyExpensesData} options={chartOptions} />
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Category Breakdown */}
                        <Grid item xs={12} md={4}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Category Breakdown
                                    </Typography>
                                    <Box height={300}>
                                        <Doughnut data={categoryBreakdownData} options={chartOptions} />
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Weekday Analysis */}
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Spending by Day of Week
                                    </Typography>
                                    <Box height={300}>
                                        <Bar data={weekdayAnalysisData} options={chartOptions} />
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Top Expenses */}
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Top Expenses
                                    </Typography>
                                    <Box sx={{ height: 300, overflow: 'auto' }}>
                                        {analyticsData.topExpenses.map((expense, index) => (
                                            <Box key={index} sx={{ mb: 2 }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {expense.description}
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        ${expense.amount}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {expense.category}
                                                </Typography>
                                                {index < analyticsData.topExpenses.length - 1 &&
                                                    <Divider sx={{ mt: 1 }} />}
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    </Grid>
                )}
            </Box>

            <Box hidden={tabValue !== 1}>
                {tabValue === 1 && (
                    <Grid container spacing={3}>
                        {/* Category Trends */}
                        <Grid item xs={12}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Expense Trends by Category
                                    </Typography>
                                    <Box height={400}>
                                        <Line data={categoryTrendsData} options={chartOptions} />
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Stacked Category View - Polar Area */}
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Category Spending Distribution
                                    </Typography>
                                    <Box height={350}>
                                        <PolarArea data={categoryBreakdownData} options={chartOptions} />
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Alternative Category View - Pie */}
                        <Grid item xs={12} md={6}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Category Spending (Alternate View)
                                    </Typography>
                                    <Box height={350}>
                                        <Pie data={categoryBreakdownData} options={chartOptions} />
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    </Grid>
                )}
            </Box>

            <Box hidden={tabValue !== 2}>
                {tabValue === 2 && (
                    <Grid container spacing={3}>
                        {/* Budget vs Actual */}
                        <Grid item xs={12}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Budget vs. Actual Spending
                                    </Typography>
                                    <Box height={400}>
                                        <Bar data={budgetComparisonData} options={chartOptions} />
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        {/* Budget Status Cards */}
                        <Grid item xs={12}>
                            <StyledCard>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Budget Status by Category
                                    </Typography>
                                    <Grid container spacing={2} mt={1}>
                                        {analyticsData.budgetComparison.map((item, index) => {
                                            const percentUsed = (item.actual / item.budget) * 100;
                                            const isOverBudget = item.actual > item.budget;
                                            return (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <AnalyticsCard>
                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                            {item.category}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                mt: 1,
                                                                height: 8,
                                                                bgcolor: 'grey.200',
                                                                borderRadius: 1,
                                                                position: 'relative',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    height: '100%',
                                                                    width: `${Math.min(percentUsed, 100)}%`,
                                                                    bgcolor: isOverBudget ? 'error.main' : 'success.main',
                                                                    borderRadius: 1
                                                                }}
                                                            />
                                                        </Box>
                                                        <Box display="flex" justifyContent="space-between" mt={1}>
                                                            <Typography variant="body2">
                                                                ${item.actual} of ${item.budget}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight="bold"
                                                                color={isOverBudget ? 'error.main' : 'success.main'}
                                                            >
                                                                {percentUsed.toFixed(0)}%
                                                            </Typography>
                                                        </Box>
                                                    </AnalyticsCard>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default Analytics; 