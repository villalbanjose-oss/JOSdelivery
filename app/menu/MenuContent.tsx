
'use client';
import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MenuCategories from './MenuCategories';
import ProductCustomization from './ProductCustomization';
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';
import { getScheduleStatus } from '../../lib/scheduleUtils';
import { menuData } from '../../lib/menuData';

interface MenuContentProps {
  cartItems: any[];
  onAddToCart: (item: any) => void;
  onRemoveFromCart: (itemId: number) => void;
  onUpdateCartItem: (itemId: number, updates: any) => void;
  showCart: boolean;
  onShowCart: (show: boolean) => void;
  onClearCart: () => void;
}

function MenuContentInner({ 
  cartItems, 
  onAddToCart, 
  onRemoveFromCart, 
  onUpdateCartItem, 
  showCart, 
  onShowCart, 
  onClearCart 
}: MenuContentProps) {
  const [selectedCategory, setSelectedCategory] = useState('hamburguesas');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados optimizados con valores por defecto
  const [businessSettings, setBusinessSettings] = useState({
    schedule: 'Sábados y Domingos de 7pm a 10pm'
  });
  
  const [scheduleSettings, setScheduleSettings] = useState({
    closedMessage: 'Cerrado por ahora',
    enableScheduleControl: true
  });
  
  const [menuStyleSettings, setMenuStyleSettings] = useState({
    backgroundColor: '#FEF3E2',
    gradientFrom: '#FEF3E2',
    gradientTo: '#FEE2E2',
    useGradient: true,
    categoryButtonActiveColor: '#F97316',
    categoryButtonActiveTextColor: '#FFFFFF',
    categoryButtonInactiveColor: '#FFFFFF',
    categoryButtonInactiveTextColor: '#374151',
    categoryButtonHoverColor: '#FED7AA',
    productCardBackgroundColor: '#FFFFFF',
    productCardShadowColor: '#00000020',
    productButtonColor: '#F97316',
    productButtonTextColor: '#FFFFFF',
    productButtonHoverColor: '#EA580C',
    productPriceColor: '#EA580C',
    productTitleColor: '#1F2937',
    productDescriptionColor: '#6B7280',
    sectionTitleColor: '#1F2937',
    sectionDescriptionColor: '#6B7280'
  });

  const searchParams = useSearchParams();

  // Función optimizada para cargar configuraciones
  const loadSettings = useCallback(() => {
    if (!isMounted) return;

    try {
      const savedBusinessSettings = localStorage.getItem('businessSettings');
      if (savedBusinessSettings) {
        const parsed = JSON.parse(savedBusinessSettings);
        setBusinessSettings(prev => ({
          ...prev,
          ...parsed,
          schedule: parsed.schedule || 'Sábados y Domingos de 7pm a 10pm'
        }));
      }

      const savedScheduleSettings = localStorage.getItem('scheduleSettings');
      if (savedScheduleSettings) {
        const parsed = JSON.parse(savedScheduleSettings);
        setScheduleSettings(prev => ({
          ...prev,
          ...parsed,
          closedMessage: parsed.closedMessage || 'Cerrado por ahora',
          enableScheduleControl: parsed.enableScheduleControl !== undefined ? parsed.enableScheduleControl : true
        }));
      }

      const savedMenuStyleSettings = localStorage.getItem('menuStyleSettings');
      if (savedMenuStyleSettings) {
        const parsed = JSON.parse(savedMenuStyleSettings);
        setMenuStyleSettings(prev => ({
          ...prev,
          ...parsed
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [isMounted]);

  // Efecto de montaje optimizado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar configuraciones solo cuando esté montado
  useEffect(() => {
    if (isMounted) {
      loadSettings();
    }
  }, [isMounted, loadSettings]);

  // Listener de eventos optimizado
  useEffect(() => {
    if (!isMounted) return;

    const handleSettingsUpdate = () => {
      loadSettings();
    };

    window.addEventListener('bannerSettingsUpdated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('bannerSettingsUpdated', handleSettingsUpdate);
    };
  }, [isMounted, loadSettings]);

  // Detectar parámetro checkout optimizado
  useEffect(() => {
    const checkoutParam = searchParams.get('checkout');
    if (checkoutParam === 'true') {
      setShowCheckout(true);
    }
  }, [searchParams]);

  // Efecto del carrito optimizado
  useEffect(() => {
    if (showCart) {
      setShowCheckout(true);
      onShowCart(false);
    }
  }, [showCart, onShowCart]);

  // Calcular estado del horario memoizado
  const scheduleStatus = useMemo(() => {
    if (!isMounted || !scheduleSettings.enableScheduleControl || !businessSettings.schedule) {
      return { isOpen: true };
    }
    return getScheduleStatus(businessSettings.schedule, scheduleSettings.closedMessage);
  }, [isMounted, scheduleSettings.enableScheduleControl, businessSettings.schedule, scheduleSettings.closedMessage]);
  
  const isBusinessOpen = scheduleStatus.isOpen;

  // Función memoizada para calcular precio total
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }, [cartItems]);

  // Handler optimizado para selección de productos
  const handleProductClick = useCallback((product: any) => {
    const productWithCategory = {
      ...product,
      category: product.category || selectedCategory,
      categoryKey: selectedCategory
    };
    
    if (product.customizable) {
      setSelectedProduct(productWithCategory);
    } else {
      onAddToCart({ 
        ...productWithCategory, 
        quantity: 1, 
        totalPrice: product.price
      });
    }
  }, [selectedCategory, onAddToCart]);

  // Estilo de fondo memoizado
  const backgroundStyle = useMemo(() => ({
    background: menuStyleSettings.useGradient 
      ? `linear-gradient(to bottom right, ${menuStyleSettings.gradientFrom}, ${menuStyleSettings.gradientTo})`
      : menuStyleSettings.backgroundColor
  }), [menuStyleSettings.useGradient, menuStyleSettings.gradientFrom, menuStyleSettings.gradientTo, menuStyleSettings.backgroundColor]);

  // Renderizado condicional optimizado
  if (showCheckout) {
    return (
      <CheckoutForm 
        cart={cartItems}
        totalPrice={getTotalPrice()}
        onBack={() => setShowCheckout(false)}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateCartItem={onUpdateCartItem}
        onClearCart={onClearCart}
      />
    );
  }

  // Loading optimizado
  if (!isMounted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={backgroundStyle}
        suppressHydrationWarning={true}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen" 
      style={backgroundStyle}
      suppressHydrationWarning={true}
    >
      <div className="container mx-auto px-4 py-8">
        {scheduleSettings.enableScheduleControl && !isBusinessOpen && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg">
            <div className="flex items-center">
              <i className="ri-information-line mr-3 text-xl"></i>
              <div>
                <div className="font-semibold">No se pueden realizar pedidos en este momento</div>
                <div className="text-sm mt-1">Puedes ver el menú, pero los pedidos están deshabilitados fuera del horario de atención.</div>
              </div>
            </div>
          </div>
        )}

        <MenuCategories 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          menuStyleSettings={menuStyleSettings}
        />

        <OrderSummary 
          selectedCategory={selectedCategory}
          onProductSelect={handleProductClick}
          menuStyleSettings={menuStyleSettings}
        />
      </div>

      {selectedProduct && (
        <ProductCustomization
          product={selectedProduct}
          categoryKey={selectedProduct.categoryKey}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
}

export default function MenuContent(props: MenuContentProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center" suppressHydrationWarning={true}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    }>
      <MenuContentInner {...props} />
    </Suspense>
  );
}
