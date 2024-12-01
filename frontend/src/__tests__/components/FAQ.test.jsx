import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FAQ from '../../components/FAQ';

// Mock the child components
jest.mock('../../components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Navbar</div>;
  };
});

jest.mock('../../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header</div>;
  };
});

jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Footer</div>;
  };
});

describe('FAQ Component', () => {
  const mockProps = {
    loggedInUser: 'testUser',
    setLoggedInUser: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders FAQ component with all sections', () => {
    render(
      <BrowserRouter>
        <FAQ {...mockProps} />
      </BrowserRouter>
    );

    // Check for main heading
    expect(screen.getByText('About SkyLynx')).toBeInTheDocument();
    
    // Check for welcome text
    expect(screen.getByText(/Welcome to our FAQ section!/)).toBeInTheDocument();
    
    // Check for mocked components
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('toggles FAQ answers when questions are clicked', () => {
    render(
      <BrowserRouter>
        <FAQ {...mockProps} />
      </BrowserRouter>
    );

    // Find the first FAQ question
    const firstQuestion = screen.getByText(/What is SkyLynx and how does it work\?/);
    
    // Initially, answer should not be visible
    expect(screen.queryByText(/SkyLynx is your ultimate travel companion, designed to simplify the process of searching and booking flights, hotels, and other travel services. With a user-friendly interface, you can easily compare prices, read reviews, and make bookings in just a few clicks./)).not.toBeInTheDocument();
    
    // Click the question
    fireEvent.click(firstQuestion);
    
    // Answer should now be visible
    expect(screen.getByText(/SkyLynx is your ultimate travel companion, designed to simplify the process of searching and booking flights, hotels, and other travel services. With a user-friendly interface, you can easily compare prices, read reviews, and make bookings in just a few clicks./)).toBeInTheDocument();
    
    // Click again to close
    fireEvent.click(firstQuestion);
    
    // Answer should be hidden again
    expect(screen.queryByText(/SkyLynx is your ultimate travel companion, designed to simplify the process of searching and booking flights, hotels, and other travel services. With a user-friendly interface, you can easily compare prices, read reviews, and make bookings in just a few clicks./)).not.toBeInTheDocument();
  });

  test('renders all FAQ questions', () => {
    render(
      <BrowserRouter>
        <FAQ {...mockProps} />
      </BrowserRouter>
    );

    const expectedQuestions = [
        'What is SkyLynx and how does it work?',
        'Where can I find your terms of use and privacy policy?',
        'Is there a mobile app for SkyLynx?',
        'What sets SkyLynx apart from other travel platforms?',
        'What should I do if my question isn\'t listed here?',
        'How can I contact SkyLynx customer support?',
        'How do I track my refund status?',
        'What is the process for canceling my ticket?',
        'How do I request a refund for my booking?',
        'Can you explain your Customer Grievance Redressal policy?'
    ];

    expectedQuestions.forEach(question => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  test('maintains only one answer visible at a time', () => {
    render(
      <BrowserRouter>
        <FAQ {...mockProps} />
      </BrowserRouter>
    );

    // Click first question
    fireEvent.click(screen.getByText(/What is SkyLynx and how does it work\?/));
    expect(screen.getByText(/SkyLynx is your ultimate travel companion, designed to simplify the process of searching and booking flights, hotels, and other travel services. With a user-friendly interface, you can easily compare prices, read reviews, and make bookings in just a few clicks./)).toBeInTheDocument();

    // Click second question
    fireEvent.click(screen.getByText(/What should I do if my question isn't listed here?/));
    
    // First answer should be hidden
    expect(screen.queryByText(/SkyLynx is your ultimate travel companion, designed to simplify the process of searching and booking flights, hotels, and other travel services. With a user-friendly interface, you can easily compare prices, read reviews, and make bookings in just a few clicks./)).not.toBeInTheDocument();
    // Second answer should be visible
    expect(screen.getByText(/If you have additional questions or need further assistance, please reach out to our support team via email or live chat. We're here to help!/)).toBeInTheDocument();
  });
}); 