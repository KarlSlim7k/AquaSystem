import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usuarioAguaService } from '../services/usuarioAguaService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function UsuarioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isCensador = user?.rol === 'censador';
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    cargarUsuario();
  }, [id]);

  const cargarUsuario = async () => {
    try {
      setLoading(true);
      const response = await usuarioAguaService.getById(id);
      console.log('Respuesta usuario detalle:', response);
      // El servicio retorna response.data que contiene { success, data }
      setUsuario(response.data || response);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      setError('Error al cargar el usuario: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    try {
      setDeleting(true);
      await usuarioAguaService.delete(id);
      navigate('/usuarios', { 
        state: { message: 'Usuario dado de baja exitosamente' }
      });
    } catch (err) {
      setError('Error al dar de baja: ' + (err.response?.data?.message || err.message));
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando información del usuario..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorAlert message={error} onClose={() => navigate('/usuarios')} />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Usuario no encontrado</p>
      </div>
    );
  }

  const getEstatusBadge = (estatus) => {
    const styles = {
      activo: 'bg-green-100 text-green-800',
      suspendido: 'bg-yellow-100 text-yellow-800',
      baja: 'bg-red-100 text-red-800'
    };
    const labels = {
      activo: 'Activo',
      suspendido: 'Suspendido',
      baja: 'Baja'
    };
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[estatus] || 'bg-gray-100 text-gray-800'}`}>
        {labels[estatus] || estatus}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/usuarios')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Detalle del Usuario</h1>
            <p className="text-gray-600 mt-1">Información completa del usuario de agua</p>
          </div>
          {!isCensador && (
            <div className="flex gap-2">
              <Link
                to={`/usuarios/${id}/editar`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={usuario.estatus === 'baja'}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Dar de Baja
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos Generales */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Datos Generales</h2>
              {getEstatusBadge(usuario.estatus)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">No. de Cuenta</label>
                <p className="text-gray-900 font-semibold text-lg">{usuario.numero_cuenta}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                <p className="text-gray-900">{new Date(usuario.fecha_registro).toLocaleDateString('es-MX')}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                <p className="text-gray-900 text-lg">{usuario.nombre_completo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-gray-900">{usuario.telefono || 'No registrado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{usuario.email || 'No registrado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo de Propiedad</label>
                <p className="text-gray-900">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    usuario.tipo_propiedad === 'Residencial' 
                      ? 'bg-blue-100 text-blue-800' 
                      : usuario.tipo_propiedad === 'Comercial'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {usuario.tipo_propiedad || 'Residencial'}
                  </span>
                </p>
              </div>
              {usuario.identificacion_oficial && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Identificación Oficial</label>
                  <p className="text-gray-900">{usuario.identificacion_oficial}</p>
                </div>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dirección</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Calle</label>
                <p className="text-gray-900">{usuario.calle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">No. Exterior</label>
                <p className="text-gray-900">{usuario.numero_exterior || 'S/N'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">No. Interior</label>
                <p className="text-gray-900">{usuario.numero_interior || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Colonia</label>
                <p className="text-gray-900">{usuario.colonia}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Código Postal</label>
                <p className="text-gray-900">{usuario.codigo_postal || 'No registrado'}</p>
              </div>
              {usuario.referencias && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Referencias</label>
                  <p className="text-gray-900">{usuario.referencias}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ubicación GPS */}
          {(usuario.latitud && usuario.longitud) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ubicación GPS</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Latitud</label>
                  <p className="text-gray-900 font-mono">{usuario.latitud}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Longitud</label>
                  <p className="text-gray-900 font-mono">{usuario.longitud}</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps?q=${usuario.latitud},${usuario.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ver en Google Maps
              </a>
            </div>
          )}

          {/* Notas */}
          {usuario.notas && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notas</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{usuario.notas}</p>
            </div>
          )}
        </div>

        {/* Fotografías */}
        <div className="space-y-6">
          {/* Foto Domicilio */}
          {usuario.foto_domicilio && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Foto del Domicilio</h3>
              <img
                src={usuario.foto_domicilio_url || `/storage/${usuario.foto_domicilio}`}
                alt="Domicilio"
                className="w-full rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Foto Medidor */}
          {usuario.foto_medidor && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Foto del Medidor</h3>
              <img
                src={usuario.foto_medidor_url || `/storage/${usuario.foto_medidor}`}
                alt="Medidor"
                className="w-full rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Baja</h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas dar de baja a <strong>{usuario.nombre_completo}</strong>?
              Esta acción cambiará el estado del usuario a "Suspendido".
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Dando de baja...' : 'Confirmar Baja'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuarioDetalle;
