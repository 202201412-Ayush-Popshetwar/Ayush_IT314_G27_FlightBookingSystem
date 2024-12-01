import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../components/Footer';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays contact information correctly', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check for contact section heading
    expect(screen.getByText('Contact Us')).toBeInTheDocument();

    // Check for email
    const emailLink = screen.getByText('support@flightbookingsystem.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.getAttribute('href')).toBe('mailto:support@flightbookingsystem.com');

    // Check for phone number
    expect(screen.getByText(/\+123 456 7890/)).toBeInTheDocument();
  });

  test('quick links navigate to correct routes', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check for Quick Links section
    expect(screen.getByText('Quick Links')).toBeInTheDocument();

    // Test Home link
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink.getAttribute('href')).toBe('/');

    // Test About Us link
    const aboutLink = screen.getByRole('link', { name: /about us/i });
    expect(aboutLink.getAttribute('href')).toBe('/aboutus');

    // Test FAQ link
    const faqLink = screen.getByRole('link', { name: /faq/i });
    expect(faqLink.getAttribute('href')).toBe('/faq');
  });


  test('renders copyright information', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} FlightBookingSystem | All Rights Reserved`)).toBeInTheDocument();
  });
}); 