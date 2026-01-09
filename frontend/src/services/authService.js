import api from './api';

export const authService = {
  async login(credentials) {
    try {
      console.log('🔐 Intentando login con URL:', import.meta.env.VITE_API_URL);
      // Enviar como form-urlencoded para compatibilidad con el backend en el demo (devtunnels)
      const params = new URLSearchParams();
      params.append('username', credentials.username);
      params.append('password', credentials.password);
      const response = await api.post('/api/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('✅ Login exitoso:', response.data);
      
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.usuario));
      }
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('📡 Response:', error.response);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/api/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  async getMe() {
    const response = await api.get('/api/me');
    return response.data;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
