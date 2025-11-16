
export interface StoredImage {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: string;
  category: string;
  compressed?: boolean;
  originalSize?: number;
  dimensions?: { width: number; height: number };
}

class ImageStorageManager {
  private storageKey = 'storedImages';
  private maxSize = 5 * 1024 * 1024; // 5MB por imagen
  private compressionQuality = 0.88;
  private maxWidth = 400;
  private maxHeight = 300;
  private compressionThreshold = 300 * 1024; // Comprimir si es mayor a 300KB

  async uploadImage(file: File, category: string = 'general'): Promise<StoredImage> {
    console.log('=== INICIO UPLOAD IMAGE ===');
    console.log('Archivo:', file.name, file.type, file.size);
    
    return new Promise((resolve, reject) => {
      if (file.size > this.maxSize) {
        reject(new Error('Archivo muy grande. Máximo 5MB.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64String = event.target?.result as string;
          console.log('Archivo leído como base64, tamaño:', base64String.length);
          
          const imageId = this.generateImageId();
          console.log('ID generado:', imageId);

          // Optimizar imagen
          const optimizedResult = await this.optimizeImage(base64String, file.type, file.name);
          console.log('Imagen optimizada:', optimizedResult.wasCompressed);

          const storedImage: StoredImage = {
            id: imageId,
            name: file.name,
            url: optimizedResult.base64,
            type: file.type,
            size: this.calculateBase64Size(optimizedResult.base64),
            uploadDate: new Date().toISOString(),
            category: category,
            compressed: optimizedResult.wasCompressed,
            originalSize: file.size,
            dimensions: optimizedResult.dimensions
          };

          console.log('Imagen preparada para guardar:', storedImage.id, storedImage.size);
          this.saveImageToStorage(storedImage);
          console.log('Imagen guardada exitosamente');
          resolve(storedImage);
          
        } catch (error) {
          console.error('Error en uploadImage:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        console.error('Error leyendo archivo');
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsDataURL(file);
    });
  }

  private optimizeImage(base64String: string, mimeType: string, fileName: string): Promise<{
    base64: string;
    wasCompressed: boolean;
    dimensions: { width: number; height: number };
  }> {
    console.log('Optimizando imagen...');
    
    return new Promise((resolve, reject) => {
      // Verificar si estamos en el navegador
      if (typeof window === 'undefined') {
        console.log('No está en navegador, usando imagen original');
        resolve({
          base64: base64String,
          wasCompressed: false,
          dimensions: { width: 400, height: 300 }
        });
        return;
      }

      const img = document.createElement('img');
      img.onload = () => {
        try {
          console.log('Imagen cargada:', img.width, 'x', img.height);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            console.log('No se pudo crear contexto canvas, usando original');
            resolve({
              base64: base64String,
              wasCompressed: false,
              dimensions: { width: img.width, height: img.height }
            });
            return;
          }

          // Calcular dimensiones optimizadas
          const { width, height, needsResize } = this.calculateOptimalDimensions(img.width, img.height);
          console.log('Nuevas dimensiones:', width, 'x', height, 'necesita redimensionar:', needsResize);

          canvas.width = width;
          canvas.height = height;

          // Configurar renderizado de alta calidad
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Dibujar imagen
          ctx.drawImage(img, 0, 0, width, height);

          // Determinar si necesita compresión
          const originalSize = this.calculateBase64Size(base64String);
          const shouldCompress = originalSize > this.compressionThreshold || needsResize;
          
          console.log('Tamaño original:', originalSize, 'necesita compresión:', shouldCompress);

          if (shouldCompress) {
            const quality = this.getOptimalQuality(mimeType, originalSize);
            console.log('Calidad de compresión:', quality);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const compressedBase64 = reader.result as string;
                    console.log('Compresión completada, nuevo tamaño:', this.calculateBase64Size(compressedBase64));
                    resolve({
                      base64: compressedBase64,
                      wasCompressed: true,
                      dimensions: { width, height }
                    });
                  };
                  reader.onerror = () => {
                    console.log('Error convirtiendo blob, usando original');
                    resolve({
                      base64: base64String,
                      wasCompressed: false,
                      dimensions: { width: img.width, height: img.height }
                    });
                  };
                  reader.readAsDataURL(blob);
                } else {
                  console.log('Error creando blob, usando original');
                  resolve({
                    base64: base64String,
                    wasCompressed: false,
                    dimensions: { width: img.width, height: img.height }
                  });
                }
              },
              mimeType,
              quality
            );
          } else {
            console.log('No necesita compresión, usando original');
            resolve({
              base64: base64String,
              wasCompressed: false,
              dimensions: { width: img.width, height: img.height }
            });
          }
        } catch (error) {
          console.error('Error en optimización:', error);
          resolve({
            base64: base64String,
            wasCompressed: false,
            dimensions: { width: 400, height: 300 }
          });
        }
      };

      img.onerror = () => {
        console.error('Error cargando imagen para optimización');
        resolve({
          base64: base64String,
          wasCompressed: false,
          dimensions: { width: 400, height: 300 }
        });
      };
      
      img.src = base64String;
    });
  }

  private calculateOptimalDimensions(originalWidth: number, originalHeight: number): { 
    width: number; 
    height: number; 
    needsResize: boolean;
  } {
    if (originalWidth <= this.maxWidth && originalHeight <= this.maxHeight) {
      return { 
        width: originalWidth, 
        height: originalHeight, 
        needsResize: false 
      };
    }

    const aspectRatio = originalWidth / originalHeight;
    let newWidth: number;
    let newHeight: number;

    if (originalWidth > originalHeight) {
      newWidth = Math.min(originalWidth, this.maxWidth);
      newHeight = Math.round(newWidth / aspectRatio);

      if (newHeight > this.maxHeight) {
        newHeight = this.maxHeight;
        newWidth = Math.round(newHeight * aspectRatio);
      }
    } else {
      newHeight = Math.min(originalHeight, this.maxHeight);
      newWidth = Math.round(newHeight * aspectRatio);

      if (newWidth > this.maxWidth) {
        newWidth = this.maxWidth;
        newHeight = Math.round(newWidth / aspectRatio);
      }
    }

    return { 
      width: newWidth, 
      height: newHeight, 
      needsResize: true 
    };
  }

  private getOptimalQuality(mimeType: string, originalSize: number): number {
    let baseQuality = this.compressionQuality;

    switch (mimeType.toLowerCase()) {
      case 'image/jpeg':
      case 'image/jpg':
        baseQuality = 0.85;
        break;
      case 'image/png':
        baseQuality = 0.90;
        break;
      case 'image/webp':
        baseQuality = 0.82;
        break;
      default:
        baseQuality = 0.88;
    }

    if (originalSize > 2 * 1024 * 1024) {
      baseQuality -= 0.05;
    } else if (originalSize > 1 * 1024 * 1024) {
      baseQuality -= 0.02;
    }

    return Math.max(0.70, Math.min(0.95, baseQuality));
  }

  private calculateBase64Size(base64String: string): number {
    const base64Data = base64String.split(',')[1] || base64String;
    return Math.round((base64Data.length * 3) / 4);
  }

  private saveImageToStorage(image: StoredImage): void {
    console.log('Guardando imagen en localStorage...');
    
    try {
      const existingImages = this.getAllImages();
      console.log('Imágenes existentes:', existingImages.length);

      const totalSize = this.calculateTotalStorageSize(existingImages) + image.size;
      const maxStorageSize = 50 * 1024 * 1024; // 50MB límite

      if (totalSize > maxStorageSize) {
        console.log('Limpiando imágenes antiguas...');
        this.cleanOldImages(7);
      }

      const updatedImages = [...existingImages, image];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedImages));
      console.log('Imagen guardada en localStorage');
      
    } catch (error) {
      console.error('Error guardando en localStorage:', error);

      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.log('Cuota excedida, limpiando espacio...');
        this.cleanOldImages(3);
        try {
          const existingImages = this.getAllImages();
          const updatedImages = [...existingImages, image];
          localStorage.setItem(this.storageKey, JSON.stringify(updatedImages));
          console.log('Imagen guardada después de limpiar');
        } catch (retryError) {
          throw new Error('Espacio insuficiente. Elimine algunas imágenes.');
        }
      } else {
        throw new Error('Error guardando imagen');
      }
    }
  }

  private calculateTotalStorageSize(images: StoredImage[]): number {
    return images.reduce((total, img) => total + img.size, 0);
  }

  getAllImages(): StoredImage[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const images = JSON.parse(stored);

      if (!Array.isArray(images)) {
        console.warn('Datos corruptos, reiniciando');
        localStorage.removeItem(this.storageKey);
        return [];
      }

      return images.filter(img => img && img.id && img.url);
    } catch (error) {
      console.error('Error cargando imágenes:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.storageKey);
      }
      return [];
    }
  }

  getImagesByCategory(category: string): StoredImage[] {
    return this.getAllImages().filter(img => img.category === category);
  }

  getImageById(id: string): StoredImage | null {
    const images = this.getAllImages();
    return images.find(img => img.id === id) || null;
  }

  deleteImage(id: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const images = this.getAllImages();
      const filteredImages = images.filter(img => img.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredImages));
      return true;
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      return false;
    }
  }

  updateImage(id: string, updates: Partial<StoredImage>): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const images = this.getAllImages();
      const imageIndex = images.findIndex(img => img.id === id);

      if (imageIndex === -1) return false;

      images[imageIndex] = { ...images[imageIndex], ...updates };
      localStorage.setItem(this.storageKey, JSON.stringify(images));
      return true;
    } catch (error) {
      console.error('Error actualizando imagen:', error);
      return false;
    }
  }

  private generateImageId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  cleanOldImages(daysOld: number = 30): number {
    try {
      if (typeof window === 'undefined') return 0;
      
      const images = this.getAllImages();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const recentImages = images.filter(img => 
        new Date(img.uploadDate) > cutoffDate
      );

      const deletedCount = images.length - recentImages.length;
      localStorage.setItem(this.storageKey, JSON.stringify(recentImages));

      console.log(`Limpiadas ${deletedCount} imágenes antiguas`);
      return deletedCount;
    } catch (error) {
      console.error('Error limpiando imágenes:', error);
      return 0;
    }
  }

  getStorageStats(): { 
    totalImages: number; 
    totalSize: number; 
    totalSizeMB: number;
    categories: string[];
    compressionSavings: number;
    compressionSavingsMB: number;
    averageCompressionRatio: number;
  } {
    const images = this.getAllImages();
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    const totalOriginalSize = images.reduce((sum, img) => sum + (img.originalSize || img.size), 0);
    const categories = [...new Set(images.map(img => img.category))];
    const compressionSavings = totalOriginalSize - totalSize;
    const compressionRatio = totalOriginalSize > 0 ? (compressionSavings / totalOriginalSize) * 100 : 0;

    return {
      totalImages: images.length,
      totalSize,
      totalSizeMB: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
      categories,
      compressionSavings,
      compressionSavingsMB: Math.round((compressionSavings / (1024 * 1024)) * 100) / 100,
      averageCompressionRatio: Math.round(compressionRatio * 100) / 100
    };
  }

  async reoptimizeImage(imageId: string): Promise<boolean> {
    try {
      const image = this.getImageById(imageId);
      if (!image) return false;

      const optimizedResult = await this.optimizeImage(image.url, image.type, image.name);

      const updatedImage: Partial<StoredImage> = {
        url: optimizedResult.base64,
        size: this.calculateBase64Size(optimizedResult.base64),
        compressed: optimizedResult.wasCompressed,
        dimensions: optimizedResult.dimensions
      };

      return this.updateImage(imageId, updatedImage);
    } catch (error) {
      console.error('Error re-optimizando:', error);
      return false;
    }
  }

  exportImages(): string {
    const images = this.getAllImages();
    return JSON.stringify(images, null, 2);
  }

  importImages(jsonData: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const images = JSON.parse(jsonData);
      if (Array.isArray(images)) {
        localStorage.setItem(this.storageKey, JSON.stringify(images));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importando:', error);
      return false;
    }
  }
}

