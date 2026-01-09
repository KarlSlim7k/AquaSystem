<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuarioAgua extends Model
{
    protected $table = 'usuarios_agua';
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'numero_cuenta',
        'nombre_completo',
        'telefono',
        'email',
        'identificacion_oficial',
        'tipo_propiedad',
        'calle',
        'numero_exterior',
        'numero_interior',
        'colonia',
        'codigo_postal',
        'referencias',
        'latitud',
        'longitud',
        'foto_domicilio',
        'foto_medidor',
        'estatus',
        'notas'
    ];

    protected $casts = [
        'latitud' => 'decimal:8',
        'longitud' => 'decimal:8',
        'fecha_registro' => 'datetime'
    ];

    /**
     * Generar número de cuenta automático al crear
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($usuario) {
            if (empty($usuario->numero_cuenta)) {
                // Obtener el último número de cuenta
                $ultimoUsuario = self::orderBy('id_usuario', 'desc')->first();
                
                if ($ultimoUsuario && $ultimoUsuario->numero_cuenta) {
                    // Extraer el número y aumentarlo
                    $ultimoNumero = intval(substr($ultimoUsuario->numero_cuenta, 5));
                    $nuevoNumero = str_pad($ultimoNumero + 1, 6, '0', STR_PAD_LEFT);
                } else {
                    // Primer usuario
                    $nuevoNumero = '000001';
                }
                
                $usuario->numero_cuenta = 'TNXT-' . $nuevoNumero;
            }
        });
    }

    // Relación con el usuario que lo creó
    public function creador()
    {
        return $this->belongsTo(UsuarioSistema::class, 'creado_por', 'id_usuario_sistema');
    }

    // Relación con pagos
    public function pagos()
    {
        return $this->hasMany(Pago::class, 'id_usuario', 'id_usuario');
    }
}
