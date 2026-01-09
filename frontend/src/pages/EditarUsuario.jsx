import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { usuarioAguaService } from '../services/usuarioAguaService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessToast from '../components/SuccessToast';

const schema = yup.object({
  nombre_completo: yup.string().required('El nombre completo es requerido').max(150, 'Máximo 150 caracteres'),
  telefono: yup.string().max(15, 'Máximo 15 caracteres'),
  email: yup.string().email('Email inválido'),
  identificacion_oficial: yup.string().max(50, 'Máximo 50 caracteres'),
  tipo_propiedad: yup.string().required('El tipo de propiedad es obligatorio').oneOf(['Residencial', 'Comercial', 'Industrial']),
  calle: yup.string().required('La calle es requerida').max(150, 'Máximo 150 caracteres'),
  numero_exterior: yup.string().max(10, 'Máximo 10 caracteres'),
  numero_interior: yup.string().max(10, 'Máximo 10 caracteres'),
  colonia: yup.string().required('La colonia es requerida').max(100, 'Máximo 100 caracteres'),
  codigo_postal: yup.string().max(10, 'Máximo 10 caracteres'),
  referencias: yup.string(),
  latitud: yup.number().min(-90, 'Latitud inválida').max(90, 'Latitud inválida'),
  longitud: yup.number().min(-180, 'Longitud inválida').max(180, 'Longitud inválida'),
  estatus: yup.string().oneOf(['activo', 'suspendido', 'baja'], 'Estatus inválido'),
  notas: yup.string()
}).required();

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fotoDomicilio, setFotoDomicilio] = useState(null);
  const [fotoMedidor, setFotoMedidor] = useState(null);
  const [fotoDomicilioPreview, setFotoDomicilioPreview] = useState(null);
  const [fotoMedidorPreview, setFotoMedidorPreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    cargarUsuario();
  }, [id]);

  const cargarUsuario = async () => {
    try {
      setLoading(true);
      const response = await usuarioAguaService.getById(id);
      console.log('Respuesta editar usuario:', response);
      
      // El servicio retorna response.data que contiene { success, data }
      const data = response.data || response;
      
      // Llenar el formulario con los datos existentes
      setValue('nombre_completo', data.nombre_completo || '');
      setValue('telefono', data.telefono || '');
      setValue('email', data.email || '');
      setValue('identificacion_oficial', data.identificacion_oficial || '');
      setValue('tipo_propiedad', data.tipo_propiedad || 'Residencial');
      setValue('calle', data.calle || '');
      setValue('numero_exterior', data.numero_exterior || '');
      setValue('numero_interior', data.numero_interior || '');
      setValue('colonia', data.colonia || '');
      setValue('codigo_postal', data.codigo_postal || '');
      setValue('referencias', data.referencias || '');
      setValue('latitud', data.latitud || '');
      setValue('longitud', data.longitud || '');
      setValue('estatus', data.estatus || 'activo');
      setValue('notas', data.notas || '');

      // Establecer previews de fotos existentes
      if (data.foto_domicilio_url) {
        setFotoDomicilioPreview(data.foto_domicilio_url);
      }
      if (data.foto_medidor_url) {
        setFotoMedidorPreview(data.foto_medidor_url);
      }

      setError(null);
    } catch (err) {
      console.error('Error al cargar usuario para editar:', err);
      setError('Error al cargar el usuario: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitud', position.coords.latitude.toFixed(8));
          setValue('longitud', position.coords.longitude.toFixed(8));
          setError(null);
        },
        (error) => {
          setError('Error al obtener ubicación: ' + error.message);
        }
      );
    } else {
      setError('La geolocalización no está soportada en este navegador');
    }
  };

  const handleFotoDomicilioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoDomicilio(file);
      setFotoDomicilioPreview(URL.createObjectURL(file));
    }
  };

  const handleFotoMedidorChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoMedidor(file);
      setFotoMedidorPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });

      if (fotoDomicilio) {
        formData.append('foto_domicilio', fotoDomicilio);
      }
      if (fotoMedidor) {
        formData.append('foto_medidor', fotoMedidor);
      }

      await usuarioAguaService.update(id, formData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/usuarios/${id}`);
      }, 1500);
    } catch (err) {
      setError('Error al actualizar: ' + (err.response?.data?.message || err.message));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando información del usuario..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(`/usuarios/${id}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Usuario</h1>
            <p className="text-gray-600 mt-1">Actualiza la información del usuario de agua</p>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {showSuccess && <SuccessToast message="Usuario actualizado exitosamente" />}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        {/* Información Personal */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('nombre_completo')}
                placeholder="Nombre(s) y Apellidos"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.nombre_completo && <p className="text-red-500 text-sm mt-1">{errors.nombre_completo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estatus <span className="text-red-500">*</span>
              </label>
              <select
                {...register('estatus')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="activo">Activo</option>
                <option value="suspendido">Suspendido</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                {...register('telefono')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identificación Oficial
              </label>
              <input
                type="text"
                {...register('identificacion_oficial')}
                placeholder="INE, Pasaporte, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Propiedad <span className="text-red-500">*</span>
              </label>
              <select
                {...register('tipo_propiedad')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Industrial">Industrial</option>
              </select>
              {errors.tipo_propiedad && <p className="text-red-500 text-sm mt-1">{errors.tipo_propiedad.message}</p>}
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dirección</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('calle')}
                placeholder="Nombre de la calle"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.calle && <p className="text-red-500 text-sm mt-1">{errors.calle.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Exterior
              </label>
              <input
                type="text"
                {...register('numero_exterior')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colonia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('colonia')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.colonia && <p className="text-red-500 text-sm mt-1">{errors.colonia.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Postal
              </label>
              <input
                type="text"
                {...register('codigo_postal')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Interior
              </label>
              <input
                type="text"
                {...register('numero_interior')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referencias
              </label>
              <input
                type="text"
                {...register('referencias')}
                placeholder="Entre calles, puntos de referencia..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Ubicación GPS */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ubicación GPS</h2>
            <button
              type="button"
              onClick={obtenerUbicacion}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Actualizar Ubicación
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitud</label>
              <input
                type="number"
                step="0.00000001"
                {...register('latitud')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitud</label>
              <input
                type="number"
                step="0.00000001"
                {...register('longitud')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Fotografías */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fotografías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto del Domicilio
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoDomicilioChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {fotoDomicilioPreview && (
                <img src={fotoDomicilioPreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto del Medidor
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoMedidorChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {fotoMedidorPreview && (
                <img src={fotoMedidorPreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
              )}
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
            placeholder="Observaciones adicionales sobre el usuario o domicilio..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/usuarios/${id}`)}
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
            {submitting ? 'Actualizando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;
