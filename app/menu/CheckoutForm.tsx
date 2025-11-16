'use client';
import { useState, useEffect } from 'react';

interface CheckoutFormProps {
  cart: any[];
  totalPrice: number;
  onBack: () => void;
  onRemoveFromCart?: (cartId: number) => void;
  onUpdateCartItem?: (cartId: number, updates: any) => void;
  onClearCart?: () => void;
}

export default function CheckoutForm({ 
  cart, 
  totalPrice, 
  onBack,
  onRemoveFromCart,
  onUpdateCartItem,
  onClearCart
}: CheckoutFormProps) {
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryNotes: '',
    paymentMethod: 'cash',
    confirmationChannel: 'whatsapp'
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkoutSettings, setCheckoutSettings] = useState({
    deliveryFee: 7,
    deliveryOutsideMessage: 'Entregas fuera de Sosnowiec 14zl',
    deliveryTypes: {
      delivery: { enabled: true, label: 'Domicilio' },
      pickup: { enabled: true, label: 'Recoger en Punto' }
    },
    paymentMethods: {
      cash: { enabled: true, label: 'Efectivo' },
      blik: { enabled: true, label: 'Blik' },
      card: { enabled: true, label: 'Tarjeta' }
    },
    confirmationChannels: {
      whatsapp: { enabled: true, label: 'WhatsApp' },
      viber: { enabled: true, label: 'Viber' },
      telegram: { enabled: true, label: 'Telegram' }
    },
    formLabels: {
      name: 'Nombre completo',
      phone: 'Teléfono',
      email: 'Email',
      address: 'Dirección',
      city: 'Ciudad',
      postalCode: 'Código Postal',
      deliveryNotes: 'Notas de entrega',
      selectOnMap: 'Seleccionar en Google Maps',
      paymentMethod: 'Método de Pago',
      confirmationChannel: 'Confirmar pedido por',
      deliveryType: 'Tipo de Entrega'
    },
    showCustomizations: true,
    showComments: true,
    foodTaxRate: 0.08,
    drinkTaxRate: 0.23
  });

  useEffect(() => {
    const savedCheckoutSettings = localStorage.getItem('checkoutSettings');
    if (savedCheckoutSettings) {
      try {
        const parsed = JSON.parse(savedCheckoutSettings);
        setCheckoutSettings(prev => ({
          ...prev,
          ...parsed,
          deliveryTypes: {
            delivery: { enabled: true, label: 'Domicilio' },
            pickup: { enabled: true, label: 'Recoger en Punto' },
            ...(parsed.deliveryTypes || {})
          },
          paymentMethods: {
            cash: { enabled: true, label: 'Efectivo' },
            blik: { enabled: true, label: 'Blik' },
            card: { enabled: true, label: 'Tarjeta' },
            ...(parsed.paymentMethods || {})
          },
          confirmationChannels: {
            whatsapp: { enabled: true, label: 'WhatsApp' },
            viber: { enabled: true, label: 'Viber' },
            telegram: { enabled: true, label: 'Telegram' },
            ...(parsed.confirmationChannels || {})
          },
          formLabels: {
            name: 'Nombre completo',
            phone: 'Teléfono',
            email: 'Email',
            address: 'Dirección',
            city: 'Ciudad',
            postalCode: 'Código Postal',
            deliveryNotes: 'Notas de entrega',
            selectOnMap: 'Seleccionar en Google Maps',
            paymentMethod: 'Método de Pago',
            confirmationChannel: 'Confirmar pedido por',
            deliveryType: 'Tipo de Entrega',
            ...(parsed.formLabels || {})
          }
        }));
      } catch (e) {
        console.error('Error parsing checkoutSettings:', e);
      }
    }
  }, []);

  // Función CORREGIDA para calcular el precio real de los ingredientes extras
  const calculateExtraIngredientsPrice = (customizations: string[]) => {
    let total = 0;
    if (customizations && customizations.length > 0) {
      customizations.forEach((customization) => {
        if (customization.startsWith('add-')) {
          // Extraer el precio real del final del string de personalización
          const parts = customization.split('-');
          if (parts.length >= 3) {
            const priceStr = parts[parts.length - 1];
            const price = parseFloat(priceStr);
            if (!isNaN(price) && price > 0) {
              total += price;
            }
          }
        }
      });
    }
    return total;
  };

  // Calcular totales detallados - CORREGIDO para usar precios reales
  const calculateDetailedTotals = () => {
    let subtotal = 0;
    let customizationsTotal = 0;
    let foodTax = 0;
    let drinkTax = 0;

    cart.forEach(item => {
      const basePrice = item.price * (item.quantity || 1);
      subtotal += basePrice;

      // Calcular adicionales/personalizaciones usando precios reales CORREGIDOS
      const extrasPrice = calculateExtraIngredientsPrice(item.customizations || []);
      customizationsTotal += extrasPrice * (item.quantity || 1);

      // Agregar precio del combo si existe
      if (item.selectedCombo && item.selectedCombo.price) {
        customizationsTotal += item.selectedCombo.price * (item.quantity || 1);
      }

      // Calcular impuestos según categoría
      const totalItemPrice = basePrice + (extrasPrice * (item.quantity || 1)) + ((item.selectedCombo?.price || 0) * (item.quantity || 1));
      if (item.category === 'bebidas') {
        drinkTax += totalItemPrice * checkoutSettings.drinkTaxRate;
      } else {
        foodTax += totalItemPrice * checkoutSettings.foodTaxRate;
      }
    });

    const deliveryFee = deliveryType === 'delivery' ? checkoutSettings.deliveryFee : 0;
    const totalTaxes = foodTax + drinkTax;
    const finalTotal = subtotal + customizationsTotal + totalTaxes + deliveryFee;

    return {
      subtotal,
      customizationsTotal,
      foodTax,
      drinkTax,
      totalTaxes,
      deliveryFee,
      finalTotal
    };
  };

  const totals = calculateDetailedTotals();

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Función CORREGIDA para guardar el pedido - usando precios reales
  const saveOrder = (orderData: any) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        ...orderData,
        cart: cart.map(item => {
          const extrasPrice = calculateExtraIngredientsPrice(item.customizations || []);
          const comboPrice = item.selectedCombo?.price || 0;
          const totalItemPrice = (item.price + extrasPrice + comboPrice) * (item.quantity || 1);
          
          return {
            ...item,
            customizations: item.customizations || [],
            comments: item.comments || '',
            extrasPrice: extrasPrice,
            comboPrice: comboPrice,
            totalPrice: totalItemPrice
          };
        }),
        totalPrice: totals.finalTotal
      };
      
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return true;
    } catch (error) {
      console.error('Error saving order:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }
    
    if (!validatePhone(customerInfo.phone)) {
      alert('Por favor ingrese un número de teléfono válido');
      return;
    }

    setIsSubmitting(true);

    const orderSaved = saveOrder({
      firstName: customerInfo.name.split(' ')[0] || customerInfo.name,
      lastName: customerInfo.name.split(' ').slice(1).join(' ') || '',
      phone: customerInfo.phone,
      email: customerInfo.email,
      address: customerInfo.address,
      city: customerInfo.city,
      postalCode: customerInfo.postalCode,
      deliveryNotes: customerInfo.deliveryNotes,
      deliveryType: deliveryType,
      paymentMethod: customerInfo.paymentMethod,
      confirmationChannel: customerInfo.confirmationChannel
    });

    if (orderSaved) {
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        onClearCart?.();
        try {
          localStorage.removeItem('cartItems');
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
        setShowSuccessMessage(false);
        setIsSubmitting(false);
        
        // Usar onBack en lugar de window.location.href para evitar error 404
        onBack();
      }, 3000);
    } else {
      alert('Error al guardar el pedido. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const updateQuantity = (cartId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveFromCart?.(cartId);
    } else {
      onUpdateCartItem?.(cartId, { quantity: newQuantity });
    }
  };

  const openGoogleMaps = () => {
    const address = `${customerInfo.address}, ${customerInfo.city}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  // Función simplificada para obtener el nombre del producto
  const getProductName = (item: any) => {
    try {
      if (typeof item.name === 'string') {
        return item.name;
      }
      if (typeof item.name === 'object' && item.name !== null) {
        return item.name.es || item.name[Object.keys(item.name)[0]] || 'Producto';
      }
      return 'Producto';
    } catch (error) {
      console.error('Error getting product name:', error);
      return 'Producto';
    }
  };

  // Función CORREGIDA para obtener el precio y nombre de un ingrediente extra
  const getExtraIngredientDetails = (customization: string) => {
    if (customization.startsWith('add-')) {
      const parts = customization.split('-');
      if (parts.length >= 3) {
        const priceStr = parts[parts.length - 1];
        const price = parseFloat(priceStr);
        const name = parts.slice(1, -1).join('-');
        return { 
          name: name || 'Ingrediente', 
          price: !isNaN(price) && price > 0 ? price : 0 
        };
      }
    }
    return { 
      name: customization.replace('add-', '').replace(/\-[\d\.]+$/, ''), 
      price: 0 
    };
  };

  // Mensaje de éxito
  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Perfecto! Tu orden fue recibida con éxito</h2>
          <div className="w-full bg-green-200 rounded-full h-2 mb-4">
            <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <i className="ri-shopping-cart-line text-6xl text-gray-400 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
          <button
            onClick={onBack}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Volver al Menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-4 px-4">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-white/50 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-2xl text-gray-700"></i>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Resumen del Pedido</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumen del pedido mejorado */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 md:space-y-6 mb-4 md:mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => {
                  const extrasPrice = calculateExtraIngredientsPrice(item.customizations || []);
                  const comboPrice = item.selectedCombo?.price || 0;
                  const itemSubtotal = (item.price + extrasPrice + comboPrice) * (item.quantity || 1);
                  
                  return (
                    <div key={item.cartId} className="border-b pb-4 md:pb-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-2">
                          <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                            {getProductName(item)}
                          </h3>
                          <p className="text-gray-600 text-xs md:text-sm">{item.price} zł c/u</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className="flex items-center space-x-1 md:space-x-2">
                            <button
                              onClick={() => updateQuantity(item.cartId, (item.quantity || 1) - 1)}
                              className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                            >
                              <i className="ri-subtract-line text-xs md:text-sm"></i>
                            </button>
                            <span className="w-6 md:w-8 text-center font-semibold text-sm md:text-base">{item.quantity || 1}</span>
                            <button
                              onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                              className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
                            >
                              <i className="ri-add-line text-xs md:text-sm"></i>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => onRemoveFromCart?.(item.cartId)}
                            className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                          >
                            <i className="ri-delete-bin-line text-sm md:text-base"></i>
                          </button>
                        </div>
                      </div>

                      {/* Mostrar personalizaciones detalladas - CORREGIDO para mostrar precios reales */}
                      {checkoutSettings.showCustomizations && item.customizations && item.customizations.length > 0 && (
                        <div className="ml-2 md:ml-4 mb-3">
                          <div className="space-y-2">
                            {/* Ingredientes Extra - CORREGIDOS para mostrar precios reales */}
                            {item.customizations.filter((c: string) => c.startsWith('add-')).length > 0 && (
                              <div>
                                <p className="text-xs md:text-sm font-medium text-green-700 mb-1">Ingredientes Extra:</p>
                                <div className="space-y-1">
                                  {item.customizations
                                    .filter((c: string) => c.startsWith('add-'))
                                    .map((customization: string, index: number) => {
                                      const { name, price } = getExtraIngredientDetails(customization);
                                      return (
                                        <div key={index} className="flex justify-between text-xs md:text-sm">
                                          <span className="text-green-600">+ {name}</span>
                                          <span className="text-green-600">+{price.toFixed(2)} zł</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                            {/* Ingredientes Eliminados - CORREGIDOS */}
                            {item.customizations.filter((c: string) => c.startsWith('remove-')).length > 0 && (
                              <div>
                                <p className="text-xs md:text-sm font-medium text-red-700 mb-1">Ingredientes Eliminados:</p>
                                <div className="space-y-1">
                                  {item.customizations
                                    .filter((c: string) => c.startsWith('remove-'))
                                    .map((customization: string, index: number) => {
                                      const parts = customization.split('-');
                                      const name = parts.slice(1, -1).join('-') || customization.replace('remove-', '').replace(/\-[\d\.]+$/, '');
                                      return (
                                        <div key={index} className="text-xs md:text-sm">
                                          <span className="text-red-600">- {name}</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                            {/* Combos seleccionados */}
                            {item.selectedCombo && (
                              <div>
                                <p className="text-xs md:text-sm font-medium text-yellow-700 mb-1">🎁 Combo:</p>
                                <div className="text-xs md:text-sm">
                                  <span className="text-yellow-600">
                                    {item.selectedCombo.name} - {item.selectedCombo.description}
                                  </span>
                                  <span className="text-yellow-600 ml-2">+{item.selectedCombo.price.toFixed(2)} zł</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mostrar comentarios */}
                      {checkoutSettings.showComments && item.comments && (
                        <div className="ml-2 md:ml-4 mb-3">
                          <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">Comentarios:</p>
                          <p className="text-xs md:text-sm text-gray-600 italic">"{item.comments}"</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                        <span>Subtotal producto:</span>
                        <span>{itemSubtotal.toFixed(2)} zł</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desglose de totales */}
              <div className="border-t pt-4 space-y-2 md:space-y-3">
                <div className="flex justify-between items-center text-sm md:text-base">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">{totals.subtotal.toFixed(2)} zł</span>
                </div>
                
                {totals.customizationsTotal > 0 && (
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-700">Adicionales:</span>
                    <span className="font-semibold">+{totals.customizationsTotal.toFixed(2)} zł</span>
                  </div>
                )}

                {totals.totalTaxes > 0 && (
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-700">Impuestos:</span>
                    <span className="font-semibold">+{totals.totalTaxes.toFixed(2)} zł</span>
                  </div>
                )}

                {deliveryType === 'delivery' && (
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-700">Costo de Entrega:</span>
                    <span className="font-semibold">+{totals.deliveryFee.toFixed(2)} zł</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg md:text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">{totals.finalTotal.toFixed(2)} zł</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario del cliente mejorado */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Información del Cliente</h2>
              
              {/* Selector de tipo de entrega */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {checkoutSettings.formLabels?.deliveryType || 'Tipo de Entrega'}
                </label>
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  {checkoutSettings.deliveryTypes?.delivery?.enabled && (
                    <label className="flex items-center p-3 md:p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="delivery"
                        checked={deliveryType === 'delivery'}
                        onChange={(e) => setDeliveryType(e.target.value)}
                        className="mr-2 md:mr-3"
                      />
                      <div>
                        <i className="ri-truck-line text-lg md:text-xl text-orange-500 mb-1 block"></i>
                        <span className="font-medium text-xs md:text-sm">{checkoutSettings.deliveryTypes?.delivery?.label || 'Domicilio'}</span>
                      </div>
                    </label>
                  )}
                  
                  {checkoutSettings.deliveryTypes?.pickup?.enabled && (
                    <label className="flex items-center p-3 md:p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={deliveryType === 'pickup'}
                        onChange={(e) => setDeliveryType(e.target.value)}
                        className="mr-2 md:mr-3"
                      />
                      <div>
                        <i className="ri-store-line text-lg md:text-xl text-orange-500 mb-1 block"></i>
                        <span className="font-medium text-xs md:text-sm">{checkoutSettings.deliveryTypes?.pickup?.label || 'Recoger en Punto'}</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {checkoutSettings.formLabels?.name || 'Nombre completo'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {checkoutSettings.formLabels?.phone || 'Teléfono'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                      placeholder="+48 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {checkoutSettings.formLabels?.email || 'Email'}
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>

                {/* Campos específicos para entrega a domicilio */}
                {deliveryType === 'delivery' && (
                  <div className="space-y-3 md:space-y-4 p-3 md:p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-3 text-sm md:text-base">Información de Entrega</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {checkoutSettings.formLabels?.address || 'Dirección'} *
                      </label>
                      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        <input
                          type="text"
                          required
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                          className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                          placeholder="Calle, número, apartamento"
                        />
                        <button
                          type="button"
                          onClick={openGoogleMaps}
                          className="px-3 md:px-4 py-2 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap text-xs md:text-sm"
                        >
                          <i className="ri-map-pin-line mr-1 md:mr-2"></i>
                          Maps
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {checkoutSettings.formLabels?.city || 'Ciudad'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                          placeholder="Sosnowiec"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {checkoutSettings.formLabels?.postalCode || 'Código Postal'}
                        </label>
                        <input
                          type="text"
                          value={customerInfo.postalCode}
                          onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                          className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                          placeholder="41-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {checkoutSettings.formLabels?.deliveryNotes || 'Notas de entrega'}
                      </label>
                      <textarea
                        value={customerInfo.deliveryNotes}
                        onChange={(e) => setCustomerInfo({...customerInfo, deliveryNotes: e.target.value})}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
                        rows={2}
                        placeholder="Instrucciones especiales para la entrega..."
                      />
                    </div>

                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                      <p className="text-xs md:text-sm text-yellow-800">
                        <i className="ri-information-line mr-2"></i>
                        Costo de entrega: {checkoutSettings.deliveryFee || 7} zł
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        "{checkoutSettings.deliveryOutsideMessage || 'Entregas fuera de Sosnowiec 14zl'}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Método de pago */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {checkoutSettings.formLabels?.paymentMethod || 'Método de Pago'} *
                  </label>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {checkoutSettings.paymentMethods && Object.entries(checkoutSettings.paymentMethods)
                      .filter(([_, method]) => method?.enabled)
                      .map(([key, method]) => (
                        <label key={key} className="flex items-center p-2 md:p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={key}
                            checked={customerInfo.paymentMethod === key}
                            onChange={(e) => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}
                            className="mr-1 md:mr-2"
                          />
                          <span className="text-xs md:text-sm font-medium">{method?.label || key}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* Canal de confirmación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {checkoutSettings.formLabels?.confirmationChannel || 'Confirmar pedido por'} *
                  </label>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {checkoutSettings.confirmationChannels && Object.entries(checkoutSettings.confirmationChannels)
                      .filter(([_, channel]) => channel?.enabled)
                      .map(([key, channel]) => (
                        <label key={key} className="flex items-center p-2 md:p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="confirmationChannel"
                            value={key}
                            checked={customerInfo.confirmationChannel === key}
                            onChange={(e) => setCustomerInfo({...customerInfo, confirmationChannel: e.target.value})}
                            className="mr-1 md:mr-2"
                          />
                          <span className="text-xs md:text-sm font-medium">{channel?.label || key}</span>
                        </label>
                      ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-orange-600 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Procesando...' : `Realizar Pedido - ${totals.finalTotal.toFixed(2)} zł`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}