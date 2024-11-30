import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchItem from '../../components/SearchItem';

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('SearchItem Component', () => {
  const mockFlight = {
    airline: 'SpiceJet',
    flight_num: 'SG-9001',
    price: '5,000',
    duration: '2h 30m',
    stops: 'non-stop',
    class: 'economy',
    departure_time: '10:00',
    arrival_time: '12:30'
  };

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
    expect(screen.getByText('SG-9001')).toBeInTheDocument();
    expect(screen.getByText('₹5,000')).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
    expect(screen.getByText('non-stop')).toBeInTheDocument();
    expect(screen.getByText('economy')).toBeInTheDocument();
  });

  test('handles book button click for logged in user', () => {
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

    const bookButton = screen.getByRole('button', { name: /book now/i });
    fireEvent.click(bookButton);

    expect(mockNavigate).toHaveBeenCalledWith('/book', {
      state: { flight: mockFlight }
    });
  });

  test('redirects to login for non-logged in user', () => {
    render(
      <BrowserRouter>
        <SearchItem 
          flight={mockFlight} 
          loggedInUser={null}
          setLoggedInUser={() => {}}
        />
      </BrowserRouter>
    );

    const bookButton = screen.getByRole('button', { name: /book now/i });
    fireEvent.click(bookButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('displays airline logo', () => {
    render(
      <BrowserRouter>
        <SearchItem 
          flight={mockFlight} 
          loggedInUser={null}
          setLoggedInUser={() => {}}
        />
      </BrowserRouter>
    );

    const logo = screen.getByAltText('SpiceJet');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('spiceJet.png'));
  });

  test('formats time and duration correctly', () => {
    render(
      <BrowserRouter>
        <SearchItem 
          flight={mockFlight} 
          loggedInUser={null}
          setLoggedInUser={() => {}}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('12:30')).toBeInTheDocument();
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });

  test('handles missing flight data gracefully', () => {
    const incompleteFlight = {
      airline: 'SpiceJet',
      flight_num: 'SG-9001'
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
    expect(screen.getByText('SG-9001')).toBeInTheDocument();
  });
}); 