<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pago;
use App\Http\Requests\StorePagoRequest;
use App\Http\Requests\UpdatePagoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PagoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Pago::with(['usuario', 'registrador']);

        // Búsqueda por número de recibo, nombre de usuario, o número de cuenta
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('numero_recibo', 'like', "%{$search}%")
                  ->orWhereHas('usuario', function($q2) use ($search) {
                      $q2->where('nombre_completo', 'like', "%{$search}%")
                         ->orWhere('numero_cuenta', 'like', "%{$search}%");
                  });
            });
        }

        // Filtro por usuario
        if ($request->has('id_usuario') && $request->id_usuario) {
            $query->where('id_usuario', $request->id_usuario);
        }

        // Filtro por método de pago
        if ($request->has('metodo_pago') && $request->metodo_pago) {
            $query->where('metodo_pago', $request->metodo_pago);
        }

        // Filtro por estatus
        if ($request->has('estatus_pago') && $request->estatus_pago) {
            $query->where('estatus_pago', $request->estatus_pago);
        }

        // Filtro por rango de fechas
        if ($request->has('fecha_inicio') && $request->fecha_inicio) {
            $query->whereDate('fecha_pago', '>=', $request->fecha_inicio);
        }
        if ($request->has('fecha_fin') && $request->fecha_fin) {
            $query->whereDate('fecha_pago', '<=', $request->fecha_fin);
        }

        // Ordenar por fecha de pago descendente
        $query->orderBy('fecha_pago', 'desc');

        return response()->json($query->paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePagoRequest $request)
    {
        Log::info('📥 Datos recibidos en store:', $request->all());
        
        DB::beginTransaction();
        try {
            $data = $request->validated();
            Log::info('✅ Datos validados:', $data);
            
            // Obtener ID del usuario autenticado (Sanctum)
            $user = auth('sanctum')->user();
            if ($user) {
                $data['registrado_por'] = $user->id_usuario_sistema;
                Log::info('👤 Usuario autenticado:', ['id' => $user->id_usuario_sistema, 'email' => $user->email]);
            } else {
                Log::warning('⚠️ No hay usuario autenticado');
            }
            
            // Si no se proporciona fecha_pago, usar la fecha actual
            if (!isset($data['fecha_pago']) || empty($data['fecha_pago'])) {
                $data['fecha_pago'] = now();
            }

            // Si no se proporciona estatus, establecer como completado
            if (!isset($data['estatus_pago'])) {
                $data['estatus_pago'] = 'completado';
            }

            // Si no hay recargo, establecer en 0
            if (!isset($data['monto_recargo'])) {
                $data['monto_recargo'] = 0;
            }

            Log::info('💾 Datos finales a guardar:', $data);
            
            $pago = Pago::create($data);
            $pago->load(['usuario', 'registrador']);

            DB::commit();
            Log::info('✅ Pago creado exitosamente:', ['id' => $pago->id_pago]);
            
            return response()->json($pago, 201);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('❌ Error al crear pago:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al registrar el pago',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $pago = Pago::with(['usuario', 'registrador'])->find($id);
        
        if (!$pago) {
            return response()->json(['message' => 'Pago no encontrado'], 404);
        }

        return response()->json($pago);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePagoRequest $request, $id)
    {
        $pago = Pago::find($id);
        
        if (!$pago) {
            return response()->json(['message' => 'Pago no encontrado'], 404);
        }

        DB::beginTransaction();
        try {
            $data = $request->validated();
            
            // Si se está cancelando el pago, agregar fecha de cancelación
            if (isset($data['estatus_pago']) && $data['estatus_pago'] === 'cancelado' && $pago->estatus_pago !== 'cancelado') {
                $data['fecha_cancelacion'] = now();
            }

            $pago->update($data);
            $pago->load(['usuario', 'registrador']);

            DB::commit();
            return response()->json($pago);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error al actualizar el pago',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $pago = Pago::find($id);
        
        if (!$pago) {
            return response()->json(['message' => 'Pago no encontrado'], 404);
        }

        // Cancelar en lugar de eliminar físicamente
        $pago->update([
            'estatus_pago' => 'cancelado',
            'fecha_cancelacion' => now(),
            'motivo_cancelacion' => 'Eliminado por el usuario'
        ]);

        return response()->json(['message' => 'Pago cancelado exitosamente']);
    }

    /**
     * Get payment statistics
     */
    public function estadisticas(Request $request)
    {
        $query = Pago::query();

        // Filtros opcionales
        if ($request->has('fecha_inicio')) {
            $query->whereDate('fecha_pago', '>=', $request->fecha_inicio);
        }
        if ($request->has('fecha_fin')) {
            $query->whereDate('fecha_pago', '<=', $request->fecha_fin);
        }

        $estadisticas = [
            'total_pagos' => $query->where('estatus_pago', 'completado')->count(),
            'monto_total' => $query->where('estatus_pago', 'completado')->sum('monto_total'),
            'monto_recargos' => $query->where('estatus_pago', 'completado')->sum('monto_recargo'),
            'pagos_pendientes' => Pago::where('estatus_pago', 'pendiente')->count(),
            'pagos_cancelados' => Pago::where('estatus_pago', 'cancelado')->count(),
            'metodos_pago' => Pago::where('estatus_pago', 'completado')
                ->select('metodo_pago', DB::raw('count(*) as total'), DB::raw('sum(monto_total) as monto'))
                ->groupBy('metodo_pago')
                ->get()
        ];

        return response()->json($estadisticas);
    }

    /**
     * Get payment history for a specific user
     */
    public function historialUsuario($id_usuario)
    {
        $pagos = Pago::with('registrador')
            ->where('id_usuario', $id_usuario)
            ->orderBy('fecha_pago', 'desc')
            ->get();

        if ($pagos->isEmpty()) {
            return response()->json(['message' => 'No hay pagos registrados para este usuario'], 404);
        }

        return response()->json($pagos);
    }

    /**
     * Generate receipt number
     */
    public function generarNumeroRecibo()
    {
        // Formato: REC-YYYYMMDD-XXXX
        $fecha = now()->format('Ymd');
        $ultimoPago = Pago::where('numero_recibo', 'like', "REC-{$fecha}-%")
            ->orderBy('numero_recibo', 'desc')
            ->first();

        if ($ultimoPago) {
            $ultimoNumero = intval(substr($ultimoPago->numero_recibo, -4));
            $nuevoNumero = $ultimoNumero + 1;
        } else {
            $nuevoNumero = 1;
        }

        $numeroRecibo = sprintf("REC-%s-%04d", $fecha, $nuevoNumero);

        return response()->json(['numero_recibo' => $numeroRecibo]);
    }
}
