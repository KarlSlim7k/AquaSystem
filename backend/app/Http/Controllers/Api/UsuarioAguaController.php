<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UsuarioAgua;
use App\Http\Requests\StoreUsuarioAguaRequest;
use App\Http\Requests\UpdateUsuarioAguaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class UsuarioAguaController extends Controller
{
    /**
     * Listar usuarios con paginación y búsqueda
     */
    public function index(Request $request)
    {
        try {
            $query = UsuarioAgua::query();

            // Búsqueda
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('numero_cuenta', 'like', "%{$search}%")
                      ->orWhere('nombre_completo', 'like', "%{$search}%")
                      ->orWhere('calle', 'like', "%{$search}%")
                      ->orWhere('colonia', 'like', "%{$search}%")
                      ->orWhere('telefono', 'like', "%{$search}%");
                });
            }

            // Filtro por estatus
            if ($request->has('estatus')) {
                $query->where('estatus', $request->estatus);
            }

            // Filtro por colonia
            if ($request->has('colonia')) {
                $query->where('colonia', $request->colonia);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'fecha_registro');
            $sortOrder = $request->get('sortOrder', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->get('perPage', 15);
            $usuarios = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $usuarios
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear nuevo usuario
     */
    public function store(StoreUsuarioAguaRequest $request)
    {
        DB::beginTransaction();
        
        try {
            $data = $request->validated();
            $data['estatus'] = $request->get('estatus', 'activo');

            // Procesar foto del domicilio
            if ($request->hasFile('foto_domicilio')) {
                $data['foto_domicilio'] = $this->procesarImagen($request->file('foto_domicilio'), 'domicilios');
            }

            // Procesar foto del medidor
            if ($request->hasFile('foto_medidor')) {
                $data['foto_medidor'] = $this->procesarImagen($request->file('foto_medidor'), 'medidores');
            }

            $usuario = UsuarioAgua::create($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'data' => $usuario
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un usuario específico
     */
    public function show($id)
    {
        try {
            $usuario = UsuarioAgua::with('creador:id_usuario_sistema,nombre_completo')->findOrFail($id);
            
            // Agregar URLs completas de las imágenes
            if ($usuario->foto_domicilio) {
                $usuario->foto_domicilio_url = Storage::url($usuario->foto_domicilio);
            }
            if ($usuario->foto_medidor) {
                $usuario->foto_medidor_url = Storage::url($usuario->foto_medidor);
            }

            return response()->json([
                'success' => true,
                'data' => $usuario
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }
    }

    /**
     * Actualizar usuario
     */
    public function update(UpdateUsuarioAguaRequest $request, $id)
    {
        DB::beginTransaction();
        
        try {
            $usuario = UsuarioAgua::findOrFail($id);
            $data = $request->validated();

            // Procesar nueva foto del domicilio
            if ($request->hasFile('foto_domicilio')) {
                // Eliminar foto anterior si existe
                if ($usuario->foto_domicilio) {
                    Storage::delete($usuario->foto_domicilio);
                }
                $data['foto_domicilio'] = $this->procesarImagen($request->file('foto_domicilio'), 'domicilios');
            }

            // Procesar nueva foto del medidor
            if ($request->hasFile('foto_medidor')) {
                // Eliminar foto anterior si existe
                if ($usuario->foto_medidor) {
                    Storage::delete($usuario->foto_medidor);
                }
                $data['foto_medidor'] = $this->procesarImagen($request->file('foto_medidor'), 'medidores');
            }

            $usuario->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente',
                'data' => $usuario
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar usuario (soft delete - marcar como inactivo)
     */
    public function destroy($id)
    {
        try {
            $usuario = UsuarioAgua::findOrFail($id);
            
            // Cambiar a suspendido en lugar de eliminar
            $usuario->update(['estatus' => 'suspendido']);

            return response()->json([
                'success' => true,
                'message' => 'Usuario desactivado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al desactivar usuario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener lista de colonias únicas
     */
    public function colonias()
    {
        try {
            $colonias = UsuarioAgua::select('colonia')
                ->distinct()
                ->orderBy('colonia')
                ->pluck('colonia');

            return response()->json([
                'success' => true,
                'data' => $colonias
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener colonias'
            ], 500);
        }
    }

    /**
     * Procesar y optimizar imagen
     */
    private function procesarImagen($file, $carpeta)
    {
        $manager = new ImageManager(new Driver());
        
        // Generar nombre único
        $filename = time() . '_' . uniqid() . '.jpg';
        $path = "imagenes/{$carpeta}/{$filename}";
        
        // Crear directorio si no existe
        Storage::makeDirectory("imagenes/{$carpeta}");
        
        // Procesar imagen: redimensionar y comprimir
        $image = $manager->read($file);
        $image->scale(width: 1200); // Máximo 1200px de ancho
        $image->toJpeg(quality: 80); // Calidad 80%
        
        // Guardar en storage/app/public
        Storage::put($path, (string) $image->encode());
        
        return $path;
    }
}
