/*
    Author: Bhuwan Shrestha, Shubh Soni, Dev Patel, Alen varghese
    Description: This is the test file for the application.
    Project Name: Expense Tracker
    date: 2025-March 28

*/
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
