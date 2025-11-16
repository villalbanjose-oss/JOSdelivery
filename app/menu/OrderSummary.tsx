
'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { menuData } from '../../lib/menuData';

interface OrderSummaryProps {
  selectedCategory: string;
  onProductSelect: (product: any) => void;
  menuStyleSettings: any;
}

export default function OrderSummary({ selectedCategory, onProductSelect, menuStyleSettings }: OrderSummaryProps) {
  const [products, setProducts] = useState(menuData);
  const [scheduleSettings, setScheduleSettings] = useState({
    isEnabled: false,
    closedMessage: 'Cerrado por ahora',
    schedule: {
      monday: { enabled: false, open: '09:00', close: '22:00' },
      tuesday: { enabled: false, open: '09:00', close: '22:00' },
      wednesday: { enabled: false, open: '09:00', close: '22:00' },
      thursday: { enabled: false, open: '09:00', close: '22:00' },
      friday: { enabled: false, open: '09:00', close: '22:00' },
      saturday: { enabled: false, open: '10:00', close: '23:00' },
      sunday: { enabled: false, open: '10:00', close: '21:00' }
    }
  });
  const [businessStatus, setBusinessStatus] = useState({ isOpen: true });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Función optimizada para calcular el estado del negocio
  const calculateBusinessStatus = useCallback(() => {
    try {
      const savedScheduleSettings = localStorage.getItem('scheduleSettings');
      let currentScheduleSettings = scheduleSettings;
      
      if (savedScheduleSettings) {
        try {
          currentScheduleSettings = JSON.parse(savedScheduleSettings);
        } catch (e) {
          console.error('Error parsing scheduleSettings:', e);
          return;
        }
      }

      if (!currentScheduleSettings.isEnabled) {
        setBusinessStatus({ isOpen: true });
        return;
      }

      const now = new Date();
      const currentDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][now.getDay()];
      const currentTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
      const todaySchedule = currentScheduleSettings.schedule[currentDay as keyof typeof currentScheduleSettings.schedule];
      
      if (!todaySchedule || !todaySchedule.enabled) {
        setBusinessStatus({ isOpen: false });
        return;
      }
      
      const isOpen = currentTime >= todaySchedule.open && currentTime <= todaySchedule.close;
      setBusinessStatus({ isOpen });
    } catch (error) {
      console.error('Error calculating business status:', error);
      setBusinessStatus({ isOpen: true });
    }
  }, [scheduleSettings]);

  // Cargar datos iniciales optimizado
  useEffect(() => {
    if (isInitialized) return;

    const loadInitialData = () => {
      try {
        const savedProducts = localStorage.getItem('menuProducts');
        if (savedProducts) {
          const loadedProducts = JSON.parse(savedProducts);
          setProducts(loadedProducts);
        }

        const savedScheduleSettings = localStorage.getItem('scheduleSettings');
        if (savedScheduleSettings) {
          const parsed = JSON.parse(savedScheduleSettings);
          setScheduleSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
    calculateBusinessStatus();
    setIsInitialized(true);

    // Configurar intervalo para actualizar estado cada minuto
    intervalRef.current = setInterval(calculateBusinessStatus, 60000);

    // Escuchar cambios en los horarios
    const handleScheduleUpdate = () => {
      const savedScheduleSettings = localStorage.getItem('scheduleSettings');
      if (savedScheduleSettings) {
        try {
          const parsed = JSON.parse(savedScheduleSettings);
          setScheduleSettings(prev => ({ ...prev, ...parsed }));
          calculateBusinessStatus();
        } catch (e) {
          console.error('Error parsing updated scheduleSettings:', e);
        }
      }
    };

    window.addEventListener('scheduleUpdated', handleScheduleUpdate);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('scheduleUpdated', handleScheduleUpdate);
    };
  }, [isInitialized, calculateBusinessStatus]);

  // Función memoizada para obtener productos
  const getCurrentProducts = useMemo(() => {
    try {
      if (!products || typeof products !== 'object') {
        return [];
      }
      
      const categoryProducts = products[selectedCategory as keyof typeof products];
      
      if (!Array.isArray(categoryProducts)) {
        return [];
      }
      
      return categoryProducts.filter(product => product && typeof product === 'object');
    } catch (error) {
      console.error('Error getting current products:', error);
      return [];
    }
  }, [products, selectedCategory]);

  // Funciones memoizadas para obtener datos del producto
  const getProductName = useCallback((product: any) => {
    try {
      if (typeof product.name === 'string') {
        return product.name;
      }
      if (typeof product.name === 'object' && product.name !== null) {
        return product.name.es || product.name[Object.keys(product.name)[0]] || 'Producto';
      }
      return 'Producto';
    } catch (error) {
      console.error('Error getting product name:', error);
      return 'Producto';
    }
  }, []);

  const getProductIngredients = useCallback((product: any) => {
    try {
      if (Array.isArray(product.ingredients)) {
        return product.ingredients.filter(ingredient => typeof ingredient === 'string');
      }
      if (typeof product.ingredients === 'object' && product.ingredients !== null) {
        const ingredients = product.ingredients.es || product.ingredients[Object.keys(product.ingredients)[0]];
        return Array.isArray(ingredients) ? ingredients.filter(ingredient => typeof ingredient === 'string') : [];
      }
      return [];
    } catch (error) {
      console.error('Error getting product ingredients:', error);
      return [];
    }
  }, []);

  // Handler optimizado para hover de botones
  const handleButtonHover = useCallback((e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean, product: any) => {
    if (product.available && (!scheduleSettings.isEnabled || businessStatus.isOpen)) {
      e.currentTarget.style.backgroundColor = isEnter 
        ? menuStyleSettings.productButtonHoverColor 
        : menuStyleSettings.productButtonColor;
    }
  }, [scheduleSettings.isEnabled, businessStatus.isOpen, menuStyleSettings.productButtonHoverColor, menuStyleSettings.productButtonColor]);

  if (getCurrentProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <i 
          className="ri-restaurant-line text-6xl mb-4"
          style={{ color: menuStyleSettings.sectionDescriptionColor }}
        ></i>
        <p 
          className="text-xl"
          style={{ color: menuStyleSettings.sectionDescriptionColor }}
        >
          No hay productos disponibles en esta categoría
        </p>
      </div>
    );
  }

  return (
    <div id="products-section" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {getCurrentProducts.map((product) => {
        const productName = getProductName(product);
        const productIngredients = getProductIngredients(product);
        const isDisabled = !product.available || (scheduleSettings.isEnabled && !businessStatus.isOpen);
        
        return (
          <div 
            key={product.id} 
            className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative"
            style={{ 
              backgroundColor: menuStyleSettings.productCardBackgroundColor,
              boxShadow: `0 10px 15px -3px ${menuStyleSettings.productCardShadowColor}, 0 4px 6px -2px ${menuStyleSettings.productCardShadowColor}`
            }}
          >
            {/* Overlay cuando está cerrado */}
            {scheduleSettings.isEnabled && !businessStatus.isOpen && (
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-2xl">
                <div className="text-center text-white p-4">
                  <i className="ri-time-line text-4xl mb-2"></i>
                  <p className="font-semibold text-lg">{scheduleSettings.closedMessage}</p>
                  <p className="text-sm opacity-90">No se pueden realizar pedidos</p>
                </div>
              </div>
            )}

            <img 
              src={product.image || `https://readdy.ai/api/search-image?query=delicious%20$%7BencodeURIComponent%28productName%29%7D%20food%20item%20on%20white%20background%2C%20minimalist%20style%2C%20high%20quality%20product%20photography&width=400&height=300&seq=product-${product.id}&orientation=landscape`}
              alt={productName}
              className="w-full h-48 object-cover object-top"
              loading="lazy"
            />
            
            <div className="p-6">
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: menuStyleSettings.productTitleColor }}
              >
                {productName}
              </h3>
              <p 
                className="mb-3 text-sm"
                style={{ color: menuStyleSettings.productDescriptionColor }}
              >
                {productIngredients.join(', ')}
              </p>
              
              <div className="flex justify-between items-center mb-4">
                <span 
                  className="text-2xl font-bold"
                  style={{ color: menuStyleSettings.productPriceColor }}
                >
                  {(product.price || 0).toFixed(2)} zł
                </span>
                
                {!product.available && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Agotado
                  </span>
                )}
              </div>
              
              <button
                onClick={() => onProductSelect(product)}
                disabled={isDisabled}
                className="w-full py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: !isDisabled ? menuStyleSettings.productButtonColor : '#D1D5DB',
                  color: !isDisabled ? menuStyleSettings.productButtonTextColor : '#6B7280',
                  cursor: !isDisabled ? 'pointer' : 'not-allowed'
                }}
                onMouseEnter={(e) => handleButtonHover(e, true, product)}
                onMouseLeave={(e) => handleButtonHover(e, false, product)}
              >
                {!product.available 
                  ? 'Agotado' 
                  : (scheduleSettings.isEnabled && !businessStatus.isOpen)
                    ? 'Cerrado'
                    : 'Agregar al Carrito'
                }
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