export const imageStorage = new ImageStorageManager();

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidImageType = (file: File): boolean => {
  const validTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/gif', 
    'image/webp'
  ];
  return validTypes.includes(file.type.toLowerCase());
};

export const compressImage = (
  file: File, 
  maxWidth: number = 400, 
  maxHeight: number = 300, 
  quality: number = 0.85
): Promise<File> => {
  console.log('Comprimiendo imagen externa...');
  
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img');

    img.onload = () => {
      try {
        const aspectRatio = img.width / img.height;
        let newWidth = img.width;
        let newHeight = img.height;

        if (img.width > maxWidth || img.height > maxHeight) {
          if (img.width > img.height) {
            newWidth = maxWidth;
            newHeight = Math.round(maxWidth / aspectRatio);

            if (newHeight > maxHeight) {
              newHeight = maxHeight;
              newWidth = Math.round(maxHeight * aspectRatio);
            }
          } else {
            newHeight = maxHeight;
            newWidth = Math.round(maxHeight * aspectRatio);

            if (newWidth > maxWidth) {
              newWidth = maxWidth;
              newHeight = Math.round(maxWidth / aspectRatio);
            }
          }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
        }

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            console.log('Compresión externa completada');
            resolve(compressedFile);
          } else {
            console.log('Error en compresión, usando original');
            resolve(file);
          }
        }, file.type, quality);
      } catch (error) {
        console.error('Error en compresión:', error);
        resolve(file);
      }
    };

    img.onerror = () => {
      console.error('Error cargando imagen para compresión');
      resolve(file);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const pathname = urlObj.pathname.toLowerCase();
    return validExtensions.some(ext => pathname.endsWith(ext)) || url.startsWith('data:image/');
  } catch {
    return url.startsWith('data:image/');
  }
};

