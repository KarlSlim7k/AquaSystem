import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import pagoService from '../services/pagoService';
import { usuarioAguaService } from '../services/usuarioAguaService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessToast from '../components/SuccessToast';

const schema = yup.object({
  id_usuario: yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : Number(originalValue);
    })
    .required('Debe seleccionar un usuario')
    .typeError('Debe seleccionar un usuario'),
  numero_recibo: yup.string().required('El número de recibo es requerido').max(30),
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
  notas: yup.string()
}).required();

function RegistrarPago() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idUsuarioParam = searchParams.get('id_usuario');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [searchUsuario, setSearchUsuario] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fecha_pago: new Date().toISOString().split('T')[0],
      metodo_pago: 'efectivo',
      monto_recargo: 0,
      monto_pagado: 0,
      monto_total: 0
    }
  });

  const montoPagado = watch('monto_pagado');
  const montoRecargo = watch('monto_recargo');

  useEffect(() => {
    generarNumeroRecibo();
    if (idUsuarioParam) {
      setValue('id_usuario', parseInt(idUsuarioParam));
      // Cargar información del usuario si viene el parámetro
      cargarUsuarioPorId(parseInt(idUsuarioParam));
    }
  }, [idUsuarioParam]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mostrarDropdown && !event.target.closest('.search-usuario-container')) {
        setMostrarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mostrarDropdown]);

  const cargarUsuarioPorId = async (id) => {
    try {
      const response = await usuarioAguaService.getById(id);
      const usuario = response.data || response;
      if (usuario) {
        setUsuarioSeleccionado(usuario);
        setSearchUsuario(`${usuario.nombre_completo} - ${usuario.numero_cuenta}`);
      }
    } catch (err) {
      console.error('Error al cargar usuario:', err);
    }
  };

  useEffect(() => {
    const pagado = parseFloat(montoPagado) || 0;
    const recargo = parseFloat(montoRecargo) || 0;
    const total = pagado + recargo;
    setValue('monto_total', total.toFixed(2));
  }, [montoPagado, montoRecargo]);

  const generarNumeroRecibo = async () => {
    try {
      const data = await pagoService.generarNumeroRecibo();
      setValue('numero_recibo', data.numero_recibo);
    } catch (err) {
      console.error('Error al generar número de recibo:', err);
    }
  };

  const buscarUsuarios = async (termino) => {
    if (termino.length < 2) {
      setUsuarios([]);
      setMostrarDropdown(false);
      return;
    }

    try {
      setLoadingUsuarios(true);
      setMostrarDropdown(true);
      const response = await usuarioAguaService.getAll({ search: termino, per_page: 10 });
      
      // Asegurar que sea un array - probando múltiples estructuras
      let usuariosData = [];
      
      if (Array.isArray(response.data)) {
        usuariosData = response.data;
      } else if (Array.isArray(response)) {
        usuariosData = response;
      } else if (response.data && Array.isArray(response.data.data)) {
        usuariosData = response.data.data;
      } else if (response.users && Array.isArray(response.users)) {
        usuariosData = response.users;
      }
      
      setUsuarios(usuariosData);
    } catch (err) {
      console.error('Error al buscar usuarios:', err);
      setUsuarios([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setValue('id_usuario', usuario.id_usuario);
    setSearchUsuario(`${usuario.nombre_completo} - ${usuario.numero_cuenta}`);
    setUsuarios([]);
    setMostrarDropdown(false);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);

      // Generar nuevo número de recibo antes de enviar para evitar duplicados
      try {
        const reciboData = await pagoService.generarNumeroRecibo();
        data.numero_recibo = reciboData.numero_recibo;
      } catch (err) {
        console.warn('No se pudo generar número de recibo, usando el existente');
      }

      console.log('📤 Datos a enviar:', data);
      console.log('📤 Datos expandidos:', JSON.stringify(data, null, 2));
      
      const response = await pagoService.create(data);
      console.log('✅ Respuesta del servidor:', response);
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/pagos');
      }, 1500);
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error response data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message || 
                          'Error desconocido al registrar el pago';
                          
      setError('Error al registrar el pago: ' + errorMessage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/pagos')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registrar Pago</h1>
            <p className="text-gray-600 mt-1">Captura un nuevo pago de servicio de agua</p>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {showSuccess && <SuccessToast message="Pago registrado exitosamente" />}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        {/* Información del Recibo */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Recibo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Recibo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('numero_recibo')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                readOnly
              />
              {errors.numero_recibo && <p className="text-red-500 text-sm mt-1">{errors.numero_recibo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Pago <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('fecha_pago')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Usuario */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usuario</h2>
          <div className="mb-4 relative search-usuario-container">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Usuario <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchUsuario}
                onChange={(e) => {
                  const valor = e.target.value;
                  setSearchUsuario(valor);
                  buscarUsuarios(valor);
                  if (usuarioSeleccionado) {
                    setUsuarioSeleccionado(null);
                    setValue('id_usuario', '');
                  }
                }}
                onFocus={() => {
                  if (usuarios.length > 0) {
                    setMostrarDropdown(true);
                  }
                }}
                placeholder="Escribe al menos 2 caracteres para buscar..."
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.id_usuario ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {loadingUsuarios && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
              {usuarioSeleccionado && (
                <div className="absolute right-3 top-2.5">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Dropdown de resultados */}
            {mostrarDropdown && usuarios.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <div className="p-2 bg-gray-50 border-b text-xs text-gray-600 font-medium">
                  {usuarios.length} {usuarios.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
                </div>
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id_usuario}
                    onClick={() => seleccionarUsuario(usuario)}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{usuario.nombre_completo}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="inline-flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            {usuario.numero_cuenta}
                          </span>
                          <span className="mx-2">|</span>
                          <span className="inline-flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {usuario.calle} {usuario.numero_exterior}, {usuario.colonia}
                          </span>
                        </div>
                      </div>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.estatus === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.estatus === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mostrar usuario seleccionado */}
            {usuarioSeleccionado && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Usuario seleccionado:</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{usuarioSeleccionado.nombre_completo}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Cuenta: {usuarioSeleccionado.numero_cuenta} | {usuarioSeleccionado.calle} {usuarioSeleccionado.numero_exterior}, {usuarioSeleccionado.colonia}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUsuarioSeleccionado(null);
                      setSearchUsuario('');
                      setValue('id_usuario', '');
                    }}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          <input type="hidden" {...register('id_usuario')} />
          {errors.id_usuario && <p className="text-red-500 text-sm mt-1">{errors.id_usuario.message}</p>}
        </div>

        {/* Período */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Período de Pago</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Montos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto Pagado <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recargo
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('monto_recargo')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('monto_total')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 font-semibold"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Método de Pago */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Método de Pago</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método <span className="text-red-500">*</span>
              </label>
              <select
                {...register('metodo_pago')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="cheque">Cheque</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencia / Folio
              </label>
              <input
                type="text"
                {...register('referencia_pago')}
                placeholder="Número de operación, folio, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas
          </label>
          <textarea
            {...register('notas')}
            rows="3"
            placeholder="Observaciones adicionales sobre el pago..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/pagos')}
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
            {submitting ? 'Registrando...' : 'Registrar Pago'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrarPago;
