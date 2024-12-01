import { React } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MailList from '../../components/MailList';
import { handleSuccess, handleError } from '../../utils.jsx';

// Mock the utils functions
jest.mock('../../utils', () => ({
  handleSuccess: jest.fn(),
  handleError: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

describe('MailList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders subscription form correctly', () => {
    render(
      <BrowserRouter>
        <MailList />
      </BrowserRouter>
    );

    expect(screen.getByText('Save time, save money!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  test('handles empty email submission', async () => {
    render(
      <BrowserRouter>
        <MailList />
      </BrowserRouter>
    );

    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });
    fireEvent.click(subscribeButton);

    expect(handleError).toHaveBeenCalledWith('Please enter an email address');
  });

  test('handles successful subscription', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Successfully subscribed!' })
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <MailList />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Your Email');
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith('Successfully subscribed!');
    });

    expect(emailInput.value).toBe('');
  });

  test('handles subscription failure', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ success: false, message: 'Failed to subscribe' })
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <MailList />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Your Email');
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(handleError).toHaveBeenCalledWith('Failed to subscribe');
    });
  });

  test('handles network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <MailList />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Your Email');
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(handleError).toHaveBeenCalledWith('Network error. Please check your connection and try again.');
    });
  });

  test('shows loading state during subscription', async () => {
    const mockResponse = {
      ok: true,
      json: () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <MailList />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Your Email');
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);

    expect(screen.getByText('Subscribing...')).toBeInTheDocument();
  });
}); 