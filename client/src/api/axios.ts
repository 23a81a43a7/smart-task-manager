import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://smart-task-manager-q1xd.onrender.com/api', // Uses env variable in production
});

api.interceptors.request.use((config) => {
  const { user } = useAuthStore.getState();
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
