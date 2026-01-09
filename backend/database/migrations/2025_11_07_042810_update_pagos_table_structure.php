<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            // Solo agregar campos si no existen
            if (!Schema::hasColumn('pagos', 'monto_pagado')) {
                $table->decimal('monto_pagado', 10, 2)->after('numero_recibo');
            }
            if (!Schema::hasColumn('pagos', 'monto_recargo')) {
                $table->decimal('monto_recargo', 10, 2)->default(0)->after('numero_recibo');
            }
            if (!Schema::hasColumn('pagos', 'monto_total')) {
                $table->decimal('monto_total', 10, 2)->after('numero_recibo');
            }
            if (!Schema::hasColumn('pagos', 'periodo_inicio')) {
                $table->date('periodo_inicio')->after('numero_recibo');
            }
            if (!Schema::hasColumn('pagos', 'periodo_fin')) {
                $table->date('periodo_fin')->after('numero_recibo');
            }
            if (!Schema::hasColumn('pagos', 'referencia_pago')) {
                $table->string('referencia_pago', 100)->nullable()->after('numero_recibo');
            }
            if (!Schema::hasColumn('pagos', 'estatus_pago')) {
                $table->enum('estatus_pago', ['completado', 'pendiente', 'cancelado'])->default('completado')->after('numero_recibo');
            }
            if (!Schema::hasColumn('pagos', 'motivo_cancelacion')) {
                $table->text('motivo_cancelacion')->nullable()->after('numero_recibo');
            }
            if (!Schema::hasColumn('pagos', 'fecha_cancelacion')) {
                $table->datetime('fecha_cancelacion')->nullable()->after('numero_recibo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            // Restaurar campos antiguos
            $table->decimal('monto', 10, 2)->after('numero_recibo');
            $table->string('periodo_mes', 20)->after('metodo_pago');
            $table->decimal('lectura_anterior', 10, 2)->nullable()->after('periodo_mes');
            $table->decimal('lectura_actual', 10, 2)->nullable()->after('lectura_anterior');
            $table->decimal('consumo_m3', 10, 2)->nullable()->after('lectura_actual');
            $table->string('comprobante_pago', 255)->nullable()->after('consumo_m3');
            
            // Eliminar campos nuevos
            $table->dropColumn([
                'monto_pagado', 
                'monto_recargo', 
                'monto_total', 
                'periodo_inicio', 
                'periodo_fin',
                'referencia_pago',
                'estatus_pago',
                'motivo_cancelacion',
                'fecha_cancelacion'
            ]);
            
            // Restaurar metodo_pago original
            $table->enum('metodo_pago', ['efectivo', 'tarjeta', 'transferencia', 'cheque'])->change();
        });
    }
};
