import api from './api';

const dashboardService = {
  // Obtener estadísticas generales
  getEstadisticas: async () => {
    const response = await api.get('/api/dashboard/estadisticas');
    return response.data;
  },

  // Obtener usuarios para el mapa
  getUsuariosParaMapa: async () => {
    const response = await api.get('/api/dashboard/mapa-usuarios');
    return response.data;
  },
};

export default dashboardService;
