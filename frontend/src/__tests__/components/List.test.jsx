import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import List from '../../components/List';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

// Mock components
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

jest.mock('../../components/SearchItem', () => {
  return function MockSearchItem({ flight }) {
    return <div data-testid="mock-search-item">{flight.airline}</div>;
  };
});

// Mock the config utility
jest.mock('../../utils/config', () => ({
  getApiUrl: () => 'https://skylynx-backend.onrender.com'
}));

// Mock axios
jest.mock('axios');

// Mock the environment variables
const originalEnv = process.env;

beforeAll(() => {
  process.env = {
    ...originalEnv,
    VITE_BACKEND_URL: 'http://localhost:3000'
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Mock react-router-dom's useLocation
const mockLocation = {
  state: {
    from: 'Delhi',
    to: 'Mumbai',
    date: [{
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-02'),
      key: 'selection'
    }],
    options: {
      adult: 1,
      children: 0
    }
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation
}));

describe('List Component', () => {
  beforeEach(() => {
    axios.get.mockReset();
    localStorage.clear();
  });

  test('renders List component with initial state', () => {
    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByText('Travel Dates')).toBeInTheDocument();
    expect(screen.getByText('Passengers')).toBeInTheDocument();
  });

  test('handles date picker interactions', async () => {
    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    const dateButton = screen.getByText(/to/);
    fireEvent.click(dateButton);
    expect(screen.getByRole('application')).toBeInTheDocument();

    // Click outside to close date picker
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole('application')).not.toBeInTheDocument();
    });
  });

  test('handles passenger options interactions', async () => {
    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    const passengersButton = screen.getByText(/adult/);
    fireEvent.click(passengersButton);

    const adultIncreaseButton = screen.getByRole('button', { name: '+' });
    const adultDecreaseButton = screen.getByRole('button', { name: '-' });

    fireEvent.click(adultIncreaseButton);
    expect(screen.getByText('2 adults, 0 children')).toBeInTheDocument();

    fireEvent.click(adultDecreaseButton);
    expect(screen.getByText('1 adult, 0 children')).toBeInTheDocument();
  });

  test('handles flight filtering and sorting', async () => {
    const mockFlights = {
      data: {
        success: true,
        flights: [
          {
            airline: 'SpiceJet',
            flight_num: 'SG-9001',
            price: '5,000',
            duration: '2h 30m',
            stops: 'non-stop',
            class: 'economy'
          },
          {
            airline: 'IndiGo',
            flight_num: 'IN-2002',
            price: '4,000',
            duration: '3h 00m',
            stops: '1-stop',
            class: 'business'
          }
        ]
      }
    };

    axios.get.mockResolvedValueOnce(mockFlights);

    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    // Trigger initial search
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getAllByTestId('mock-search-item')).toHaveLength(2);
    });

    // Test price sorting (asc)
    const priceSort = screen.getByLabelText(/sort by price/i);
    fireEvent.change(priceSort, { target: { value: 'price_asc' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights[0]).toHaveTextContent('IndiGo');
    });

    // Test price sorting (desc)
    fireEvent.change(priceSort, { target: { value: 'price_desc' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights[0]).toHaveTextContent('SpiceJet');
    });

    // Test duration sorting (asc)
    const durationSort = screen.getByLabelText(/sort by duration/i);
    fireEvent.change(durationSort, { target: { value: 'duration_asc' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights[0]).toHaveTextContent('SpiceJet');
    });

    // Test duration sorting (desc)
    fireEvent.change(durationSort, { target: { value: 'duration_desc' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights[0]).toHaveTextContent('IndiGo');
    });

    // Test airline filter
    const airlineFilter = screen.getByLabelText(/filter by airline/i);
    fireEvent.change(airlineFilter, { target: { value: 'SpiceJet' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights).toHaveLength(1);
      expect(flights[0]).toHaveTextContent('SpiceJet');
    });

    // Test stops filter
    const stopsFilter = screen.getByLabelText(/filter by stops/i);
    fireEvent.change(stopsFilter, { target: { value: 'non-stop' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights).toHaveLength(1);
      expect(flights[0]).toHaveTextContent('non-stop');
    });

    // Test class filter
    const classFilter = screen.getByLabelText(/filter by class/i);
    fireEvent.change(classFilter, { target: { value: 'economy' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights).toHaveLength(1);
      expect(flights[0]).toHaveTextContent('economy');
    });
  });

  test('handles search with no results', async () => {
    axios.get.mockResolvedValueOnce({ data: { success: false, message: 'No flights found' } });

    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('No flights found')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('No flights found')).toBeInTheDocument();
    });
  });

  test('handles pagination', async () => {
    const mockFlights = {
      data: {
        success: true,
        flights: Array(15).fill({
          airline: 'SpiceJet',
          flight_num: 'SG-9001',
          price: '5,000',
          duration: '2h 30m',
          stops: 'non-stop',
          class: 'economy'
        })
      }
    };

    axios.get.mockResolvedValueOnce(mockFlights);

    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('mock-search-item')).toHaveLength(10);
    });

    const paginationButtons = screen.getAllByRole('button');
    const nextPageButton = paginationButtons[paginationButtons.length - 1];
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(screen.getAllByTestId('mock-search-item')).toHaveLength(5);
    });
  });
});

