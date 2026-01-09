import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import pagoService from '../services/pagoService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function PagoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    cargarPago();
  }, [id]);

  const cargarPago = async () => {
    try {
      setLoading(true);
      const data = await pagoService.getById(id);
      setPago(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el pago: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    try {
      setCancelando(true);
      await pagoService.delete(id);
      navigate('/pagos');
    } catch (err) {
      setError('Error al cancelar el pago: ' + (err.response?.data?.message || err.message));
    } finally {
      setCancelando(false);
      setShowCancelModal(false);
    }
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstatusBadge = (estatus) => {
    const styles = {
      completado: 'bg-green-100 text-green-800',
      pendiente: 'bg-yellow-100 text-yellow-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    const labels = {
      completado: 'Completado',
      pendiente: 'Pendiente',
      cancelado: 'Cancelado'
    };
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[estatus]}`}>
        {labels[estatus]}
      </span>
    );
  };

  const getMetodoPagoIcon = (metodo) => {
    const icons = {
      efectivo: '💵',
      tarjeta: '💳',
      transferencia: '🏦',
      cheque: '📝',
      otro: '📄'
    };
    return icons[metodo] || '💰';
  };

  if (loading) {
    return <LoadingSpinner message="Cargando información del pago..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorAlert message={error} onClose={() => navigate('/pagos')} />
      </div>
    );
  }

  if (!pago) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorAlert message="Pago no encontrado" onClose={() => navigate('/pagos')} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/pagos')}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Pagos
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalles del Pago</h1>
            <p className="text-gray-600 mt-1">Recibo {pago.numero_recibo}</p>
          </div>
          <div className="flex gap-2">
            {pago.estatus_pago !== 'cancelado' && (
              <>
                <Link
                  to={`/pagos/${pago.id_pago}/editar`}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </Link>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar Pago
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {/* Información del Pago */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Estado y Recibo */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h2 className="text-2xl font-bold">{pago.numero_recibo}</h2>
              <p className="text-blue-100">Pago de Servicio de Agua</p>
            </div>
            {getEstatusBadge(pago.estatus_pago)}
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="border-b border-gray-200 px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Usuario</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nombre Completo</p>
              <p className="text-base font-medium text-gray-900">{pago.usuario?.nombre_completo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Número de Cuenta</p>
              <p className="text-base font-medium text-gray-900">{pago.usuario?.numero_cuenta}</p>
            </div>
            {pago.usuario?.direccion && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="text-base text-gray-900">{pago.usuario.direccion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Detalles del Pago */}
        <div className="border-b border-gray-200 px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalles del Pago</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fecha de Pago</p>
              <p className="text-base font-medium text-gray-900">{formatearFecha(pago.fecha_pago)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Método de Pago</p>
              <p className="text-base font-medium text-gray-900">
                <span className="mr-2">{getMetodoPagoIcon(pago.metodo_pago)}</span>
                {pago.metodo_pago.charAt(0).toUpperCase() + pago.metodo_pago.slice(1)}
              </p>
            </div>
            {pago.referencia_pago && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Referencia de Pago</p>
                <p className="text-base font-medium text-gray-900">{pago.referencia_pago}</p>
              </div>
            )}
          </div>
        </div>

        {/* Período Cubierto */}
        <div className="border-b border-gray-200 px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Período Cubierto</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fecha Inicio</p>
              <p className="text-base font-medium text-gray-900">{formatearFecha(pago.periodo_inicio)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha Fin</p>
              <p className="text-base font-medium text-gray-900">{formatearFecha(pago.periodo_fin)}</p>
            </div>
          </div>
        </div>

        {/* Montos */}
        <div className="border-b border-gray-200 px-6 py-5 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Montos</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monto Pagado:</span>
              <span className="text-lg font-medium text-gray-900">{formatearMonto(pago.monto_pagado)}</span>
            </div>
            {parseFloat(pago.monto_recargo) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recargo:</span>
                <span className="text-lg font-medium text-orange-600">{formatearMonto(pago.monto_recargo)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-blue-600">{formatearMonto(pago.monto_total)}</span>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Información Adicional</h3>
          <div className="grid grid-cols-2 gap-4">
            {pago.registrador && (
              <div>
                <p className="text-sm text-gray-500">Registrado Por</p>
                <p className="text-base font-medium text-gray-900">{pago.registrador.nombre_completo}</p>
              </div>
            )}
            {pago.fecha_cancelacion && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Cancelación</p>
                  <p className="text-base font-medium text-gray-900">{formatearFecha(pago.fecha_cancelacion)}</p>
                </div>
                {pago.motivo_cancelacion && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Motivo de Cancelación</p>
                    <p className="text-base text-gray-900">{pago.motivo_cancelacion}</p>
                  </div>
                )}
              </>
            )}
            {pago.notas && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Notas</p>
                <p className="text-base text-gray-900">{pago.notas}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              ¿Cancelar este pago?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Esta acción marcará el pago como cancelado. ¿Estás seguro de continuar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelando}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                No, mantener
              </button>
              <button
                onClick={handleCancelar}
                disabled={cancelando}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelando ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PagoDetalle;
