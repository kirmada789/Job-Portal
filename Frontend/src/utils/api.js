import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://job-portal-v23h.onrender.com/api",
    withCredentials: true
});

export default API;