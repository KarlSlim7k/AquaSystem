<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://ks7k.org',
        'https://*.ks7k.org',
    ],
    'allowed_origins_patterns' => [
        '/^https:\/\/([a-zA-Z0-9-]+\.)?ks7k\.org$/',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
