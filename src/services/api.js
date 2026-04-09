import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for our Go backend API
// When testing on your computer via Expo web, localhost works fine
// When testing on a physical device, replace with your Mac's local IP address (e.g. http://192.168.1.x:8080)
const BASE_URL = 'http://localhost:8080';

// Create an axios instance with our base URL and default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios request interceptor — runs before every API call
// Automatically attaches the JWT token to every request so we
// don't have to manually add it in every screen
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────

// Register a new user account
export const register = async (email, password, name) => {
  const response = await api.post('/v1/register', { email, password, name });
  return response.data;
};

// Log in with email and password — returns user info and JWT token
export const login = async (email, password) => {
  const response = await api.post('/v1/login', { email, password });
  return response.data;
};

// ─── Entries ─────────────────────────────────────────────────────────────────

// Fetch all journal entries for the logged-in user
export const getEntries = async () => {
  const response = await api.get('/v1/entries');
  return response.data;
};

// Create a new journal entry
export const createEntry = async (title, body, tags) => {
  const response = await api.post('/v1/entries', { title, body, tags });
  return response.data;
};

// Delete a journal entry by ID
export const deleteEntry = async (id) => {
  await api.delete(`/v1/entries/${id}`);
};

export default api;