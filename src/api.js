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
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = `Bearer  ${token}`;
  return config;
});

export default api;
