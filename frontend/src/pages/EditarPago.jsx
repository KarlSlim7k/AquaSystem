import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import pagoService from '../services/pagoService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessToast from '../components/SuccessToast';

const schema = yup.object({
  monto_pagado: yup.number()
    .transform((value, originalValue) => originalValue === '' ? 0 : Number(originalValue))
    .required('El monto pagado es requerido')
    .min(0.01, 'El monto debe ser mayor a 0')
    .typeError('Debe ingresar un monto válido'),
  monto_recargo: yup.number()
    .transform((value, originalValue) => originalValue === '' ? 0 : Number(originalValue))
    .min(0, 'El recargo debe ser mayor o igual a 0')
    .typeError('Debe ingresar un recargo válido'),
  monto_total: yup.number()
    .transform((value, originalValue) => originalValue === '' ? 0 : Number(originalValue))
    .required('El monto total es requerido')
    .min(0.01, 'El total debe ser mayor a 0')
    .typeError('Debe ingresar un total válido'),
  periodo_inicio: yup.string().required('La fecha de inicio es requerida'),
  periodo_fin: yup.string().required('La fecha de fin es requerida'),
  metodo_pago: yup.string().required('El método de pago es requerido').oneOf(['efectivo', 'transferencia', 'tarjeta', 'cheque', 'otro']),
  referencia_pago: yup.string().max(100),
  fecha_pago: yup.string().required('La fecha de pago es requerida'),
  estatus_pago: yup.string().required('El estatus es requerido').oneOf(['completado', 'pendiente', 'cancelado']),
  notas: yup.string()
}).required();

function EditarPago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pago, setPago] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const montoPagado = watch('monto_pagado');
  const montoRecargo = watch('monto_recargo');
  const estatusActual = watch('estatus_pago');

  useEffect(() => {
    cargarPago();
  }, [id]);

  useEffect(() => {
    const pagado = parseFloat(montoPagado) || 0;
    const recargo = parseFloat(montoRecargo) || 0;
    const total = pagado + recargo;
    setValue('monto_total', total.toFixed(2));
  }, [montoPagado, montoRecargo]);

  const cargarPago = async () => {
    try {
      setLoading(true);
      const data = await pagoService.getById(id);
      setPago(data);
      
      // Cargar valores en el formulario
      setValue('monto_pagado', data.monto_pagado);
      setValue('monto_recargo', data.monto_recargo || 0);
      setValue('monto_total', data.monto_total);
      setValue('periodo_inicio', data.periodo_inicio.split('T')[0]);
      setValue('periodo_fin', data.periodo_fin.split('T')[0]);
      setValue('metodo_pago', data.metodo_pago);
      setValue('referencia_pago', data.referencia_pago || '');
      setValue('fecha_pago', data.fecha_pago.split('T')[0]);
      setValue('estatus_pago', data.estatus_pago);
      setValue('notas', data.notas || '');
      
      setError(null);
    } catch (err) {
      setError('Error al cargar el pago: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);

      await pagoService.update(id, data);
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/pagos/${id}`);
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          'Error desconocido al actualizar el pago';
                          
      setError('Error al actualizar el pago: ' + errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando información del pago..." />;
  }

  if (!pago) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorAlert message="Pago no encontrado" onClose={() => navigate('/pagos')} />
      </div>
    );
  }

  if (pago.estatus_pago === 'cancelado') {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorAlert 
          message="No se puede editar un pago cancelado" 
          onClose={() => navigate(`/pagos/${id}`)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/pagos/${id}`)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al Detalle
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Pago</h1>
          <p className="text-gray-600 mt-1">Modificar información del pago {pago.numero_recibo}</p>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {showSuccess && <SuccessToast message="Pago actualizado exitosamente" />}

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información del Usuario (Solo lectura) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usuario</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={pago.usuario?.nombre_completo || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Cuenta
              </label>
              <input
                type="text"
                value={pago.usuario?.numero_cuenta || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Número de Recibo (Solo lectura) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Recibo</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Recibo
            </label>
            <input
              type="text"
              value={pago.numero_recibo}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        {/* Período de Pago */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Período de Pago</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('periodo_inicio')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.periodo_inicio && <p className="text-red-500 text-sm mt-1">{errors.periodo_inicio.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('periodo_fin')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.periodo_fin && <p className="text-red-500 text-sm mt-1">{errors.periodo_fin.message}</p>}
            </div>
          </div>
        </div>

        {/* Montos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Montos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Pagado <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('monto_pagado')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.monto_pagado && <p className="text-red-500 text-sm mt-1">{errors.monto_pagado.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recargo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('monto_recargo')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.monto_recargo && <p className="text-red-500 text-sm mt-1">{errors.monto_recargo.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('monto_total')}
                  disabled
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold"
                />
              </div>
              {errors.monto_total && <p className="text-red-500 text-sm mt-1">{errors.monto_total.message}</p>}
            </div>
          </div>
        </div>

        {/* Método de Pago */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Método de Pago</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método <span className="text-red-500">*</span>
              </label>
              <select
                {...register('metodo_pago')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="cheque">Cheque</option>
                <option value="otro">Otro</option>
              </select>
              {errors.metodo_pago && <p className="text-red-500 text-sm mt-1">{errors.metodo_pago.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia / Folio
              </label>
              <input
                type="text"
                {...register('referencia_pago')}
                placeholder="Número de operación, folio, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.referencia_pago && <p className="text-red-500 text-sm mt-1">{errors.referencia_pago.message}</p>}
            </div>
          </div>
        </div>

        {/* Fecha y Estado */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fecha y Estado del Pago</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Pago <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('fecha_pago')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.fecha_pago && <p className="text-red-500 text-sm mt-1">{errors.fecha_pago.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estatus <span className="text-red-500">*</span>
              </label>
              <select
                {...register('estatus_pago')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="completado">Completado</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
              {errors.estatus_pago && <p className="text-red-500 text-sm mt-1">{errors.estatus_pago.message}</p>}
              
              {estatusActual === 'cancelado' && (
                <p className="text-orange-600 text-sm mt-2">
                  ⚠️ Al cambiar el estatus a "Cancelado", el pago no podrá ser editado nuevamente.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notas</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones adicionales
            </label>
            <textarea
              {...register('notas')}
              rows="3"
              placeholder="Observaciones adicionales sobre el pago..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {errors.notas && <p className="text-red-500 text-sm mt-1">{errors.notas.message}</p>}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/pagos/${id}`)}
            disabled={submitting}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarPago;
