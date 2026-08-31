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

export default API;