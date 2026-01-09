<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $table = 'pagos';
    protected $primaryKey = 'id_pago';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'numero_recibo',
        'monto_pagado',
        'monto_recargo',
        'monto_total',
        'periodo_inicio',
        'periodo_fin',
        'metodo_pago',
        'referencia_pago',
        'fecha_pago',
        'registrado_por',
        'estatus_pago',
        'motivo_cancelacion',
        'fecha_cancelacion',
        'notas'
    ];

    protected $casts = [
        'monto_pagado' => 'decimal:2',
        'monto_recargo' => 'decimal:2',
        'monto_total' => 'decimal:2',
        'periodo_inicio' => 'date',
        'periodo_fin' => 'date',
        'fecha_pago' => 'datetime',
        'fecha_cancelacion' => 'datetime'
    ];

    // Relación con Usuario de Agua
    public function usuario()
    {
        return $this->belongsTo(UsuarioAgua::class, 'id_usuario', 'id_usuario');
    }

    // Relación con Usuario del Sistema que registró
    public function registrador()
    {
        return $this->belongsTo(UsuarioSistema::class, 'registrado_por', 'id_usuario_sistema');
    }
}
