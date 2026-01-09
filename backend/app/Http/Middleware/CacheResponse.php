<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  int  $minutes  Tiempo de cache en minutos
     */
    public function handle(Request $request, Closure $next, int $minutes = 5): Response
    {
        // Solo cachear GET requests
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Generar key única basada en URL y usuario
        $userId = $request->user()?->id_usuario ?? 'guest';
        $cacheKey = 'api_cache:' . $userId . ':' . md5($request->fullUrl());

        // Intentar obtener del cache
        $cachedResponse = Cache::get($cacheKey);

        if ($cachedResponse) {
            return response()->json($cachedResponse)
                ->header('X-Cache-Hit', 'true')
                ->header('Cache-Control', 'public, max-age=' . ($minutes * 60));
        }

        // Procesar request
        $response = $next($request);

        // Cachear solo respuestas exitosas
        if ($response->getStatusCode() === 200 && $response instanceof \Illuminate\Http\JsonResponse) {
            Cache::put($cacheKey, $response->getData(true), now()->addMinutes($minutes));
        }

        return $response;
    }
}
