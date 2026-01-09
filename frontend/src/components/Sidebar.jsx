import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Sidebar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      roles: ['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador'],
    },
    {
      name: 'Censar Usuario',
      path: '/usuarios/nuevo',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      roles: ['administrador', 'gestor_campo', 'censador'],
    },
    {
      name: 'Usuarios del Servicio',
      path: '/usuarios',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      roles: ['administrador', 'gestor_campo', 'cobrador', 'censador', 'supervisor'],
    },
    {
      name: 'Registrar Pago',
      path: '/pagos/nuevo',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      roles: ['gestor_campo', 'cobrador'],
    },
    {
      name: 'Historial de Pagos',
      path: '/pagos',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      roles: ['administrador', 'gestor_campo', 'cobrador', 'contador', 'supervisor'],
    },
    {
      name: 'Mapa de Usuarios',
      path: '/mapa',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      roles: ['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador'],
    },
  ];

  // Filtrar menú según rol del usuario
  const filteredMenu = menuItems.filter(item => 
    item.roles.includes(user?.rol)
  );

  const isActive = (path) => {
    // Comparación exacta para evitar múltiples items activos
    if (path === '/usuarios' && location.pathname.startsWith('/usuarios/')) {
      // Si estamos en /usuarios/nuevo o /usuarios/:id, no marcar /usuarios como activo
      return location.pathname === '/usuarios';
    }
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white shadow-md sticky top-0 h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Menú Principal
        </h2>
        <nav className="space-y-1">
          {filteredMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Info adicional en el footer del sidebar - COMENTADO TEMPORALMENTE */}
      {/* <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-semibold">Calera Tenextepec</p>
          <p>Veracruz, México</p>
          <p className="mt-2 text-gray-500">© 2025 AquaTenex</p>
        </div>
      </div> */}
    </aside>
  );
}

export default Sidebar;
