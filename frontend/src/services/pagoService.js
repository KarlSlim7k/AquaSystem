import api from './api';

const pagoService = {
  // Obtener todos los pagos con filtros
  getAll: async (params = {}) => {
    const response = await api.get('/api/pagos', { params });
    return response.data;
  },

  // Obtener un pago por ID
  getById: async (id) => {
    const response = await api.get(`/api/pagos/${id}`);
    return response.data;
  },

  // Crear un nuevo pago
  create: async (data) => {
    const response = await api.post('/api/pagos', data);
    return response.data;
  },

  // Actualizar un pago
  update: async (id, data) => {
    const response = await api.put(`/api/pagos/${id}`, data);
    return response.data;
  },

  // Cancelar un pago
  delete: async (id) => {
    const response = await api.delete(`/api/pagos/${id}`);
    return response.data;
  },

  // Obtener estadísticas de pagos
  getEstadisticas: async (params = {}) => {
    const response = await api.get('/api/pagos-estadisticas', { params });
    return response.data;
  },

  // Obtener historial de pagos de un usuario
  getHistorialUsuario: async (idUsuario) => {
    const response = await api.get(`/api/pagos-usuario/${idUsuario}`);
    return response.data;
  },

  // Generar número de recibo único
  generarNumeroRecibo: async () => {
    const response = await api.get('/api/generar-numero-recibo');
    return response.data;
  }
};

export default pagoService;
