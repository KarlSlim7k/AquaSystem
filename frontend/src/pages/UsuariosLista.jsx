import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usuarioAguaService } from '../services/usuarioAguaService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function UsuariosLista() {
  const { user } = useSelector((state) => state.auth);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Verificar si el usuario es censador
  const isCensador = user?.rol === 'censador';

  useEffect(() => {
    cargarUsuarios();
  }, [currentPage, search]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioAguaService.getAll({
        page: currentPage,
        search: search,
        per_page: 15
      });
      // Asegurar que siempre sea un array
      let usuariosData = [];
      
      if (Array.isArray(response.data)) {
        usuariosData = response.data;
      } else if (Array.isArray(response)) {
        usuariosData = response;
      } else if (response.data && Array.isArray(response.data.data)) {
        // Caso: {success: true, data: [...]}
        usuariosData = response.data.data;
      }
      
      setUsuarios(usuariosData);
      setTotalPages(response.last_page || 1);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios: ' + (err.response?.data?.message || err.message));
      setUsuarios([]); // Importante: siempre inicializar como array
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    cargarUsuarios();
  };

  if (loading && currentPage === 1) {
    return <LoadingSpinner message="Cargando usuarios..." />;
  }

  return (
    <div className="px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Usuarios del Servicio</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Gestión de usuarios de agua potable</p>
        </div>
        <Link
          to="/usuarios/nuevo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Usuario
        </Link>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, número de cuenta..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 sm:gap-4">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Buscar
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setCurrentPage(1); }}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Limpiar
              </button>
            )}
          </div>
        </form>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Vista de tabla para pantallas grandes */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Cuenta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colonia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    {search ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {usuario.numero_cuenta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.nombre_completo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {usuario.calle} {usuario.numero_exterior} {usuario.numero_interior && `Int. ${usuario.numero_interior}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {usuario.colonia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.tipo_propiedad === 'Residencial' 
                          ? 'bg-blue-100 text-blue-800' 
                          : usuario.tipo_propiedad === 'Comercial'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {usuario.tipo_propiedad || 'Residencial'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {usuario.telefono || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.estatus === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : usuario.estatus === 'suspendido'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.estatus === 'activo' ? 'Activo' : usuario.estatus === 'suspendido' ? 'Suspendido' : 'Baja'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/usuarios/${usuario.id_usuario}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Ver
                      </Link>
                      {!isCensador && (
                        <Link
                          to={`/usuarios/${usuario.id_usuario}/editar`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Editar
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de tarjetas para móviles y tablets */}
      <div className="lg:hidden space-y-4">
        {usuarios.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            {search ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
          </div>
        ) : (
          usuarios.map((usuario) => (
            <div key={usuario.id_usuario} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              {/* Header de la tarjeta */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {usuario.nombre_completo}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    {usuario.numero_cuenta}
                  </p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mt-2 ${
                    usuario.tipo_propiedad === 'Residencial' 
                      ? 'bg-blue-100 text-blue-800' 
                      : usuario.tipo_propiedad === 'Comercial'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {usuario.tipo_propiedad || 'Residencial'}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                  usuario.estatus === 'activo' 
                    ? 'bg-green-100 text-green-800' 
                    : usuario.estatus === 'suspendido'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {usuario.estatus === 'activo' ? 'Activo' : usuario.estatus === 'suspendido' ? 'Suspendido' : 'Baja'}
                </span>
              </div>

              {/* Información de la tarjeta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-sm text-gray-700 flex-1">
                    <p>{usuario.calle} {usuario.numero_exterior} {usuario.numero_interior && `Int. ${usuario.numero_interior}`}</p>
                    <p className="text-gray-600">{usuario.colonia}</p>
                  </div>
                </div>

                {usuario.telefono && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-700">{usuario.telefono}</span>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <Link
                  to={`/usuarios/${usuario.id_usuario}`}
                  className="flex-1 text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Ver Detalles
                </Link>
                {!isCensador && (
                  <Link
                    to={`/usuarios/${usuario.id_usuario}/editar`}
                    className="flex-1 text-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    Editar
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación compartida */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-md px-4 py-3 flex items-center justify-between border-t border-gray-200 mt-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700 flex items-center">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Página <span className="font-medium">{currentPage}</span> de{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsuariosLista;
