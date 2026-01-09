/**
 * Comprime una imagen antes de subirla al servidor
 * @param {File} file - Archivo de imagen
 * @param {number} maxWidth - Ancho máximo (default: 1920)
 * @param {number} maxHeight - Alto máximo (default: 1080)
 * @param {number} quality - Calidad de compresión 0-1 (default: 0.8)
 * @returns {Promise<Blob>} - Imagen comprimida
 */
export const compressImage = async (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Crear canvas para redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Error al comprimir imagen'));
            }
          },
          file.type || 'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
};

/**
 * Valida que el archivo sea una imagen
 * @param {File} file - Archivo a validar
 * @returns {boolean}
 */
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Convierte blob a File con nombre
 * @param {Blob} blob - Blob de imagen
 * @param {string} fileName - Nombre del archivo
 * @returns {File}
 */
export const blobToFile = (blob, fileName) => {
  return new File([blob], fileName, { type: blob.type });
};

/**
 * Obtiene tamaño de archivo en formato legible
 * @param {number} bytes - Tamaño en bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
