# FASE 3: Frontend - Redirección por Rol

## ✅ Implementación Completada

### 1. Hook Personalizado: `useRoleRedirect`
**Archivo**: `frontend/src/hooks/useRoleRedirect.js`

#### Funcionalidad:
- Detecta el rol del usuario autenticado
- Redirige automáticamente según el rol después del login
- Solo actúa en rutas que necesitan redirección (`/` y `/login`)

#### Lógica de Redirección:
```javascript
censador           → /usuarios/nuevo (Formulario de censo)
administrador      → /dashboard
gestor_campo       → /dashboard
cobrador           → /dashboard
supervisor         → /dashboard
contador           → /dashboard
soporte_tecnico    → /dashboard
consulta           → /dashboard
```

### 2. Modificaciones en `App.jsx`

#### Estructura:
1. **Componente `AppRoutes`**: Contiene todas las rutas y usa el hook `useRoleRedirect`
2. **Componente `App`**: Wrapper con `BrowserRouter`

#### Cambios Clave:

##### a) Ruta de Login
```jsx
// ANTES:
element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}

// DESPUÉS:
element={!isAuthenticated ? <Login /> : null}
```
**Razón**: Permite que el hook `useRoleRedirect` maneje la redirección según el rol

##### b) Ruta Raíz (/)
```jsx
// ANTES:
element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}

// DESPUÉS:
element={!isAuthenticated ? <Navigate to="/login" replace /> : null}
```
**Razón**: El hook maneja las redirecciones de usuarios autenticados

##### c) Protección del Dashboard
```jsx
// ANTES:
<ProtectedRoute>  // Sin restricción de roles

// DESPUÉS:
<ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador']}>
```
**Resultado**: ❌ Censador NO puede acceder al dashboard

##### d) Protección de Pagos
```jsx
<ProtectedRoute allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador']}>
```
**Resultado**: ❌ Censador NO puede acceder a ninguna ruta de pagos

##### e) Protección del Mapa
```jsx
// ANTES:
allowedRoles={['administrador', 'gestor_campo', 'supervisor']}

// DESPUÉS:
allowedRoles={['administrador', 'gestor_campo', 'cobrador', 'supervisor', 'contador']}
```
**Resultado**: ❌ Censador NO puede acceder al mapa

### 3. Rutas Permitidas para Censador

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/usuarios/nuevo` | ✅ | Formulario de censo (RUTA INICIAL) |
| `/usuarios` | ✅ | Lista de usuarios del servicio |
| `/usuarios/:id` | ✅ | Detalle de usuario |
| `/usuarios/:id/editar` | ✅ | Editar usuario |
| `/dashboard` | ❌ | Dashboard bloqueado |
| `/pagos/*` | ❌ | Todas las rutas de pagos bloqueadas |
| `/mapa` | ❌ | Mapa bloqueado |

## 🔄 Flujo de Usuario Censador

### Login
1. Usuario ingresa credenciales: `censador` / `censa123`
2. Redux guarda token y datos de usuario
3. Usuario es redirigido a `/login` (autenticado)
4. Hook `useRoleRedirect` detecta:
   - Está autenticado ✅
   - Está en ruta que necesita redirección (`/login`) ✅
   - Rol es `censador` ✅
5. Redirección automática a → `/usuarios/nuevo`

### Navegación
- Censador ve menú simplificado (implementar en Fase 4)
- Puede navegar entre rutas permitidas
- Si intenta acceder a ruta bloqueada → Mensaje "Acceso Denegado"

## 📋 Próximas Fases

### FASE 4: Menú Simplificado
- Modificar `Sidebar.jsx`
- Mostrar solo "Censar Usuario" y "Usuarios del Servicio" para censador
- Ocultar: Dashboard, Pagos, Estadísticas, Mapa

### FASE 5: Modal de Confirmación
- Modificar `CensarUsuario.jsx`
- Agregar modal después de guardar exitosamente
- Opciones: "¿Deseas agregar otro usuario?"
  - SÍ → Reset del formulario
  - NO → Navegar a `/usuarios`

### FASE 6: Restricciones en UI
- `UsuariosLista.jsx`: Ocultar botones Editar/Eliminar para censador
- `UsuarioDetalle.jsx`: Ocultar información financiera para censador

## ✅ Testing

### Manual:
1. Login con usuario censador
2. Verificar redirección a `/usuarios/nuevo`
3. Intentar acceder a `/dashboard` → Debe mostrar "Acceso Denegado"
4. Intentar acceder a `/pagos` → Debe mostrar "Acceso Denegado"
5. Navegar a `/usuarios` → Debe funcionar correctamente

### Navegador:
```
http://localhost:5173
```

---
**Fecha**: 8 de noviembre de 2025  
**Estado**: ✅ Completada  
**Siguiente**: Fase 4 - Menú Simplificado
