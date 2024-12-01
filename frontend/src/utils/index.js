export const handleError = (message) => {
  if (process.env.NODE_ENV === 'test') {
    // For testing purposes, render the error message in a div
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
  } else {
    alert(message);
  }
}; 