<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Eliminar el trigger que genera automáticamente el número de recibo
        // Este trigger causa conflictos con la generación de números de recibo desde la aplicación
        DB::unprepared('DROP TRIGGER IF EXISTS trg_generar_numero_recibo');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recrear el trigger si se hace rollback
        DB::unprepared('
            CREATE TRIGGER trg_generar_numero_recibo
            BEFORE INSERT ON pagos
            FOR EACH ROW
            BEGIN
                DECLARE ultimo_recibo INT;
                SELECT COALESCE(MAX(CAST(SUBSTRING(numero_recibo, 6) AS UNSIGNED)), 0) INTO ultimo_recibo
                FROM pagos
                WHERE YEAR(fecha_pago) = YEAR(CURRENT_DATE);
                
                SET NEW.numero_recibo = CONCAT(\'REC-\', YEAR(CURRENT_DATE), \'-\', LPAD(ultimo_recibo + 1, 6, \'0\'));
            END
        ');
    }
};
