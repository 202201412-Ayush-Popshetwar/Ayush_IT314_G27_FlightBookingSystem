import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutUs from '../../components/AboutUs.jsx';

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

describe('AboutUs Component', () => {
  const mockProps = {
    loggedInUser: 'testUser',
    setLoggedInUser: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays team section content', () => {
    render(
      <BrowserRouter>
        <AboutUs {...mockProps} />
      </BrowserRouter>
    );

    // Click the "Our Team" button to activate the section
    const teamButton = screen.getByRole('button', { name: /our team/i });
    fireEvent.click(teamButton);

    // Check for team section heading
    expect(screen.getByText('Meet Our Team')).toBeInTheDocument();

    // Check for team members
    const teamMembers = [
      'Raj Shah',
      'Swapnil Shukla',
      'Ayush Popshetwar',
      'Harshvardhan Vajani',
      'Manthan Parmar',
      'Isha Bhanushali',
      'Natansh Shah',
      'Aditya Desai'
    ];

    teamMembers.forEach(member => {
      expect(screen.getByText(member)).toBeInTheDocument();
    });
  });

  test('switches between about and team sections', () => {
    render(
      <BrowserRouter>
        <AboutUs {...mockProps} />
      </BrowserRouter>
    );

    // Initially About section should be visible
    expect(screen.getByText('About Us')).toBeInTheDocument();
    
    // Click team button
    const teamButton = screen.getByRole('button', { name: /our team/i });
    fireEvent.click(teamButton);
    
    // Team section should be visible
    expect(screen.getByText('Meet Our Team')).toBeInTheDocument();
    
    // Click about button
    const aboutButton = screen.getByRole('button', { name: /About/i });
    fireEvent.click(aboutButton);
    
    // About section should be visible again
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  test('displays company values and features', () => {
    render(
      <BrowserRouter>
        <AboutUs {...mockProps} />
      </BrowserRouter>
    );

    // Click the "Our Goals" button to activate the section
    const goalsButton = screen.getByRole('button', { name: /our goals/i });
    fireEvent.click(goalsButton);

    const expectedContent = [
      'Customer Satisfaction',
      'Reliability',
      'Innovation',
      'Best Prices',
      '24/7 Support'
    ];

    expectedContent.forEach(content => {
      expect(screen.getByText(new RegExp(content, 'i'))).toBeInTheDocument();
    });
  });

}); 