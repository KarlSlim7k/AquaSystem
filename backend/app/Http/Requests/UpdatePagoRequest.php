<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePagoRequest extends FormRequest
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
        $pagoId = $this->route('pago');
        
        return [
            'id_usuario' => 'sometimes|exists:usuarios_agua,id_usuario',
            'numero_recibo' => 'sometimes|string|max:30|unique:pagos,numero_recibo,' . $pagoId . ',id_pago',
            'monto_pagado' => 'sometimes|numeric|min:0',
            'monto_recargo' => 'nullable|numeric|min:0',
            'monto_total' => 'sometimes|numeric|min:0',
            'periodo_inicio' => 'sometimes|date',
            'periodo_fin' => 'sometimes|date|after_or_equal:periodo_inicio',
            'metodo_pago' => 'sometimes|in:efectivo,transferencia,tarjeta,cheque,otro',
            'referencia_pago' => 'nullable|string|max:100',
            'fecha_pago' => 'nullable|date',
            'estatus_pago' => 'nullable|in:completado,pendiente,cancelado',
            'motivo_cancelacion' => 'nullable|string',
            'notas' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'id_usuario.exists' => 'El usuario no existe',
            'numero_recibo.unique' => 'Este número de recibo ya existe',
            'periodo_fin.after_or_equal' => 'La fecha fin debe ser posterior o igual a la fecha inicio',
            'metodo_pago.in' => 'Método de pago inválido',
            'estatus_pago.in' => 'Estatus inválido'
        ];
    }
}
