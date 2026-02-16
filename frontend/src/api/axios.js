import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * - baseURL points to our Express API (proxied by Vite in dev).
 * - An interceptor automatically attaches the JWT token from localStorage.
 */
const API = axios.create({
    baseURL: '/api',
});

// Request interceptor: attach Bearer token if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
