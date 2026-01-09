<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UsuarioAguaController;
use App\Http\Controllers\Api\PagoController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas (sin autenticación)
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Usuarios del servicio de agua
    // Listar y ver usuarios - permitido para: administrador, gestor_campo, cobrador, censador, supervisor
    Route::middleware('role:administrador,gestor_campo,cobrador,censador,supervisor')->group(function () {
        Route::get('/usuarios-agua', [UsuarioAguaController::class, 'index']);
        Route::get('/usuarios-agua/{id}', [UsuarioAguaController::class, 'show']);
        Route::get('/colonias', [UsuarioAguaController::class, 'colonias']);
    });
    
    // Crear y actualizar usuarios - permitido para: administrador, gestor_campo, censador
    Route::middleware('role:administrador,gestor_campo,censador')->group(function () {
        Route::post('/usuarios-agua', [UsuarioAguaController::class, 'store']);
        Route::put('/usuarios-agua/{id}', [UsuarioAguaController::class, 'update']);
    });
    
    // Eliminar usuarios - solo administrador y gestor_campo
    Route::middleware('role:administrador,gestor_campo')->group(function () {
        Route::delete('/usuarios-agua/{id}', [UsuarioAguaController::class, 'destroy']);
    });
    
    // Pagos - NO permitido para censador
    Route::middleware('role:administrador,gestor_campo,cobrador,supervisor,contador')->group(function () {
        Route::apiResource('pagos', PagoController::class);
        Route::get('/pagos-estadisticas', [PagoController::class, 'estadisticas']);
        Route::get('/pagos-usuario/{id_usuario}', [PagoController::class, 'historialUsuario']);
        Route::get('/generar-numero-recibo', [PagoController::class, 'generarNumeroRecibo']);
    });
    
    // Dashboard - NO permitido para censador
    Route::middleware('role:administrador,gestor_campo,cobrador,supervisor,contador')->group(function () {
        Route::get('/dashboard/estadisticas', [DashboardController::class, 'estadisticasGenerales']);
        Route::get('/dashboard/mapa-usuarios', [DashboardController::class, 'usuariosParaMapa']);
    });
});
