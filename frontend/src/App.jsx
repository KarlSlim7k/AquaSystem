import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import useRoleRedirect from './hooks/useRoleRedirect';

// Componentes cargados inmediatamente (críticos)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsuariosLista from './pages/UsuariosLista';

// Lazy loading para componentes pesados
// const UsuariosLista = lazy(() => import('./pages/UsuariosLista'));
const CensarUsuario = lazy(() => import('./pages/CensarUsuario'));
const UsuarioDetalle = lazy(() => import('./pages/UsuarioDetalle'));
const EditarUsuario = lazy(() => import('./pages/EditarUsuario'));
const PagosLista = lazy(() => import('./pages/PagosLista'));
const PagoDetalle = lazy(() => import('./pages/PagoDetalle'));
const EditarPago = lazy(() => import('./pages/EditarPago'));
const RegistrarPago = lazy(() => import('./pages/RegistrarPago'));
const PagosEstadisticas = lazy(() => import('./pages/PagosEstadisticas'));
const Mapa = lazy(() => import('./pages/Mapa'));

// Componente interno que usa el hook de redirección
function AppRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Hook personalizado para redirección por rol
  useRoleRedirect();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    }>
      <Routes>
        {/* Ruta pública */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : null} 
        />
        
        {/* Rutas protegidas con Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador']}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'censador', 'supervisor']}>
              <Layout>
                <UsuariosLista />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios/nuevo"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'censador']}>
              <Layout>
                <CensarUsuario />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios/:id"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'censador', 'supervisor']}>
              <Layout>
                <UsuarioDetalle />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios/:id/editar"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'censador']}>
              <Layout>
                <EditarUsuario />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagos"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador']}>
              <Layout>
                <PagosLista />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagos/nuevo"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador']}>
              <Layout>
                <RegistrarPago />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagos/estadisticas"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador']}>
              <Layout>
                <PagosEstadisticas />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagos/:id"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador']}>
              <Layout>
                <PagoDetalle />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pagos/:id/editar"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador']}>
              <Layout>
                <EditarPago />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mapa"
          element={
            <ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador']}>
              <Layout>
                <Mapa />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Ruta raíz - el hook useRoleRedirect se encargará de la redirección */}
        <Route 
          path="/" 
          element={!isAuthenticated ? <Navigate to="/login" replace /> : null} 
        />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
