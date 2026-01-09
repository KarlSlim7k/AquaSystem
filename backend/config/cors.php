<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        // DEMO-TUNNEL: Added explicit demo origin for the VS Code DevTunnel (remove on migration)
        'https://fs151wjc-443.usw3.devtunnels.ms',
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
        'http://localhost:5174', 
        'http://127.0.0.1:5174'
    ],
    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.devtunnels\.ms$/',  // Para VS Code tunnels (mantener)
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
