import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pagoService from '../services/pagoService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function PagosEstadisticas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const data = await pagoService.getEstadisticas(params);
      setEstadisticas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar estadísticas: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    cargarEstadisticas();
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto || 0);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando estadísticas..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pagos')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estadísticas de Pagos</h1>
            <p className="text-gray-600 mt-1">Resumen y análisis de pagos registrados</p>
          </div>
        </div>
      </div>

      {/* Filtros de fecha */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleFiltrar} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={() => {
              setFechaInicio('');
              setFechaFin('');
              cargarEstadisticas();
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpiar
          </button>
        </form>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {estadisticas && (
        <div className="space-y-6">
          {/* Cards de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Pagos</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total_pagos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Monto Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatearMonto(estadisticas.monto_total)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.pagos_pendientes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cancelados</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.pagos_cancelados}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recargos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recargos Cobrados</h2>
            <div className="text-3xl font-bold text-orange-600">
              {formatearMonto(estadisticas.monto_recargos)}
            </div>
            <p className="text-sm text-gray-500 mt-2">Total de recargos por pagos tardíos</p>
          </div>

          {/* Métodos de pago */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pagos por Método</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {estadisticas.metodos_pago.map((metodo) => (
                <div key={metodo.metodo_pago} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">
                      {metodo.metodo_pago === 'efectivo' && '💵'}
                      {metodo.metodo_pago === 'tarjeta' && '💳'}
                      {metodo.metodo_pago === 'transferencia' && '🏦'}
                      {metodo.metodo_pago === 'cheque' && '📝'}
                      {metodo.metodo_pago === 'otro' && '📄'}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{metodo.total}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 capitalize">{metodo.metodo_pago}</p>
                  <p className="text-lg font-semibold text-blue-600 mt-2">{formatearMonto(metodo.monto)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfica simple con barras */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribución por Método</h2>
            <div className="space-y-4">
              {estadisticas.metodos_pago.map((metodo) => {
                const porcentaje = (metodo.monto / estadisticas.monto_total * 100).toFixed(1);
                return (
                  <div key={metodo.metodo_pago}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{metodo.metodo_pago}</span>
                      <span className="text-sm font-medium text-gray-700">{porcentaje}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PagosEstadisticas;
