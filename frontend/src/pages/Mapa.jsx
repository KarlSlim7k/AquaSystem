import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dashboardService from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

// Fix para los íconos de Leaflet en React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Íconos personalizados por estatus de pago
const iconoAlCorriente = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguNCAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIwLjkgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiIGZpbGw9IiMxMGI5ODEiLz48L3N2Zz4=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41]
});

const iconoProximoVencer = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguNCAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIwLjkgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiIGZpbGw9IiNlYWIzMDgiLz48L3N2Zz4=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41]
});

const iconoMoroso = new Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguNCAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIwLjkgMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC15LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiIGZpbGw9IiNlZjQ0NDQiLz48L3N2Zz4=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41]
});

// Componente para centrar el mapa cuando cambian los filtros
function CentrarMapa({ usuarios }) {
  const map = useMap();
  
  useEffect(() => {
    if (usuarios.length > 0) {
      const bounds = usuarios.map(u => [u.latitud, u.longitud]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [usuarios, map]);
  
  return null;
}

const Mapa = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroColonia, setFiltroColonia] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('');
  const [colonias, setColonias] = useState([]);

  // Centro predeterminado (Calera Tenextepec, Veracruz aproximado)
  const centroDefault = [19.6667, -96.9833];
  const zoomDefault = 14;

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroColonia, filtroEstatus, usuarios]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getUsuariosParaMapa();
      setUsuarios(data.usuarios || []);
      
      // Extraer colonias únicas
      const coloniasUnicas = [...new Set(data.usuarios.map(u => u.colonia))].filter(Boolean);
      setColonias(coloniasUnicas.sort());
      
    } catch (err) {
      setError('Error al cargar usuarios para el mapa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let usuariosFiltrados = [...usuarios];

    if (filtroColonia) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.colonia === filtroColonia);
    }

    if (filtroEstatus) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.estatus_pago === filtroEstatus);
    }

    setUsuariosFiltrados(usuariosFiltrados);
  };

  const obtenerIcono = (estatusPago) => {
    switch (estatusPago) {
      case 'al_corriente':
        return iconoAlCorriente;
      case 'proximo_vencer':
        return iconoProximoVencer;
      case 'moroso':
        return iconoMoroso;
      default:
        return iconoAlCorriente;
    }
  };

  const obtenerBadgeEstatus = (estatusPago) => {
    switch (estatusPago) {
      case 'al_corriente':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Al corriente</span>;
      case 'proximo_vencer':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Próximo a vencer</span>;
      case 'moroso':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Moroso</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Desconocido</span>;
    }
  };

  const limpiarFiltros = () => {
    setFiltroColonia('');
    setFiltroEstatus('');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Usuarios</h1>
          <p className="text-sm text-gray-600 mt-1">
            {usuariosFiltrados.length} de {usuarios.length} usuarios mostrados
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por colonia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colonia
            </label>
            <select
              value={filtroColonia}
              onChange={(e) => setFiltroColonia(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las colonias</option>
              {colonias.map(colonia => (
                <option key={colonia} value={colonia}>{colonia}</option>
              ))}
            </select>
          </div>

          {/* Filtro por estatus de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estatus de Pago
            </label>
            <select
              value={filtroEstatus}
              onChange={(e) => setFiltroEstatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estatus</option>
              <option value="al_corriente">Al corriente</option>
              <option value="proximo_vencer">Próximo a vencer</option>
              <option value="moroso">Moroso</option>
            </select>
          </div>

          {/* Botón limpiar */}
          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Leyenda */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Leyenda:</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Al corriente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Próximo a vencer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Moroso</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={centroDefault}
          zoom={zoomDefault}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {usuariosFiltrados.map((usuario) => (
            <Marker
              key={usuario.id_usuario}
              position={[usuario.latitud, usuario.longitud]}
              icon={obtenerIcono(usuario.estatus_pago)}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-bold text-gray-900 mb-2">{usuario.nombre_completo}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Cuenta:</span> {usuario.numero_cuenta}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Dirección:</span> {usuario.direccion}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Colonia:</span> {usuario.colonia}
                    </p>
                    <div className="mt-2">
                      {obtenerBadgeEstatus(usuario.estatus_pago)}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <a
                      href={`/usuarios/${usuario.id_usuario}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver detalles →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <CentrarMapa usuarios={usuariosFiltrados} />
        </MapContainer>
      </div>

      {/* Información adicional */}
      {usuariosFiltrados.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-900">No hay usuarios con estas características</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Intenta cambiar los filtros para ver más resultados en el mapa.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mapa;
