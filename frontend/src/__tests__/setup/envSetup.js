process.env.NODE_ENV = 'test';
process.env.VITE_BACKEND_URL = 'https://skylynx-backend.onrender.com';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
  }
}));

// Mock airline logos
jest.mock('../../utils/airlineLogos', () => ({
  getAirlineLogo: jest.fn().mockReturnValue('/img/logo/default.png')
}));

// Mock window.env
window.env = {
  VITE_BACKEND_URL: 'https://skylynx-backend.onrender.com'
};