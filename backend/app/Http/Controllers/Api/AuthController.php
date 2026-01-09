<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UsuarioSistema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login del usuario
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $usuario = UsuarioSistema::where('username', $request->username)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password_hash)) {
            throw ValidationException::withMessages([
                'username' => ['Las credenciales son incorrectas.'],
            ]);
        }

        if (!$usuario->activo) {
            throw ValidationException::withMessages([
                'username' => ['Usuario inactivo. Contacte al administrador.'],
            ]);
        }

        if ($usuario->bloqueado) {
            throw ValidationException::withMessages([
                'username' => ['Usuario bloqueado. Contacte al administrador.'],
            ]);
        }

        // Actualizar último acceso
        $usuario->ultimo_acceso = now();
        $usuario->intentos_fallidos = 0;
        $usuario->save();

        // Crear token
        $token = $usuario->createToken('auth-token', [$usuario->rol])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login exitoso',
            'data' => [
                'token' => $token,
                'usuario' => [
                    'id' => $usuario->id_usuario_sistema,
                    'username' => $usuario->username,
                    'nombre_completo' => $usuario->nombre_completo,
                    'email' => $usuario->email,
                    'rol' => $usuario->rol,
                    'telefono' => $usuario->telefono,
                ]
            ]
        ]);
    }

    /**
     * Logout del usuario
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout exitoso'
        ]);
    }

    /**
     * Obtener datos del usuario autenticado
     */
    public function me(Request $request)
    {
        $usuario = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $usuario->id_usuario_sistema,
                'username' => $usuario->username,
                'nombre_completo' => $usuario->nombre_completo,
                'email' => $usuario->email,
                'rol' => $usuario->rol,
                'telefono' => $usuario->telefono,
                'ultimo_acceso' => $usuario->ultimo_acceso,
            ]
        ]);
    }
}
