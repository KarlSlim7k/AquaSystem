<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Verificando triggers en la tabla 'pagos' ===\n\n";

$triggers = DB::select('SHOW TRIGGERS');

$pagoTriggers = array_filter($triggers, function($trigger) {
    return $trigger->Table === 'pagos';
});

if (empty($pagoTriggers)) {
    echo "✅ NO hay triggers en la tabla 'pagos'. El trigger problemático fue eliminado correctamente.\n";
} else {
    echo "⚠️ Triggers encontrados:\n";
    foreach ($pagoTriggers as $trigger) {
        echo "  - {$trigger->Trigger} ({$trigger->Event} {$trigger->Timing})\n";
    }
}

echo "\n=== Fin de la verificación ===\n";
