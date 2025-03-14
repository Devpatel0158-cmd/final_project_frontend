import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Home = () => {
    return (
        <div className="home-container">
            <h2>Welcome to Your Expense Tracker</h2>
            <p>
                This application helps you track your expenses, manage your budget,
                and achieve your financial goals.
            </p>

            <Card title="Features" variant="primary" className="features-card">
                <ul className="features-list">
                    <li>
                        <Badge variant="primary" rounded>Track</Badge>
                        Record and categorize your daily expenses
                    </li>
                    <li>
                        <Badge variant="success" rounded>Budget</Badge>
                        Set monthly budgets for different categories
                    </li>
                    <li>
                        <Badge variant="info" rounded>Analyze</Badge>
                        Visualize your spending patterns with charts
                    </li>
                    <li>
                        <Badge variant="warning" rounded>Plan</Badge>
                        Set financial goals and track your progress
                    </li>
                    <li>
                        <Badge variant="secondary" rounded>Report</Badge>
                        Generate reports to understand your finances better
                    </li>
                </ul>
            </Card>

            <div className="home-actions">
                <Link to="/dashboard">
                    <Button variant="primary" size="large">View Dashboard</Button>
                </Link>
                <Link to="/expenses">
                    <Button variant="secondary" size="large">Track Expenses</Button>
                </Link>
            </div>
        </div>
    );
};

export default Home; 