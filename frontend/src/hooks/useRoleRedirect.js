import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Hook personalizado para redirigir usuarios según su rol
 * 
 * Comportamiento:
 * - Censador: Redirige a /usuarios/nuevo (formulario de censo)
 * - Otros roles: Redirige a /dashboard
 * - Solo se activa después de login exitoso o al cargar la app autenticado
 */
function useRoleRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Solo redirigir si está autenticado y está en la raíz o en login
    if (!isAuthenticated || !user) {
      return;
    }

    const currentPath = location.pathname;
    
    // Solo redirigir si está en rutas que necesitan redirección inicial
    const needsRedirect = currentPath === '/' || currentPath === '/login';
    
    if (!needsRedirect) {
      return;
    }

    // Determinar ruta según el rol del usuario
    let redirectPath = '/dashboard'; // Por defecto

    switch (user.rol) {
      case 'censador':
        // Censador va directo al formulario de censo
        redirectPath = '/usuarios/nuevo';
        break;
      
      // Todos los demás roles van al dashboard
      case 'administrador':
      case 'gestor_campo':
      case 'cobrador':
      case 'supervisor':
      case 'contador':
      case 'soporte_tecnico':
      case 'consulta':
      default:
        redirectPath = '/dashboard';
        break;
    }

    // Realizar la redirección
    navigate(redirectPath, { replace: true });
  }, [isAuthenticated, user, location.pathname, navigate]);
}

export default useRoleRedirect;
