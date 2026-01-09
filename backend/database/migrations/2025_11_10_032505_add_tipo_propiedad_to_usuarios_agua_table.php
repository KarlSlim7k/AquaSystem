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
        Schema::table('usuarios_agua', function (Blueprint $table) {
            $table->enum('tipo_propiedad', ['Residencial', 'Comercial', 'Industrial'])
                  ->default('Residencial')
                  ->after('identificacion_oficial')
                  ->comment('Tipo de propiedad del usuario');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuarios_agua', function (Blueprint $table) {
            $table->dropColumn('tipo_propiedad');
        });
    }
};
