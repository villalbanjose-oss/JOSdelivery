
'use client';
import { useState, useRef } from 'react';
import { imageStorage, formatFileSize, isValidImageType, compressImage, StoredImage } from '../lib/imageStorage';

interface ImageUploaderProps {
  category: string;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string, imageId: string) => void;
  onImageDeleted?: () => void;
  maxWidth?: number;
  maxHeight?: number;
  showPreview?: boolean;
  allowDelete?: boolean;
  label?: string;
  className?: string;
}

export default function ImageUploader({
  category,
  currentImageUrl,
  onImageUploaded,
  onImageDeleted,
  maxWidth = 400,
  maxHeight = 300,
  showPreview = true,
  allowDelete = true,
  label = 'Subir Imagen',
  className = ''
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) {
      console.log('No se seleccionó archivo');
      return;
    }

    console.log('=== INICIO CARGA DE IMAGEN ===');
    console.log('Archivo:', file.name, file.type, formatFileSize(file.size));
    
    setError(null);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Validación mejorada
      if (!isValidImageType(file)) {
        throw new Error('Formato no válido. Use JPG, PNG, GIF o WebP.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Archivo muy grande. Máximo 5MB.');
      }

      console.log('Validaciones pasadas');
      setUploadProgress(30);

      // Procesar imagen
      let processedFile = file;
      if (file.size > 300 * 1024) { // Comprimir si es mayor a 300KB
        console.log('Comprimiendo imagen...');
        setUploadProgress(50);
        processedFile = await compressImage(file, maxWidth, maxHeight, 0.85);
        console.log('Imagen comprimida:', formatFileSize(processedFile.size));
      }

      setUploadProgress(70);

      // Subir imagen
      console.log('Subiendo imagen...');
      const storedImage: StoredImage = await imageStorage.uploadImage(processedFile, category);
      
      console.log('Imagen subida exitosamente:', storedImage.id);
      setUploadProgress(100);

      // Callback con URL
      onImageUploaded(storedImage.url, storedImage.id);

      // Resetear después de éxito
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        console.log('=== CARGA COMPLETADA ===');
      }, 1000);

    } catch (err) {
      console.error('ERROR en carga:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir imagen';
      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files?.[0];
    console.log('Archivo seleccionado desde input:', file?.name);
    
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDeleteImage = () => {
    console.log('Eliminando imagen');
    if (onImageDeleted) {
      onImageDeleted();
    }
    setError(null);
  };

  const triggerFileInput = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Activando selector de archivos');
    
    if (isUploading) {
      console.log('Carga en progreso, ignorando clic');
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Drag and drop handlers mejorados
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUploading) return;
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (isUploading) return;
    
    const files = e.dataTransfer.files;
    console.log('Archivos arrastrados:', files.length);
    
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview de imagen actual */}
      {showPreview && currentImageUrl && (
        <div className="relative inline-block">
          <img
            src={currentImageUrl}
            alt="Vista previa"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm object-top"
            style={{ maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://readdy.ai/api/search-image?query=placeholder%20image%20gray%20background%20simple%20clean%20design&width=400&height=300&seq=placeholder&orientation=landscape';
            }}
          />
          {allowDelete && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-lg"
              title="Eliminar imagen"
            >
              <i className="ri-close-line text-sm"></i>
            </button>
          )}
        </div>
      )}

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Área de drag and drop clickeable */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div className="space-y-4">
          <div className="w-12 h-12 mx-auto text-gray-400 flex items-center justify-center">
            <i className="ri-image-add-line text-4xl"></i>
          </div>
          
          <div>
            <p className="text-gray-600 mb-2">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                isUploading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {isUploading ? (
                <>
                  <i className="ri-loader-4-line mr-2 animate-spin"></i>
                  Subiendo... {uploadProgress}%
                </>
              ) : (
                <>
                  <i className="ri-upload-2-line mr-2"></i>
                  {currentImageUrl ? 'Cambiar Imagen' : label}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          <i className="ri-error-warning-line mr-2 flex-shrink-0"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium mb-1">Formatos:</p>
            <p>JPG, PNG, GIF, WebP</p>
          </div>
          <div className="text-right">
            <p className="font-medium mb-1">Tamaño máximo:</p>
            <p>5MB</p>
          </div>
        </div>
        {maxWidth && maxHeight && (
          <p className="mt-2 text-center">
            <span className="font-medium">Recomendado:</span> {maxWidth}x{maxHeight}px
          </p>
        )}
      </div>
    </div>
  );
}
