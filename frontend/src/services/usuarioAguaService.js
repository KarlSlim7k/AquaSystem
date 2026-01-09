import api from './api';

export const usuarioAguaService = {
  // Listar usuarios con paginación y filtros
  async getAll(params = {}) {
    const response = await api.get('/api/usuarios-agua', { params });
    return response.data;
  },

  // Obtener un usuario por ID
  async getById(id) {
    const response = await api.get(`/api/usuarios-agua/${id}`);
    return response.data;
  },

  // Crear nuevo usuario
  async create(data) {
    const formData = new FormData();
    
    // Agregar campos de texto
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && key !== 'foto_domicilio' && key !== 'foto_medidor') {
        formData.append(key, data[key]);
      }
    });

    // Agregar archivos si existen
    if (data.foto_domicilio instanceof File) {
      formData.append('foto_domicilio', data.foto_domicilio);
    }
    if (data.foto_medidor instanceof File) {
      formData.append('foto_medidor', data.foto_medidor);
    }

    const response = await api.post('/api/usuarios-agua', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Actualizar usuario
  async update(id, data) {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && key !== 'foto_domicilio' && key !== 'foto_medidor') {
        formData.append(key, data[key]);
      }
    });

    if (data.foto_domicilio instanceof File) {
      formData.append('foto_domicilio', data.foto_domicilio);
    }
    if (data.foto_medidor instanceof File) {
      formData.append('foto_medidor', data.foto_medidor);
    }

    const response = await api.post(`/api/usuarios-agua/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Desactivar usuario
  async delete(id) {
    const response = await api.delete(`/api/usuarios-agua/${id}`);
    return response.data;
  },

  // Obtener lista de colonias
  async getColonias() {
    const response = await api.get('/api/colonias');
    return response.data;
  }
};
