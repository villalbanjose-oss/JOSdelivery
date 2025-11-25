'use client';
import { useState, useEffect } from 'react';

export default function BusinessSettings() {
  const [businessData, setBusinessData] = useState({
    name: 'JOS Restaurant',
    whatsapp: '794965638',
    email: 'contacto@jos-restaurant.com',
    city: 'Sosnowiec',
    country: 'Polonia',
    address: 'Calle Principal 123',
    nip: '',
    regon: '',
    footerLegalText:
      '© 2025 JOS Restaurante. Todos los derechos reservados.\nEl administrador de los datos personales es JOS Restaurante, con sede en Sosnowiec.\nLa política de privacidad y cookies está disponible en: [enlace a la política].',
    showNip: false,
    showRegon: false,
    showFooterLegal: true
  });

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

  const [comboSettings, setComboSettings] = useState({
    isEnabled: true,
    showInMenu: true,
    text: 'En combo (papas fritas + gaseosa 330ml)',
    price: 8
  });

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

  const [categories, setCategories] = useState([
    { key: 'hamburguesas', names: 'Hamburguesas' },
    { key: 'hotdogs', names: 'Hot Dogs' },
    { key: 'burritos', names: 'Burritos' },
    { key: 'bebidas', names: 'Bebidas' }
  ]);

  const [extraIngredientsByCategory, setExtraIngredientsByCategory] = useState<any>({});
  const [combosByProduct, setCombosByProduct] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState('hamburguesas');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showExtraIngredientsModal, setShowExtraIngredientsModal] =
    useState(false);
  const [showCombosModal, setShowCombosModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState('');

  // -------------------------------------------------------------------------
  // Carga inicial de datos desde localStorage
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Business data
    const savedBusinessData = localStorage.getItem('businessSettings');
    if (savedBusinessData) {
      try {
        const parsed = JSON.parse(savedBusinessData);
        setBusinessData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error parsing businessSettings:', e);
      }
    }

    // Schedule settings
    const savedScheduleSettings = localStorage.getItem('scheduleSettings');
    if (savedScheduleSettings) {
      try {
        const parsed = JSON.parse(savedScheduleSettings);
        setScheduleSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error parsing scheduleSettings:', e);
      }
    }

    // Combo settings
    const savedComboSettings = localStorage.getItem('comboSettings');
    if (savedComboSettings) {
      try {
        const parsed = JSON.parse(savedComboSettings);
        setComboSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error parsing comboSettings:', e);
      }
    }

    // Checkout settings
    const savedCheckoutSettings = localStorage.getItem('checkoutSettings');
    if (savedCheckoutSettings) {
      try {
        const parsed = JSON.parse(savedCheckoutSettings);
        setCheckoutSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error parsing checkoutSettings:', e);
      }
    }

    // Categories
    const savedCategories = localStorage.getItem('menuCategories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed)) {
          setCategories(parsed);
        }
      } catch (e) {
        console.error('Error parsing categories:', e);
      }
    }

    // Extras by category
    const savedExtrasByCategory = localStorage.getItem('extraIngredientsByCategory');
    if (savedExtrasByCategory) {
      try {
        const parsed = JSON.parse(savedExtrasByCategory);
        setExtraIngredientsByCategory(parsed);
      } catch (e) {
        console.error('Error parsing extraIngredientsByCategory:', e);
      }
    }

    // Combos by product (validated)
    const savedCombosByProduct = localStorage.getItem('combosByProduct');
    if (savedCombosByProduct) {
      try {
        const parsed = JSON.parse(savedCombosByProduct);
        const validatedCombos: any = {};
        Object.keys(parsed).forEach(productId => {
          validatedCombos[productId] = Array.isArray(parsed[productId])
            ? parsed[productId]
            : [];
        });
        setCombosByProduct(validatedCombos);
      } catch (e) {
        console.error('Error parsing combosByProduct:', e);
        setCombosByProduct({});
      }
    }
  }, []);

  // -------------------------------------------------------------------------
  // Guardado de configuraciones
  // -------------------------------------------------------------------------
  const saveBusinessData = () => {
    localStorage.setItem('businessSettings', JSON.stringify(businessData));
    setShowSuccessMessage('Datos del negocio guardados correctamente');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  const saveScheduleSettings = () => {
    try {
      const validatedSettings = {
        ...scheduleSettings,
        schedule: { ...scheduleSettings.schedule }
      };
      localStorage.setItem('scheduleSettings', JSON.stringify(validatedSettings));

      // Disparar evento personalizado (útil para otros componentes)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('scheduleUpdated', { detail: validatedSettings })
        );
      }

      setShowSuccessMessage('Configuración de horarios guardada correctamente');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error guardando horarios:', error);
      setShowSuccessMessage('Error al guardar la configuración de horarios');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }
  };

  const saveComboSettings = () => {
    localStorage.setItem('comboSettings', JSON.stringify(comboSettings));
    setShowSuccessMessage('Configuración de combos guardada correctamente');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  const saveCheckoutSettings = () => {
    localStorage.setItem('checkoutSettings', JSON.stringify(checkoutSettings));
    setShowSuccessMessage('Configuración de finalizar pedido guardada correctamente');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  const saveCategories = () => {
    localStorage.setItem('menuCategories', JSON.stringify(categories));
    setShowSuccessMessage('Categorías guardadas correctamente');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  // -------------------------------------------------------------------------
  // Operaciones sobre categorías e ingredientes
  // -------------------------------------------------------------------------
  const addCategory = () => {
    const newCategory = {
      key: `categoria_${Date.now()}`,
      names: 'Nueva Categoría'
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (index: number, field: string, value: string) => {
    const updated = [...categories];
    if (field === 'names') {
      updated[index].names = value;
    } else if (field === 'key') {
      updated[index].key = value;
    }
    setCategories(updated);
  };

  const deleteCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const getCategoryDisplayName = (category: any) => {
    try {
      if (typeof category.names === 'string') return category.names;
      return category.key || 'Categoría';
    } catch (error) {
      console.error('Error getting category display name:', error);
      return category.key || 'Categoría';
    }
  };

  const openExtraIngredientsModal = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setShowExtraIngredientsModal(true);
  };

  const openCombosModal = (product: any) => {
    setSelectedProduct(product);
    setShowCombosModal(true);
  };

  const saveExtraIngredients = (categoryKey: string, ingredients: any[]) => {
    const updated = { ...extraIngredientsByCategory, [categoryKey]: ingredients };
    setExtraIngredientsByCategory(updated);
    localStorage.setItem('extraIngredientsByCategory', JSON.stringify(updated));
    setShowSuccessMessage('Ingredientes extra guardados correctamente');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  const saveCombos = (productId: number, combos: any[]) => {
    const updated = {
      ...combosByProduct,
      [productId]: Array.isArray(combos) ? combos : []
    };
    setCombosByProduct(updated);
    localStorage.setItem('combosByProduct', JSON.stringify(updated));
    setShowSuccessMessage('Combos guardados correctamente');
    setTimeout(() => setShowSuccessMessage(''), 3000);
  };

  // -------------------------------------------------------------------------
  // Horario
  // -------------------------------------------------------------------------
  const updateScheduleDay = (day: string, field: string, value: any) => {
    setScheduleSettings(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          [field]: value
        }
      }
    }));
  };

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const getCurrentBusinessStatus = () => {
    if (!scheduleSettings.isEnabled) {
      return { isOpen: true, message: 'Horario no configurado' };
    }

    const now = new Date();
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ];
    const currentDay = days[now.getDay()];
    const currentTime =
      now.getHours().toString().padStart(2, '0') +
      ':' +
      now.getMinutes().toString().padStart(2, '0');

    const todaySchedule =
      scheduleSettings.schedule[
        currentDay as keyof typeof scheduleSettings.schedule
      ];

    if (!todaySchedule.enabled) {
      return {
        isOpen: false,
        message: `Hoy ${dayNames[currentDay as keyof typeof dayNames]}: ${scheduleSettings.closedMessage}`
      };
    }

    const isOpen =
      currentTime >= todaySchedule.open && currentTime <= todaySchedule.close;
    return {
      isOpen,
      message: `Hoy ${dayNames[currentDay as keyof typeof dayNames]}: ${
        isOpen ? 'ABIERTO' : 'CERRADO'
      } (${todaySchedule.open} - ${todaySchedule.close})`
    };
  };

  // -------------------------------------------------------------------------
  // Función de descarga de configuración
  // -------------------------------------------------------------------------
  const downloadConfiguration = () => {
    try {
      // Crear objeto con toda la configuración actual
      const configurationData = {
        businessData,
        scheduleSettings,
        comboSettings,
        checkoutSettings,
        categories,
        extraIngredientsByCategory,
        combosByProduct,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      // Convertir a JSON con formato legible
      const jsonString = JSON.stringify(configurationData, null, 2);

      // Crear blob con el contenido JSON
      const blob = new Blob([jsonString], { type: 'application/json' });

      // Crear URL temporal para el blob
      const url = URL.createObjectURL(blob);

      // Crear elemento de enlace temporal para la descarga
      const link = document.createElement('a');
      link.href = url;
      
      // Generar nombre de archivo con fecha y hora
      const now = new Date();
      const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeString = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      link.download = `configuracion-negocio-${dateString}-${timeString}.json`;

      // Agregar al DOM temporalmente y hacer clic
      document.body.appendChild(link);
      link.click();

      // Limpiar: remover elemento y liberar URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Mostrar mensaje de éxito
      setShowSuccessMessage('Configuración descargada exitosamente');
      setTimeout(() => setShowSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Error al descargar configuración:', error);
      setShowSuccessMessage('Error al descargar la configuración');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <i className="ri-check-circle-line mr-2"></i>
            {showSuccessMessage}
          </div>
        </div>
      )}

      {/* Botón de descarga de configuración */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Exportar Configuración
            </h3>
            <p className="text-gray-600 text-sm">
              Descarga un archivo JSON con toda la configuración actual del negocio, 
              incluyendo información del negocio, horarios, combos, ingredientes extra y ajustes de checkout.
            </p>
          </div>
          <button
            onClick={downloadConfiguration}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap flex items-center"
          >
            <i className="ri-download-line mr-2"></i>
            Descargar Configuración
          </button>
        </div>
      </div>

      {/* Información del Negocio */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Información del Negocio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Negocio
            </label>
            <input
              type="text"
              value={businessData.name}
              onChange={e =>
                setBusinessData({ ...businessData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp (solo números)
            </label>
            <input
              type="text"
              value={businessData.whatsapp}
              onChange={e =>
                setBusinessData({ ...businessData, whatsapp: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="794965638"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={businessData.email}
              onChange={e =>
                setBusinessData({ ...businessData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={businessData.city}
              onChange={e =>
                setBusinessData({ ...businessData, city: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País
            </label>
            <input
              type="text"
              value={businessData.country}
              onChange={e =>
                setBusinessData({ ...businessData, country: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={businessData.address}
              onChange={e =>
                setBusinessData({ ...businessData, address: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Campos Reglamentarios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIP (Número de Identificación Fiscal)
            </label>
            <input
              type="text"
              value={businessData.nip}
              onChange={e =>
                setBusinessData({ ...businessData, nip: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: 1234567890"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showNip"
                checked={businessData.showNip}
                onChange={e =>
                  setBusinessData({ ...businessData, showNip: e.target.checked })
                }
                className="rounded mr-2"
              />
              <label htmlFor="showNip" className="text-sm text-gray-600">
                Mostrar NIP al público
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              REGON (Registro Estadístico Nacional)
            </label>
            <input
              type="text"
              value={businessData.regon}
              onChange={e =>
                setBusinessData({ ...businessData, regon: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: 123456789"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="showRegon"
                checked={businessData.showRegon}
                onChange={e =>
                  setBusinessData({ ...businessData, showRegon: e.target.checked })
                }
                className="rounded mr-2"
              />
              <label htmlFor="showRegon" className="text-sm text-gray-600">
                Mostrar REGON al público
              </label>
            </div>
          </div>
        </div>

        {/* Información Legal del Pie de Página */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Información Legal (Pie de Página)
          </label>
          <textarea
            value={businessData.footerLegalText}
            onChange={e =>
              setBusinessData({ ...businessData, footerLegalText: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-32"
            placeholder="© 2025 JOS Restaurante. Todos los derechos reservados.&#10;El administrador de los datos personales es JOS Restaurante, con sede en Sosnowiec.&#10;La política de privacidad y cookies está disponible en: [enlace a la política]."
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="showFooterLegal"
              checked={businessData.showFooterLegal}
              onChange={e =>
                setBusinessData({ ...businessData, showFooterLegal: e.target.checked })
              }
              className="rounded mr-2"
            />
            <label htmlFor="showFooterLegal" className="text-sm text-gray-600">
              Mostrar información legal en el pie de página
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Esta información aparecerá en el pie de página del sitio web para cumplir con los requisitos legales.
          </p>
        </div>

        <button
          onClick={saveBusinessData}
          className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
        >
          Guardar Información del Negocio
        </button>
      </div>

      {/* Control de Horario */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Control de Horario
        </h3>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="enableSchedule"
              checked={scheduleSettings.isEnabled}
              onChange={e =>
                setScheduleSettings({
                  ...scheduleSettings,
                  isEnabled: e.target.checked
                })
              }
              className="rounded"
            />
            <label
              htmlFor="enableSchedule"
              className="text-sm font-medium text-gray-700"
            >
              Activar control de horario de atención
            </label>
          </div>

          {scheduleSettings.isEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje cuando está cerrado
                </label>
                <input
                  type="text"
                  value={scheduleSettings.closedMessage}
                  onChange={e =>
                    setScheduleSettings({
                      ...scheduleSettings,
                      closedMessage: e.target.value
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Cerrado por ahora"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-4">
                  Configurar horarios por día
                </h4>

                <div className="space-y-4">
                  {Object.entries(scheduleSettings.schedule).map(
                    ([day, daySchedule]) => (
                      <div
                        key={day}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white"
                      >
                        <div className="w-24">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={daySchedule.enabled}
                              onChange={e =>
                                updateScheduleDay(day, 'enabled', e.target.checked)
                              }
                              className="rounded"
                            />
                            <label className="text-sm font-medium text-gray-700">
                              {dayNames[day as keyof typeof dayNames]}
                            </label>
                          </div>
                        </div>

                        {daySchedule.enabled && (
                          <>
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-gray-600">
                                Abre:
                              </label>
                              <input
                                type="time"
                                value={daySchedule.open}
                                onChange={e =>
                                  updateScheduleDay(day, 'open', e.target.value)
                                }
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-gray-600">
                                Cierra:
                              </label>
                              <input
                                type="time"
                                value={daySchedule.close}
                                onChange={e =>
                                  updateScheduleDay(day, 'close', e.target.value)
                                }
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                          </>
                        )}

                        {!daySchedule.enabled && (
                          <span className="text-sm text-gray-500 italic">
                            Cerrado todo el día
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  Vista previa del estado actual:
                </h4>
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                  <div className="flex items-center">
                    <i className="ri-time-line mr-2 text-blue-600"></i>
                    <span className="text-sm text-blue-800">
                      {getCurrentBusinessStatus().message}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={saveScheduleSettings}
          className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
        >
          Guardar Configuración de Horarios
        </button>
      </div>

      {/* Configuración de Finalizar Pedido */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Configuración de Finalizar Pedido
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Costo de Entrega (zł)
              </label>
              <input
                type="number"
                step="0.01"
                value={checkoutSettings.deliveryFee}
                onChange={e =>
                  setCheckoutSettings({
                    ...checkoutSettings,
                    deliveryFee: parseFloat(e.target.value) || 0
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje de Entrega Externa
              </label>
              <input
                type="text"
                value={checkoutSettings.deliveryOutsideMessage}
                onChange={e =>
                  setCheckoutSettings({
                    ...checkoutSettings,
                    deliveryOutsideMessage: e.target.value
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Impuesto Comida (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={checkoutSettings.foodTaxRate * 100}
                onChange={e =>
                  setCheckoutSettings({
                    ...checkoutSettings,
                    foodTaxRate: parseFloat(e.target.value) / 100 || 0
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Impuesto Bebidas (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={checkoutSettings.drinkTaxRate * 100}
                onChange={e =>
                  setCheckoutSettings({
                    ...checkoutSettings,
                    drinkTaxRate: parseFloat(e.target.value) / 100 || 0
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showCustomizations"
                checked={checkoutSettings.showCustomizations}
                onChange={e =>
                  setCheckoutSettings({
                    ...checkoutSettings,
                    showCustomizations: e.target.checked
                  })
                }
                className="rounded"
              />
              <label
                htmlFor="showCustomizations"
                className="text-sm font-medium text-gray-700"
              >
                Mostrar personalizaciones en el resumen
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="showComments"
                checked={checkoutSettings.showComments}
                onChange={e =>
                  setCheckoutSettings({
                    ...checkoutSettings,
                    showComments: e.target.checked
                  })
                }
                className="rounded"
              />
              <label
                htmlFor="showComments"
                className="text-sm font-medium text-gray-700"
              >
                Mostrar comentarios en el resumen
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={saveCheckoutSettings}
          className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
        >
          Guardar Configuración de Finalizar Pedido
        </button>
      </div>

      {/* Modal de Ingredientes Extra */}
      {showExtraIngredientsModal && (
        <ExtraIngredientsModal
          categoryKey={selectedCategory}
          extraIngredients={extraIngredientsByCategory[selectedCategory] || []}
          onSave={(ingredients: any[]) => {
            saveExtraIngredients(selectedCategory, ingredients);
            setShowExtraIngredientsModal(false);
          }}
          onClose={() => setShowExtraIngredientsModal(false)}
        />
      )}

      {/* Modal de Combos */}
      {showCombosModal && selectedProduct && (
        <CombosModal
          product={selectedProduct}
          combos={combosByProduct[selectedProduct.id] || []}
          onSave={(combos: any[]) => {
            saveCombos(selectedProduct.id, combos);
            setShowCombosModal(false);
          }}
          onClose={() => setShowCombosModal(false)}
        />
      )}
    </div>
  );
}

// Modal de Ingredientes Extra
function ExtraIngredientsModal({ categoryKey, extraIngredients, onSave, onClose }: {
  categoryKey: string;
  extraIngredients: any[];
  onSave: (ingredients: any[]) => void;
  onClose: () => void;
}) {
  const [ingredients, setIngredients] = useState(
    Array.isArray(extraIngredients) ? extraIngredients : []
  );

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', price: 0 }]);
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Ingredientes Extra - {categoryKey}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {ingredients.map((ingredient: any, index: number) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nombre del ingrediente"
                    value={ingredient.name || ''}
                    onChange={e =>
                      updateIngredient(index, 'name', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={ingredient.price || 0}
                    onChange={e =>
                      updateIngredient(
                        index,
                        'price',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <i className="ri-delete-bin-line text-xl"></i>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addIngredient}
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 mb-6"
          >
            <i className="ri-add-line mr-2"></i>Agregar Ingrediente
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => onSave(ingredients)}
              className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Guardar
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de Combos
function CombosModal({ product, combos, onSave, onClose }: {
  product: any;
  combos: any[];
  onSave: (combos: any[]) => void;
  onClose: () => void;
}) {
  const [productCombos, setProductCombos] = useState<Array<any>>(
    Array.isArray(combos) ? combos : []
  );

  const addCombo = () => {
    setProductCombos([
      ...productCombos,
      { name: '', description: '', price: 0, items: [] }
    ]);
  };

  const updateCombo = (index: number, field: string, value: any) => {
    const updated = [...productCombos];
    updated[index][field] = value;
    setProductCombos(updated);
  };

  const removeCombo = (index: number) => {
    setProductCombos(productCombos.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Combos para: {product?.name ?? 'Producto'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {productCombos.map((combo: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre del combo"
                    value={combo.name || ''}
                    onChange={e => updateCombo(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={combo.description || ''}
                    onChange={e => updateCombo(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={combo.price || 0}
                    onChange={e => updateCombo(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={() => removeCombo(index)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <i className="ri-delete-bin-line mr-1"></i>Eliminar
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addCombo}
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 mb-6"
          >
            <i className="ri-add-line mr-2"></i>Agregar Combo
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => onSave(productCombos)}
              className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Guardar
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
