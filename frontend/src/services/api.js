import axios from 'axios';

// URL del backend - Configurado para tunnels
const API_BASE_URL = 'https://fs151wjc-443.usw3.devtunnels.ms/';

console.log('🌐 API Base URL configurada:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Desactivado para tunnels
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
  async (config) => {
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
