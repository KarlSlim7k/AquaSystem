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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id('id_pago');
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->string('numero_recibo', 50)->unique();
            $table->decimal('monto', 10, 2);
            $table->date('fecha_pago');
            $table->enum('metodo_pago', ['efectivo', 'tarjeta', 'transferencia', 'cheque']);
            $table->string('periodo_mes', 20); // Ej: "2025-01", "Enero 2025"
            $table->decimal('lectura_anterior', 10, 2)->nullable();
            $table->decimal('lectura_actual', 10, 2)->nullable();
            $table->decimal('consumo_m3', 10, 2)->nullable();
            $table->string('comprobante_pago', 255)->nullable(); // Ruta del archivo
            $table->text('notas')->nullable();
            $table->unsignedBigInteger('registrado_por')->nullable(); // Usuario del sistema que registró
            $table->datetime('fecha_registro')->useCurrent();
            $table->datetime('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
            
            // Relaciones
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios_agua')->onDelete('cascade');
            $table->foreign('registrado_por')->references('id_usuario_sistema')->on('usuarios_sistema')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
