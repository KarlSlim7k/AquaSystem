import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import dashboardService from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto || 0);
  };

  const getRoleBadge = (rol) => {
    const roleConfig = {
      administrador: { color: 'bg-purple-500', text: 'Administrador' },
      gestor_campo: { color: 'bg-blue-500', text: 'Gestor Campo' },
      cobrador: { color: 'bg-green-500', text: 'Cobrador' },
      supervisor: { color: 'bg-orange-500', text: 'Supervisor' },
    };
    const config = roleConfig[rol] || { color: 'bg-gray-500', text: 'Usuario' };
    return (
      <span className={`${config.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <ErrorAlert message={error} />
      </div>
    );
  }

  // Preparar datos para gráficas
  const dataUsuariosPorColonia = {
    labels: estadisticas?.usuarios_por_colonia?.map(item => item.colonia) || [],
    datasets: [{
      label: 'Usuarios',
      data: estadisticas?.usuarios_por_colonia?.map(item => item.total) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }]
  };

  const dataPagosUltimos30Dias = {
    labels: estadisticas?.pagos_ultimos_30_dias?.map(item => item.fecha) || [],
    datasets: [
      {
        label: 'Cantidad de Pagos',
        data: estadisticas?.pagos_ultimos_30_dias?.map(item => item.cantidad) || [],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Monto Total (MXN)',
        data: estadisticas?.pagos_ultimos_30_dias?.map(item => item.monto_total) || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
      }
    ]
  };

  const dataDistribucionMetodos = {
    labels: estadisticas?.distribucion_metodos?.map(item => {
      const metodos = {
        'efectivo': 'Efectivo',
        'transferencia': 'Transferencia',
        'cheque': 'Cheque',
        'tarjeta': 'Tarjeta'
      };
      return metodos[item.metodo_pago] || item.metodo_pago;
    }) || [],
    datasets: [{
      data: estadisticas?.distribucion_metodos?.map(item => item.total) || [],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(251, 146, 60, 1)',
        'rgba(168, 85, 247, 1)',
      ],
      borderWidth: 1,
    }]
  };

  const opcionesBarChart = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Usuarios por Colonia' }
    }
  };

  const opcionesLineChart = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Pagos - Últimos 30 Días' }
    },
    scales: {
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Cantidad' } },
      y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Monto (MXN)' }, grid: { drawOnChartArea: false } }
    }
  };

  const opcionesPieChart = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Métodos de Pago' }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Bienvenido, {user?.nombre_completo}
              </h1>
              <p className="text-blue-100">
                Panel de control - Sistema AquaTenex
              </p>
            </div>
            <div className="text-right">
              {getRoleBadge(user?.rol)}
              <p className="text-blue-100 text-sm mt-2">
                {new Date().toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="h-8 w-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Usuarios Totales</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {estadisticas?.resumen?.total_usuarios || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pagos del Día</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {estadisticas?.resumen?.pagos_hoy || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatearMoneda(estadisticas?.resumen?.monto_recaudado_hoy)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Usuarios Suspendidos</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {estadisticas?.resumen?.usuarios_suspendidos || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <svg className="h-8 w-8 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Recaudación Mes</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatearMoneda(estadisticas?.resumen?.monto_recaudado_mes)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {estadisticas?.resumen?.pagos_mes || 0} pagos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Usuarios por Colonia */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Bar data={dataUsuariosPorColonia} options={opcionesBarChart} />
          </div>

          {/* Distribución Métodos de Pago */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Pie data={dataDistribucionMetodos} options={opcionesPieChart} />
          </div>
        </div>

        {/* Gráfica de Pagos (ancho completo) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <Line data={dataPagosUltimos30Dias} options={opcionesLineChart} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/usuarios"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="ml-3 text-gray-900 dark:text-white font-medium">Gestionar Usuarios</span>
            </Link>

            <Link
              to="/pagos"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="ml-3 text-gray-900 dark:text-white font-medium">Registrar Pago</span>
            </Link>

            <Link
              to="/mapa"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="ml-3 text-gray-900 dark:text-white font-medium">Ver Mapa</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
