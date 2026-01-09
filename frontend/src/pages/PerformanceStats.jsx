import { useState, useEffect } from 'react';

function PerformanceStats() {
  const [stats, setStats] = useState({
    loadTime: 0,
    totalResources: 0,
    cacheHits: 0,
    networkCalls: 0,
    swStatus: 'checking'
  });

  useEffect(() => {
    // Obtener métricas de rendimiento
    if (window.performance) {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      setStats(prev => ({
        ...prev,
        loadTime: (loadTime / 1000).toFixed(2),
        totalResources: performance.getEntriesByType('resource').length
      }));
    }

    // Verificar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        setStats(prev => ({
          ...prev,
          swStatus: reg ? 'active' : 'inactive'
        }));
      });
    }

    // Simular cache hits (en producción se obtendría del SW)
    const cacheHits = localStorage.getItem('cacheHits') || 0;
    setStats(prev => ({ ...prev, cacheHits: parseInt(cacheHits) }));
  }, []);

  const isOnline = navigator.onLine;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📊 Estadísticas de Rendimiento
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tiempo de carga */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Tiempo de Carga</span>
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.loadTime}s</p>
          </div>

          {/* Recursos cargados */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Recursos</span>
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalResources}</p>
          </div>

          {/* Cache hits */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Cache Hits</span>
              <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.cacheHits}</p>
          </div>

          {/* Estado conexión */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Conexión</span>
              <svg className={`h-6 w-6 ${isOnline ? 'text-green-500' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </p>
          </div>
        </div>

        {/* Service Worker Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Service Worker Status
          </h2>
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${stats.swStatus === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-gray-700">
              {stats.swStatus === 'active' ? '✅ Activo y funcionando' : '⚠️ No activo'}
            </span>
          </div>
          {stats.swStatus === 'active' && (
            <p className="mt-4 text-sm text-gray-500">
              El Service Worker está cacheando recursos y permitiendo funcionalidad offline.
            </p>
          )}
        </div>

        {/* PWA Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Características PWA
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Instalable en dispositivo</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Funcionamiento offline básico</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Cache de recursos estáticos</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Cache de tiles de mapa</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Code splitting optimizado</span>
            </div>
          </div>
        </div>

        {/* Optimizaciones implementadas */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            ✨ Optimizaciones Implementadas
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Lazy loading de componentes pesados (React.lazy)</li>
            <li>• Code splitting por vendors (React, Redux, Charts, Maps)</li>
            <li>• Service Worker para cache offline</li>
            <li>• Cache de API con estrategia NetworkFirst</li>
            <li>• Cache de imágenes con estrategia CacheFirst</li>
            <li>• Compresión de imágenes antes de upload</li>
            <li>• Debouncing en búsquedas</li>
            <li>• Manifest.json para PWA</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PerformanceStats;
