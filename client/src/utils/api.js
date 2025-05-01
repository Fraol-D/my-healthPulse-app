import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api', // Will use proxy in development
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle token expiration
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  validateToken: () => api.get('/auth/validate'),
  refreshToken: () => api.post('/auth/refresh'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/password', passwordData),
};

// Health data API calls
export const healthDataAPI = {
  addHealthData: (data) => api.post('/health-data', data),
  getHealthHistory: (params) => api.get('/health-data', { params }),
  deleteHealthRecord: (id) => api.delete(`/health-data/${id}`),
  getHealthRecord: (id) => api.get(`/health-data/${id}`),
};

// Predictions API calls
export const predictionsAPI = {
  getPredictions: () => api.get('/predictions'),
  getPredictionHistory: () => api.get('/predictions/history'),
  generateNewPrediction: () => api.post('/predictions/generate'),
};

// Reports API calls
export const reportsAPI = {
  getReports: () => api.get('/reports'),
  generateReport: (reportData) => api.post('/reports/generate', reportData),
  getReport: (id) => api.get(`/reports/${id}`),
  deleteReport: (id) => api.delete(`/reports/${id}`),
};

// Admin API calls
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  addUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settingsData) => api.put('/admin/settings', settingsData),
};

export default api; 