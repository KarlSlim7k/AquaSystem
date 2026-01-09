import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usuarioAguaService } from '../services/usuarioAguaService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import SuccessToast from '../components/SuccessToast';
import ConfirmDialog from '../components/ConfirmDialog';

const schema = yup.object({
  nombre_completo: yup.string().required('El nombre completo es obligatorio').max(150),
  calle: yup.string().required('La calle es obligatoria').max(150),
  colonia: yup.string().required('La colonia es obligatoria').max(100),
  telefono: yup.string().required('El teléfono es obligatorio').max(15),
  codigo_postal: yup.string().required('El código postal es obligatorio').max(10),
  tipo_propiedad: yup.string().required('El tipo de propiedad es obligatorio').oneOf(['Residencial', 'Comercial', 'Industrial']),
  email: yup.string().email('Email inválido').max(100),
  notas: yup.string()
});

function CensarUsuario() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fotoDomicilio, setFotoDomicilio] = useState(null);
  const [fotoMedidor, setFotoMedidor] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const fotoDomicilioRef = useRef(null);
  const fotoMedidorRef = useRef(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      estatus: 'activo',
      tipo_propiedad: 'Residencial'
    }
  });

  const obtenerUbicacion = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitud', position.coords.latitude.toFixed(8));
          setValue('longitud', position.coords.longitude.toFixed(8));
          setGpsLoading(false);
          setSuccess('Ubicación GPS obtenida correctamente');
        },
        (error) => {
          setGpsLoading(false);
          setError('Error al obtener ubicación GPS: ' + error.message);
        }
      );
    } else {
      setGpsLoading(false);
      setError('Tu navegador no soporta geolocalización');
    }
  };

  const handleFotoDomicilioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoDomicilio(URL.createObjectURL(file));
    }
  };

  const handleFotoMedidorChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoMedidor(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Agregar archivos al objeto data
      if (fotoDomicilioRef.current?.files[0]) {
        data.foto_domicilio = fotoDomicilioRef.current.files[0];
      }
      if (fotoMedidorRef.current?.files[0]) {
        data.foto_medidor = fotoMedidorRef.current.files[0];
      }

      await usuarioAguaService.create(data);
      
      setSuccess('Usuario registrado exitosamente');
      setLoading(false);
      
      // Mostrar modal de confirmación después de guardar exitosamente
      setShowConfirmDialog(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
      setLoading(false);
    }
  };

  // Manejar la respuesta del modal
  const handleAddAnother = () => {
    setShowConfirmDialog(false);
    setSuccess(null);
    setFotoDomicilio(null);
    setFotoMedidor(null);
    
    // Resetear formulario
    reset({
      estatus: 'activo',
      tipo_propiedad: 'Residencial'
    });
    
    // Limpiar inputs de archivos
    if (fotoDomicilioRef.current) fotoDomicilioRef.current.value = '';
    if (fotoMedidorRef.current) fotoMedidorRef.current.value = '';
  };

  const handleGoToList = () => {
    setShowConfirmDialog(false);
    navigate('/usuarios');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Censar Nuevo Usuario</h1>
        <p className="text-gray-600 mt-1">Registrar nuevo usuario del servicio de agua potable</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessToast message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        {/* Información Personal */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('telefono')}
                placeholder="2821234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
            </div>

            <div>
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

            <div>
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
                Código Postal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('codigo_postal')}
                placeholder="91285"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.codigo_postal && <p className="text-red-500 text-sm mt-1">{errors.codigo_postal.message}</p>}
            </div>

            <div className="md:col-span-2">
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ubicación GPS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitud
              </label>
              <input
                type="text"
                {...register('latitud')}
                placeholder="19.50111230"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud
              </label>
              <input
                type="text"
                {...register('longitud')}
                placeholder="-97.34665216"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={obtenerUbicacion}
                disabled={gpsLoading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {gpsLoading ? 'Obteniendo...' : 'Obtener GPS'}
              </button>
            </div>
          </div>
        </div>

        {/* Fotografías */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fotografías</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto del Domicilio
              </label>
              <input
                type="file"
                ref={fotoDomicilioRef}
                accept="image/*"
                onChange={handleFotoDomicilioChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {fotoDomicilio && (
                <img src={fotoDomicilio} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />
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
            onClick={() => navigate('/usuarios')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Registrar Usuario'}
          </button>
        </div>
      </form>

      {/* Modal de confirmación */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        type="success"
        title="Usuario Registrado Exitosamente"
        message="¿Deseas agregar otro usuario?"
        confirmText="SÍ"
        cancelText="NO"
        onConfirm={handleAddAnother}
        onCancel={handleGoToList}
      />
    </div>
  );
}

export default CensarUsuario;