export const createPlaceholderImage = (width: number, height: number, text: string = 'Imagen'): string => {
  if (typeof window === 'undefined') {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbjwvdGV4dD48L3N2Zz4=';
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxWidth = Math.min(width, 400);
  const maxHeight = Math.min(height, 300);

  canvas.width = maxWidth;
  canvas.height = maxHeight;

  if (ctx) {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, maxWidth, maxHeight);

    ctx.fillStyle = '#9ca3af';
    ctx.font = `${Math.min(maxWidth, maxHeight) / 8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, maxWidth / 2, maxHeight / 2);
  }

  return canvas.toDataURL('image/png', 0.8);
};

export const batchOptimizeImages = async (imageIds: string[]): Promise<{
  success: number;
  failed: number;
  totalSavings: number;
}> => {
  let success = 0;
  let failed = 0;
  let totalSavings = 0;

  for (const imageId of imageIds) {
    try {
      const originalImage = imageStorage.getImageById(imageId);
      if (originalImage) {
        const originalSize = originalImage.size;
        const optimized = await imageStorage.reoptimizeImage(imageId);

        if (optimized) {
          const newImage = imageStorage.getImageById(imageId);
          if (newImage) {
            totalSavings += originalSize - newImage.size;
          }
          success++;
        } else {
          failed++;
        }
      }
    } catch (error) {
      console.error(`Error optimizando ${imageId}:`, error);
      failed++;
    }
  }

  return { success, failed, totalSavings };
};
