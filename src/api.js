/* eslint-disable no-param-reassign */
import axios from 'axios';

const baseURL = 'https://kanban-backend-production-d896.up.railway.app/';
// const baseURL = 'http://localhost:3000';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (config.url === '/login' || config.url === '/register') {
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  config.headers['Access-Control-Allow-Origin'] = 'https://kanban-frontend-nu.vercel.app';

  return config;
});

export default api;
