<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePagoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_usuario' => 'required|exists:usuarios_agua,id_usuario',
            'numero_recibo' => 'required|string|max:30|unique:pagos,numero_recibo',
            'monto_pagado' => 'required|numeric|min:0',
            'monto_recargo' => 'nullable|numeric|min:0',
            'monto_total' => 'required|numeric|min:0',
            'periodo_inicio' => 'required|date',
            'periodo_fin' => 'required|date|after_or_equal:periodo_inicio',
            'metodo_pago' => 'required|in:efectivo,transferencia,tarjeta,cheque,otro',
            'referencia_pago' => 'nullable|string|max:100',
            'fecha_pago' => 'nullable|date',
            'estatus_pago' => 'nullable|in:completado,pendiente,cancelado',
            'notas' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'id_usuario.required' => 'El usuario es requerido',
            'id_usuario.exists' => 'El usuario no existe',
            'numero_recibo.required' => 'El número de recibo es requerido',
            'numero_recibo.unique' => 'Este número de recibo ya existe',
            'monto_pagado.required' => 'El monto pagado es requerido',
            'monto_total.required' => 'El monto total es requerido',
            'periodo_inicio.required' => 'La fecha de inicio del período es requerida',
            'periodo_fin.required' => 'La fecha de fin del período es requerida',
            'periodo_fin.after_or_equal' => 'La fecha fin debe ser posterior o igual a la fecha inicio',
            'metodo_pago.required' => 'El método de pago es requerido',
            'metodo_pago.in' => 'Método de pago inválido'
        ];
    }
}
