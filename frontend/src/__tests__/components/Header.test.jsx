import React from 'react';
import { format } from 'date-fns';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from '../../components/Header';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Basic Render
  test('renders header component correctly', () => {
    render(
      <BrowserRouter>
        <Header type="home" />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Fly Smart/i)).toBeInTheDocument();
  });

  // Test 2: Search Form Functionality
  test('handles search form inputs and submission', async () => {
    render(
      <BrowserRouter>
        <Header type="home" />
      </BrowserRouter>
    );

    // Test From dropdown
    const fromInput = screen.getByTestId('from-input');
    fireEvent.change(fromInput, { target: { value: 'Delhi' } });
    expect(fromInput.value).toBe('Delhi');

    // Test To dropdown
    const toInput = screen.getByTestId('to-input');
    fireEvent.change(toInput, { target: { value: 'Mumbai' } });
    expect(toInput.value).toBe('Mumbai');

    // Test search button
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith('/flights', {
      state: expect.objectContaining({
        from: 'Delhi',
        to: 'Mumbai'
      })
    });
  });

  // Test 3: Date Picker
  test('handles date selection correctly', async () => {
    render(
      <BrowserRouter>
        <Header type="home" />
      </BrowserRouter>
    );

    const dateButton = screen.getByTestId('date-button');
    fireEvent.click(dateButton);

    // Wait for date picker to appear
    await waitFor(() => {
      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    });

    // Get the current date from the component's initial state
    const currentDate = new Date('2023-06-26');
    const dateToSelect = currentDate.getDate().toString();

    // Select the current date
    const dateCell = screen.getByText(dateToSelect);
    fireEvent.click(dateCell);

    // Verify the date was selected by checking the button text
    expect(dateButton).toHaveTextContent(format(currentDate, 'MM/dd/yyyy'));
  });

  // Test 4: Passenger Options
  test('handles passenger selection correctly', async () => {
    render(
      <BrowserRouter>
        <Header type="home" />
      </BrowserRouter>
    );

    // Open passenger options
    const optionsButton = screen.getByTestId('options-button');
    fireEvent.click(optionsButton);

    // Test adult count
    const adultIncrement = screen.getByTestId('adult-increment');
    fireEvent.click(adultIncrement);
    expect(screen.getByTestId('adult-count')).toHaveTextContent('2');

    // Test children count
    const childIncrement = screen.getByTestId('children-increment');
    fireEvent.click(childIncrement);
    expect(screen.getByTestId('children-count')).toHaveTextContent('1');

    // Test decrement
    const adultDecrement = screen.getByTestId('adult-decrement');
    fireEvent.click(adultDecrement);
    expect(screen.getByTestId('adult-count')).toHaveTextContent('1');
  });

  // Test 5: Validation
  test('shows error when required fields are empty', async () => {
    render(
      <BrowserRouter>
        <Header type="home" />
      </BrowserRouter>
    );

    // Click search without filling required fields
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Please enter both origin and destination cities/i)).toBeInTheDocument();
    });
  });

  // Test 6: List View
  test('renders minimal header in list view', () => {
    render(
      <BrowserRouter>
        <Header type="list" />
      </BrowserRouter>
    );

    // Check that search form is not rendered
    expect(screen.queryByTestId('search-form')).not.toBeInTheDocument();
  });
}); 