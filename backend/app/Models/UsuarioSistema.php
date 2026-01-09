<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UsuarioSistema extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios_sistema';
    protected $primaryKey = 'id_usuario_sistema';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'nombre_completo',
        'email',
        'password_hash',
        'rol',
        'telefono',
        'activo'
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'bloqueado' => 'boolean',
        'fecha_creacion' => 'datetime',
        'ultimo_acceso' => 'datetime',
    ];

    // Sobrescribir métodos para compatibilidad con Sanctum
    public function getAuthIdentifierName()
    {
        return 'id_usuario_sistema';
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
