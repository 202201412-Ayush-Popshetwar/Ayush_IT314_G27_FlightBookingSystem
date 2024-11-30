const getApiUrl = () => {
  if (process.env.NODE_ENV === 'test') {
    return 'https://skylynx-backend.onrender.com';
  }
  return import.meta.env.VITE_BACKEND_URL || 'https://skylynx-backend.onrender.com';
};

export { getApiUrl }; 