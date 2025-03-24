import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './App.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ExpenseProvider } from './contexts/ExpenseContext';
import { BudgetProvider } from './contexts/BudgetContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import Budget from './pages/Budget';
import AddBudget from './pages/AddBudget';
import EditBudget from './pages/EditBudget';
import Budgets from './pages/Budgets';
import AddBudgetNew from './pages/AddBudgetNew';
import EditBudgetNew from './pages/EditBudgetNew';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <ExpenseProvider>
                    <BudgetProvider>
                        <BrowserRouter>
                            <Routes>
                                {/* Public Layout Routes */}
                                <Route path="/" element={<Layout />}>
                                    <Route index element={<Home />} />

                                    {/* Auth Routes - accessible only when NOT authenticated */}
                                    <Route element={<PublicRoute />}>
                                        <Route path="login" element={<Login />} />
                                        <Route path="register" element={<Register />} />
                                    </Route>

                                    {/* Protected Routes - accessible only when authenticated */}
                                    <Route element={<ProtectedRoute />}>
                                        <Route path="dashboard" element={<Dashboard />} />
                                        <Route path="expenses" element={<Expenses />} />
                                        <Route path="expenses/new" element={<AddExpense />} />
                                        <Route path="expenses/edit/:id" element={<EditExpense />} />

                                        {/* Original Budget Routes */}
                                        <Route path="budget" element={<Budget />} />
                                        <Route path="budget/new" element={<AddBudget />} />
                                        <Route path="budget/edit/:id" element={<EditBudget />} />

                                        {/* New Budgets Routes */}
                                        <Route path="budgets" element={<Budgets />} />
                                        <Route path="budgets/new" element={<AddBudgetNew />} />
                                        <Route path="budgets/edit/:id" element={<EditBudgetNew />} />
                                    </Route>
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </BudgetProvider>
                </ExpenseProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 