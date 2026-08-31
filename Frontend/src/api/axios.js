import axios from "axios";

const normalizeApiBaseUrl = () => {
    const configured = (import.meta.env.VITE_API_URL || "https://job-portal-v23h.onrender.com").trim();
    const cleaned = configured.replace(/\/+$/, "");
    return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
};

const API = axios.create({
    baseURL: normalizeApiBaseUrl(),
    withCredentials: true
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;