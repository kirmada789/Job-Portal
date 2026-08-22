import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // Cookies (JWT) ke liye zaroori hai
});

export default api;