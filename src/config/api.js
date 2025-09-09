// API Configuration
export const API_CONFIG = {
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
  ENDPOINTS: {
    ZOHO_AUTH: '/zoho/auth',
    ZOHO_CALLBACK: '/zoho/callback',
    DASHBOARD: '/api/dashboard',
    EXPENSES: '/api/expenses',
    CONTACTS: '/api/contacts',
    ACCOUNTS: '/api/accounts'
  },
  // Default headers for API requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BACKEND_URL}${endpoint}`;
};
