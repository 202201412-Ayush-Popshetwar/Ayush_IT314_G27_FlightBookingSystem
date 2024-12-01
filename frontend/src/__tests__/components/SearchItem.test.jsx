import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchItem from '../../components/SearchItem';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock localStorage properly
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

// Create a proper mock implementation
mockLocalStorage.getItem.mockImplementation(() => 
  JSON.stringify({
    options: { adult: 1, children: 0 },
    date: [{ startDate: '2024-12-25' }]
  })
);

// Replace the global localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('SearchItem Component', () => {
  const mockFlight = {
    airline: 'SpiceJet',
    flight_num: 'SG-9001',
    price: '5,000',
    duration: '2h 30m',
    stops: 'non-stop',
    class: 'economy',
    dep_time: '10:00',
    arr_time: '12:30',
    from: 'Delhi',
    to: 'Mumbai',
    availableseats: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders flight details correctly', () => {
    render(
      <BrowserRouter>
        <SearchItem 
          flight={mockFlight} 
          loggedInUser={null} 
          setLoggedInUser={() => {}}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('SpiceJet')).toBeInTheDocument();
    expect(screen.getByText(/Flight SG-9001/)).toBeInTheDocument();
    expect(screen.getByText('₹5,000')).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
    expect(screen.getByText('Non-stop')).toBeInTheDocument();
    expect(screen.getByText(/Class: economy/i)).toBeInTheDocument();
  });

  test('handles select button click for non-logged in user', () => {
    render(
      <BrowserRouter>
        <SearchItem 
          flight={mockFlight} 
          loggedInUser={null}
          setLoggedInUser={() => {}}
        />
      </BrowserRouter>
    );

    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('handles select button click for logged in user', () => {
    const mockUser = { id: 1, name: 'Test User' };
    
    render(
      <BrowserRouter>
        <SearchItem 
          flight={mockFlight} 
          loggedInUser={mockUser}
          setLoggedInUser={() => {}}
        />
      </BrowserRouter>
    );

    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);

    expect(mockNavigate).toHaveBeenCalledWith('/booking');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  test('handles missing flight data gracefully', () => {
    const incompleteFlight = {
      airline: 'SpiceJet',
      flight_num: 'SG-9001',
      availableseats: 10
    };

    render(
      <BrowserRouter>
        <SearchItem 
          flight={incompleteFlight} 
          loggedInUser={null}
          setLoggedInUser={() => {}}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('SpiceJet')).toBeInTheDocument();
    expect(screen.getByText(/Flight SG-9001/)).toBeInTheDocument();
  });

  test('disables select button for fully booked flights', () => {
    const bookedFlight = {
      ...mockFlight,
      availableseats: 0
    };

    render(
      <BrowserRouter>
        <SearchItem 
          flight={bookedFlight} 
          loggedInUser={null}
          setLoggedInUser={() => {}}
        />
      </BrowserRouter>
    );

    const selectButton = screen.getByRole('button', { name: /fully booked/i });
    expect(selectButton).toBeDisabled();
  });
}); 