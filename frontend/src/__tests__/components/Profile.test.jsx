import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../components/Profile';

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

describe('Profile Component', () => {
  const mockProps = {
    loggedInUser: 'testUser',
    setLoggedInUser: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user profile section with editable fields', () => {
    render(
      <BrowserRouter>
        <Profile {...mockProps} />
      </BrowserRouter>
    );

    // Check for user profile fields
    expect(screen.getByText('Username:')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Phone:')).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
  });

  test('handles passenger addition and form fields', async () => {
    render(
      <BrowserRouter>
        <Profile {...mockProps} />
      </BrowserRouter>
    );

    // Click add passenger button
    const addButton = screen.getByText(/Add Passenger/i);
    fireEvent.click(addButton);

    // Check for passenger form fields
    expect(screen.getByText('Designation:')).toBeInTheDocument();
    expect(screen.getByText('First Name:')).toBeInTheDocument();
    expect(screen.getByText('Last Name:')).toBeInTheDocument();
    expect(screen.getByText('Date of Birth:')).toBeInTheDocument();
    expect(screen.getByText('Phone:')).toBeInTheDocument();

    // Test designation dropdown
    const designationSelect = screen.getByRole('combobox');
    expect(designationSelect).toHaveValue('Mr');
    fireEvent.change(designationSelect, { target: { value: 'Ms' } });
    expect(designationSelect).toHaveValue('Ms');

    // Fill passenger details
    fireEvent.change(screen.getByRole('textbox', { name: /First Name/i }), {
      target: { value: 'Jane' }
    });
    fireEvent.change(screen.getByRole('textbox', { name: /Last Name/i }), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByRole('textbox', { name: /Phone/i }), {
      target: { value: '1234567890' }
    });
    
    // Test date picker
    const dateInput = screen.getByRole('textbox', { name: /Date of Birth/i });
    fireEvent.change(dateInput, { target: { value: '2000-01-01' } });
  });

  test('validates passenger form fields', async () => {
    render(
      <BrowserRouter>
        <Profile {...mockProps} />
      </BrowserRouter>
    );

    // Add a passenger
    const addButton = screen.getByText(/Add Passenger/i);
    fireEvent.click(addButton);

    // Try to save without filling required fields
    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/All details are required/i)).toBeInTheDocument();
    });

    // Test invalid phone number
    fireEvent.change(screen.getByRole('textbox', { name: /Phone/i }), {
      target: { value: '123' }
    });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText(/Phone number must be a 10-digit number/i)).toBeInTheDocument();
    });
  });

  test('limits passenger addition to maximum 4', () => {
    render(
      <BrowserRouter>
        <Profile {...mockProps} />
      </BrowserRouter>
    );

    const addButton = screen.getByText(/Add Passenger/i);

    // Add 4 passengers
    for (let i = 0; i < 4; i++) {
      fireEvent.click(addButton);
    }

    // Try to add one more
    fireEvent.click(addButton);

    // Should still have only 4 passenger forms
    const designationFields = screen.getAllByText('Designation:');
    expect(designationFields).toHaveLength(4);
  });
}); 