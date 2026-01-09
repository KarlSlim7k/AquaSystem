#!/usr/bin/env pwsh
# Script de Testing - Fase 10
# AquaTenex System Test Suite

$ErrorActionPreference = "Continue"
$token = "15|PIU0XvE6zv18157COurLwZ1aaW2U4PM0xhSWsvLRb0604ffe"
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  AQUATENEX - TEST SUITE FASE 10" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Verificar servidores
Write-Host "[TEST 1] Verificando servidores..." -ForegroundColor Yellow
try {
    $laravel = Invoke-WebRequest -Uri "http://localhost:8000" -TimeoutSec 3 -UseBasicParsing
    Write-Host "  ✅ Laravel Server: ACTIVO (puerto 8000)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Laravel Server: INACTIVO" -ForegroundColor Red
    exit 1
}

try {
    $vite = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 3 -UseBasicParsing
    Write-Host "  ✅ Vite Server: ACTIVO (puerto 5173)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Vite Server: INACTIVO" -ForegroundColor Red
}

# Test 2: Endpoints de Usuarios
Write-Host "`n[TEST 2] Endpoints de Usuarios..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/usuarios-agua" -Headers $headers
    Write-Host "  ✅ GET /api/usuarios-agua - Total: $($response.total) usuarios" -ForegroundColor Green
} catch {
    Write-Host "  ❌ GET /api/usuarios-agua - Error: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/usuarios-agua/7" -Headers $headers
    Write-Host "  ✅ GET /api/usuarios-agua/7 - Usuario: $($response.data.nombre_completo)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ GET /api/usuarios-agua/7 - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Dashboard
Write-Host "`n[TEST 3] Dashboard Endpoints..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/dashboard/estadisticas" -Headers $headers
    Write-Host "  ✅ GET /api/dashboard/estadisticas" -ForegroundColor Green
    Write-Host "     - Total usuarios: $($response.resumen.total_usuarios)" -ForegroundColor Gray
    Write-Host "     - Pagos del mes: $($response.resumen.pagos_mes)" -ForegroundColor Gray
    Write-Host "     - Monto recaudado: `$$($response.resumen.monto_recaudado_mes)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ GET /api/dashboard/estadisticas - Error: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/dashboard/mapa-usuarios" -Headers $headers
    Write-Host "  ✅ GET /api/dashboard/mapa-usuarios - Total: $($response.total) con coordenadas" -ForegroundColor Green
} catch {
    Write-Host "  ❌ GET /api/dashboard/mapa-usuarios - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Pagos
Write-Host "`n[TEST 4] Endpoints de Pagos..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/pagos" -Headers $headers
    Write-Host "  ✅ GET /api/pagos - Total: $($response.total) pagos" -ForegroundColor Green
} catch {
    Write-Host "  ❌ GET /api/pagos - Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Base de datos
Write-Host "`n[TEST 5] Verificando Base de Datos..." -ForegroundColor Yellow
$mysqlPath = "c:\xampp\mysql\bin\mysql.exe"
if (Test-Path $mysqlPath) {
    try {
        $dbTest = & $mysqlPath -u root -p -e "USE aquatenex_db; SELECT COUNT(*) as total FROM usuarios_agua;" 2>&1
        if ($dbTest -like "*total*") {
            Write-Host "  ✅ Conexión a MySQL: OK" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ⚠️  MySQL: Requiere password manual" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️  MySQL no encontrado en ruta esperada" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ejecuta este script para testing rápido" -ForegroundColor Gray
Write-Host "  Ubicación: docs/test_sistema.ps1`n" -ForegroundColor Gray