describe('List Component - Advanced Interactions', () => {
  test('handles date range selection', async () => {
    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    // Open date picker
    const dateButton = screen.getByText(/to/);
    fireEvent.click(dateButton);

    // Select dates
    const startDate = screen.getByLabelText('Choose date, selected date is');
    fireEvent.change(startDate, { target: { value: '2024-01-01' } });
    
    const endDate = screen.getByLabelText('Choose date, selected date is');
    fireEvent.change(endDate, { target: { value: '2024-01-02' } });

    // Verify date selection
    expect(screen.getByText('01/01/2024 to 01/02/2024')).toBeInTheDocument();
  });

  test('handles passenger options selection', async () => {
    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    // Open passenger options
    const passengerButton = screen.getByText(/adult/);
    fireEvent.click(passengerButton);

    // Test adult count
    const adultIncrease = screen.getByTestId('adult-increase');
    const adultDecrease = screen.getByTestId('adult-decrease');

    fireEvent.click(adultIncrease);
    fireEvent.click(adultIncrease);
    expect(screen.getByText('3 adults, 0 children')).toBeInTheDocument();

    fireEvent.click(adultDecrease);
    expect(screen.getByText('2 adults, 0 children')).toBeInTheDocument();

    // Test children count
    const childIncrease = screen.getByTestId('child-increase');
    const childDecrease = screen.getByTestId('child-decrease');

    fireEvent.click(childIncrease);
    fireEvent.click(childIncrease);
    expect(screen.getByText('2 adults, 2 children')).toBeInTheDocument();

    fireEvent.click(childDecrease);
    expect(screen.getByText('2 adults, 1 children')).toBeInTheDocument();
  });

  test('handles all filter combinations', async () => {
    const mockFlights = {
      data: {
        success: true,
        flights: [
          {
            airline: 'SpiceJet',
            flight_num: 'SG-9001',
            price: '5,000',
            duration: '2h 30m',
            stops: 'non-stop',
            class: 'economy'
          },
          {
            airline: 'IndiGo',
            flight_num: 'IN-2002',
            price: '4,000',
            duration: '3h 00m',
            stops: '1-stop',
            class: 'business'
          }
        ]
      }
    };

    axios.get.mockResolvedValueOnce(mockFlights);

    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    // Trigger search
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getAllByTestId('mock-search-item')).toHaveLength(2);
    });

    // Test price sorting
    const priceSort = screen.getByLabelText(/sort by price/i);
    fireEvent.change(priceSort, { target: { value: 'price_asc' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights[0]).toHaveTextContent('IndiGo');
    });

    // Test duration sorting
    const durationSort = screen.getByLabelText(/sort by duration/i);
    fireEvent.change(durationSort, { target: { value: 'duration_asc' } });
    await waitFor(() => {
      const flights = screen.getAllByTestId('mock-search-item');
      expect(flights[0]).toHaveTextContent('SpiceJet');
    });

    // Test airline filter
    const airlineFilter = screen.getByLabelText(/filter by airline/i);
    fireEvent.change(airlineFilter, { target: { value: 'SpiceJet' } });
    await waitFor(() => {
      expect(screen.getAllByTestId('mock-search-item')).toHaveLength(1);
      expect(screen.getByText('SpiceJet')).toBeInTheDocument();
    });

    // Test stops filter
    const stopsFilter = screen.getByLabelText(/filter by stops/i);
    fireEvent.change(stopsFilter, { target: { value: 'non-stop' } });
    await waitFor(() => {
      expect(screen.getAllByTestId('mock-search-item')).toHaveLength(1);
    });

    // Test class filter
    const classFilter = screen.getByLabelText(/filter by class/i);
    fireEvent.change(classFilter, { target: { value: 'economy' } });
    await waitFor(() => {
      expect(screen.getAllByTestId('mock-search-item')).toHaveLength(1);
    });
  });

  test('handles reset filters', async () => {
    const mockFlights = {
      data: {
        success: true,
        flights: Array(5).fill({
          airline: 'SpiceJet',
          flight_num: 'SG-9001',
          price: '5,000',
          duration: '2h 30m'
        })
      }
    };

    axios.get.mockResolvedValueOnce(mockFlights);

    render(
      <BrowserRouter>
        <List loggedInUser={null} setLoggedInUser={() => {}} />
      </BrowserRouter>
    );

    // Apply filters then reset
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getAllByTestId('mock-search-item')).toHaveLength(5);
    });

    const resetButton = screen.getByText(/reset/i);
    fireEvent.click(resetButton);

    // Verify all filters are reset
    const priceSort = screen.getByLabelText(/sort by price/i);
    const durationSort = screen.getByLabelText(/sort by duration/i);
    const airlineFilter = screen.getByLabelText(/filter by airline/i);
    const stopsFilter = screen.getByLabelText(/filter by stops/i);
    const classFilter = screen.getByLabelText(/filter by class/i);

    expect(priceSort.value).toBe('');
    expect(durationSort.value).toBe('');
    expect(airlineFilter.value).toBe('');
    expect(stopsFilter.value).toBe('');
    expect(classFilter.value).toBe('');
  });
});
