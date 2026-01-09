<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UsuarioAgua;
use App\Models\Pago;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Obtener estadísticas generales del dashboard
     */
    public function estadisticasGenerales(Request $request)
    {
        try {
            $hoy = Carbon::today();
            
            // Total de usuarios
            $totalUsuarios = UsuarioAgua::count();
            $usuariosActivos = UsuarioAgua::where('estatus', 'activo')->count();
            $usuariosSuspendidos = UsuarioAgua::where('estatus', 'suspendido')->count();
            
            // Usuarios censados hoy
            $usuariosHoy = UsuarioAgua::whereDate('fecha_registro', $hoy)->count();
            
            // Pagos de hoy
            $pagosHoy = Pago::whereDate('fecha_pago', $hoy)->count();
            $montoRecaudadoHoy = Pago::whereDate('fecha_pago', $hoy)
                ->where('estatus_pago', 'completado')
                ->sum('monto_total');
            
            // Pagos del mes actual
            $inicioMes = Carbon::now()->startOfMonth();
            $pagosMes = Pago::where('fecha_pago', '>=', $inicioMes)
                ->where('estatus_pago', 'completado')
                ->count();
            $montoRecaudadoMes = Pago::where('fecha_pago', '>=', $inicioMes)
                ->where('estatus_pago', 'completado')
                ->sum('monto_total');
            
            // Usuarios por colonia
            $usuariosPorColonia = UsuarioAgua::select('colonia', DB::raw('count(*) as total'))
                ->whereNotNull('colonia')
                ->groupBy('colonia')
                ->orderBy('total', 'desc')
                ->limit(10)
                ->get();
            
            // Pagos de los últimos 30 días (para gráfica)
            $pagosUltimos30Dias = Pago::select(
                    DB::raw('DATE(fecha_pago) as fecha'),
                    DB::raw('COUNT(*) as cantidad'),
                    DB::raw('SUM(monto_total) as monto')
                )
                ->where('fecha_pago', '>=', Carbon::now()->subDays(30))
                ->where('estatus_pago', 'completado')
                ->groupBy('fecha')
                ->orderBy('fecha', 'asc')
                ->get();
            
            // Distribución por método de pago
            $distribucionMetodos = Pago::select('metodo_pago', DB::raw('count(*) as total'))
                ->where('estatus_pago', 'completado')
                ->groupBy('metodo_pago')
                ->get();
            
            return response()->json([
                'resumen' => [
                    'total_usuarios' => $totalUsuarios,
                    'usuarios_activos' => $usuariosActivos,
                    'usuarios_suspendidos' => $usuariosSuspendidos,
                    'usuarios_censados_hoy' => $usuariosHoy,
                    'pagos_hoy' => $pagosHoy,
                    'monto_recaudado_hoy' => (float) $montoRecaudadoHoy,
                    'pagos_mes' => $pagosMes,
                    'monto_recaudado_mes' => (float) $montoRecaudadoMes,
                ],
                'usuarios_por_colonia' => $usuariosPorColonia,
                'pagos_ultimos_30_dias' => $pagosUltimos30Dias,
                'distribucion_metodos' => $distribucionMetodos,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obtener usuarios con coordenadas para el mapa
     */
    public function usuariosParaMapa(Request $request)
    {
        try {
            $usuarios = UsuarioAgua::select(
                    'id_usuario',
                    'numero_cuenta',
                    'nombre_completo',
                    'calle',
                    'numero_exterior',
                    'colonia',
                    'latitud',
                    'longitud',
                    'estatus'
                )
                ->whereNotNull('latitud')
                ->whereNotNull('longitud')
                ->where('estatus', 'activo')
                ->get();
            
            // Agregar información de estatus de pago (simulado por ahora)
            $usuariosConEstatus = $usuarios->map(function($usuario) {
                return [
                    'id_usuario' => $usuario->id_usuario,
                    'numero_cuenta' => $usuario->numero_cuenta,
                    'nombre_completo' => $usuario->nombre_completo,
                    'direccion' => trim($usuario->calle . ' ' . $usuario->numero_exterior),
                    'colonia' => $usuario->colonia,
                    'latitud' => (float) $usuario->latitud,
                    'longitud' => (float) $usuario->longitud,
                    'estatus' => $usuario->estatus,
                    'estatus_pago' => 'al_corriente', // Por ahora simulado
                ];
            });
            
            return response()->json([
                'total' => $usuariosConEstatus->count(),
                'usuarios' => $usuariosConEstatus
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener usuarios para mapa',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
