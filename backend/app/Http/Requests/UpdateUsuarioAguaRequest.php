<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUsuarioAguaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => 'sometimes|required|string|max:150',
            'telefono' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:100',
            'identificacion_oficial' => 'nullable|string|max:50',
            'tipo_propiedad' => 'sometimes|required|in:Residencial,Comercial,Industrial',
            'calle' => 'sometimes|required|string|max:150',
            'numero_exterior' => 'nullable|string|max:10',
            'numero_interior' => 'nullable|string|max:10',
            'colonia' => 'sometimes|required|string|max:100',
            'codigo_postal' => 'nullable|string|max:10',
            'referencias' => 'nullable|string',
            'latitud' => 'nullable|numeric|between:-90,90',
            'longitud' => 'nullable|numeric|between:-180,180',
            'foto_domicilio' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
            'foto_medidor' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
            'estatus' => 'nullable|in:activo,suspendido,baja',
            'notas' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_completo.required' => 'El nombre completo es obligatorio',
            'tipo_propiedad.required' => 'El tipo de propiedad es obligatorio',
            'tipo_propiedad.in' => 'El tipo de propiedad debe ser: Residencial, Comercial o Industrial',
            'calle.required' => 'La calle es obligatoria',
            'colonia.required' => 'La colonia es obligatoria',
            'foto_domicilio.image' => 'La foto del domicilio debe ser una imagen',
            'foto_domicilio.max' => 'La foto del domicilio no debe superar 5MB',
            'foto_medidor.image' => 'La foto del medidor debe ser una imagen',
            'foto_medidor.max' => 'La foto del medidor no debe superar 5MB',
        ];
    }
}
