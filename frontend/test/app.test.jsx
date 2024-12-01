import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App.jsx';

// Utility function to wrap the App with BrowserRouter
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('App Component', () => {
  test('renders Home page by default', () => {
    renderWithRouter(<App />);
    const homePageText = screen.getByText(/home/i); // Adjust the regex or text to match your Home page content
    expect(homePageText).toBeInTheDocument();
  });

  test('navigates to Flights page', () => {
    window.history.pushState({}, 'Flights page', '/flights');
    renderWithRouter(<App />);
    const flightsPageText = screen.getByText(/flights/i); // Adjust based on your Flights page content
    expect(flightsPageText).toBeInTheDocument();
  });

  test('navigates to Login page', () => {
    window.history.pushState({}, 'Login page', '/login');
    renderWithRouter(<App />);
    const loginPageText = screen.getByText(/login/i); // Adjust based on your Login page content
    expect(loginPageText).toBeInTheDocument();
  });

  test('navigates to Signup page', () => {
    window.history.pushState({}, 'Signup page', '/signup');
    renderWithRouter(<App />);
    const signupPageText = screen.getByText(/signup/i); // Adjust based on your Signup page content
    expect(signupPageText).toBeInTheDocument();
  });

  test('navigates to About Us page', () => {
    window.history.pushState({}, 'About Us page', '/Aboutus');
    renderWithRouter(<App />);
    const aboutUsText = screen.getByText(/about us/i); // Adjust based on your About Us page content
    expect(aboutUsText).toBeInTheDocument();
  });

  test('renders 404 for unknown routes', () => {
    window.history.pushState({}, 'Unknown page', '/random-route');
    renderWithRouter(<App />);
    const notFoundText = screen.getByText(/not found/i); // If your app has a "Not Found" page
    expect(notFoundText).toBeInTheDocument();
  });
});
