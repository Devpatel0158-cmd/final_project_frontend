import React from 'react';

const Home = () => {
    return (
        <div className="home-container">
            <h2>Welcome to Your Expense Tracker</h2>
            <p>
                This application helps you track your expenses, manage your budget,
                and achieve your financial goals.
            </p>
            <div className="features-section">
                <h3>Features</h3>
                <ul>
                    <li>Track daily expenses</li>
                    <li>Categorize spending</li>
                    <li>Set budgets and goals</li>
                    <li>Visualize spending patterns</li>
                    <li>Generate financial reports</li>
                </ul>
            </div>
        </div>
    );
};

export default Home; 