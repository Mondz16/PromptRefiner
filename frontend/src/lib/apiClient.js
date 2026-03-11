import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  withCredentials: false,
});

let authToken = null;

instance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const apiClient = {
  setToken(token) {
    authToken = token;
  },
  register(data) {
    return instance.post('/auth/register', data);
  },
  login(data) {
    return instance.post('/auth/login', data);
  },
  forgotPassword(data) {
    return instance.post('/auth/forgot-password', data);
  },
  resetPassword(data) {
    return instance.post('/auth/reset-password', data);
  },
  verifyEmail(params) {
    return instance.get('/auth/verify-email', { params });
  },
  convertPrompt(data, demoUsage) {
    return instance.post('/prompt/convert', data, {
      headers: demoUsage !== undefined ? { 'x-demo-usage': demoUsage } : {},
    });
  },
  getTokenBalance() {
    return instance.get('/tokens/balance');
  },
  purchaseTokens(amount) {
    return instance.post('/tokens/purchase', { amount });
  },
};

