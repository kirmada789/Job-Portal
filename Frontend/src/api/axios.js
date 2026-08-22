import axios from 'axios';

const api = axios.create({
  baseURL: "https://job-portal-v23h.onrender.com/api",
  withCredentials: true, // Cookies (JWT) ke liye zaroori hai
});

export default api;