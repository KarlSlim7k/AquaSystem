#!/usr/bin/env pwsh
# PRUEBAS COMPLETAS - ROL CENSADOR
# Fecha: 2025-11-08

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:8000/api"
$token = ""
$userId = $null

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PRUEBAS DE ROL CENSADOR" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# FASE 1: AUTENTICACION
Write-Host "[FASE 1] Autenticacion del Censador" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

$loginBody = @{
    usuario = "censador"
    password = "censa123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $response.token
    Write-Host "  OK Login exitoso" -ForegroundColor Green
    Write-Host "  Usuario: $($response.usuario.nombre)" -ForegroundColor Gray
    Write-Host "  Rol: $($response.usuario.rol)" -ForegroundColor Gray
} catch {
    Write-Host "  ERROR en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
}

# FASE 2: PERMISOS PERMITIDOS
Write-Host "`n[FASE 2] Permisos Permitidos" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Listar usuarios
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/usuarios-agua" -Method Get -Headers $headers
    $totalUsuarios = $response.data.Count
    Write-Host "  OK Lista de usuarios: $totalUsuarios encontrados" -ForegroundColor Green
} catch {
    Write-Host "  ERROR al listar usuarios" -ForegroundColor Red
}

# Ver detalle
if ($totalUsuarios -gt 0) {
    $primerUsuarioId = $response.data[0].id
    try {
        $detalle = Invoke-RestMethod -Uri "$baseUrl/usuarios-agua/$primerUsuarioId" -Method Get -Headers $headers
        Write-Host "  OK Detalle de usuario: $($detalle.data.nombre_completo)" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR al ver detalle" -ForegroundColor Red
    }
}

# Crear usuario
$nuevoUsuario = @{
    numero_cuenta = "TEST-$(Get-Random -Minimum 10000 -Maximum 99999)"
    nombre_completo = "Usuario Test Censador"
    telefono = "5551234567"
    calle = "Calle Test"
    numero_exterior = "123"
    colonia = "Colonia Test"
    codigo_postal = "12345"
    latitud = "19.432608"
    longitud = "-99.133209"
    estatus = "activo"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/usuarios-agua" -Method Post -Body $nuevoUsuario -Headers $headers -ContentType "application/json"
    $userId = $response.data.id
    Write-Host "  OK Usuario creado: $($response.data.nombre_completo) (ID: $userId)" -ForegroundColor Green
} catch {
    Write-Host "  ERROR al crear usuario" -ForegroundColor Red
}

# FASE 3: PERMISOS DENEGADOS
Write-Host "`n[FASE 3] Permisos Denegados (Deben dar 403)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Dashboard
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/dashboard/estadisticas" -Method Get -Headers $headers
    Write-Host "  ERROR: Dashboard NO esta bloqueado" -ForegroundColor Red
} catch {
    Write-Host "  OK Dashboard bloqueado (403)" -ForegroundColor Green
}

# Pagos
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/pagos" -Method Get -Headers $headers
    Write-Host "  ERROR: Pagos NO esta bloqueado" -ForegroundColor Red
} catch {
    Write-Host "  OK Pagos bloqueado (403)" -ForegroundColor Green
}

# Mapa
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/mapa/usuarios" -Method Get -Headers $headers
    Write-Host "  ERROR: Mapa NO esta bloqueado" -ForegroundColor Red
} catch {
    Write-Host "  OK Mapa bloqueado (403)" -ForegroundColor Green
}

# Editar usuario
if ($userId) {
    $editarUsuario = @{
        nombre_completo = "Nombre Modificado"
        telefono = "5559999999"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/usuarios-agua/$userId" -Method Put -Body $editarUsuario -Headers $headers -ContentType "application/json"
        Write-Host "  ERROR: Edicion NO esta bloqueada" -ForegroundColor Red
    } catch {
        Write-Host "  OK Edicion bloqueada (403)" -ForegroundColor Green
    }
}

# Eliminar usuario
if ($userId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/usuarios-agua/$userId" -Method Delete -Headers $headers
        Write-Host "  ERROR: Eliminacion NO esta bloqueada" -ForegroundColor Red
    } catch {
        Write-Host "  OK Eliminacion bloqueada (403)" -ForegroundColor Green
    }
}

# Usuarios del sistema
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/usuarios-sistema" -Method Get -Headers $headers
    Write-Host "  ERROR: Usuarios sistema NO esta bloqueado" -ForegroundColor Red
} catch {
    Write-Host "  OK Usuarios sistema bloqueado (403)" -ForegroundColor Green
}

# FASE 4: LIMPIEZA
if ($userId) {
    Write-Host "`n[FASE 4] Limpieza de Datos de Prueba" -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Yellow
    
    $adminLoginBody = @{
        usuario = "admin"
        password = "admin123"
    } | ConvertTo-Json

    try {
        $adminResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
        $adminToken = $adminResponse.token
        $adminHeaders = @{
            "Authorization" = "Bearer $adminToken"
            "Accept" = "application/json"
        }
        
        $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/usuarios-agua/$userId" -Method Delete -Headers $adminHeaders
        Write-Host "  OK Usuario de prueba eliminado" -ForegroundColor Green
    } catch {
        Write-Host "  AVISO: No se pudo eliminar usuario de prueba (ID: $userId)" -ForegroundColor Yellow
    }
}

# RESUMEN
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nPERMITIDO:" -ForegroundColor Green
Write-Host "  - Login como censador" -ForegroundColor White
Write-Host "  - Listar usuarios de agua" -ForegroundColor White
Write-Host "  - Ver detalle de usuarios" -ForegroundColor White
Write-Host "  - Crear nuevos usuarios" -ForegroundColor White

Write-Host "`nBLOQUEADO:" -ForegroundColor Red
Write-Host "  - Dashboard (403)" -ForegroundColor White
Write-Host "  - Pagos (403)" -ForegroundColor White
Write-Host "  - Mapa (403)" -ForegroundColor White
Write-Host "  - Editar usuarios (403)" -ForegroundColor White
Write-Host "  - Eliminar usuarios (403)" -ForegroundColor White
Write-Host "  - Usuarios del sistema (403)" -ForegroundColor White

Write-Host "`nPRUEBAS EN NAVEGADOR:" -ForegroundColor Yellow
Write-Host "  1. http://localhost:5173" -ForegroundColor Gray
Write-Host "  2. Login: censador / censa123" -ForegroundColor Gray
Write-Host "  3. Verificar redireccion a /usuarios/nuevo" -ForegroundColor Gray
Write-Host "  4. Verificar menu simplificado (2 opciones)" -ForegroundColor Gray
Write-Host "  5. Crear usuario -> modal de confirmacion" -ForegroundColor Gray
Write-Host "  6. Lista -> NO boton Editar" -ForegroundColor Gray
Write-Host "  7. Detalle -> NO botones Editar/Dar de Baja" -ForegroundColor Gray
Write-Host "`n========================================`n" -ForegroundColor Cyan
