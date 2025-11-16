'use client';
import { useState, useEffect } from 'react';

export default function BannerManagement() {
  const [activeSection, setActiveSection] = useState('home');
  const [showPreview, setShowPreview] = useState(false);

  // Estados para cada sección de banners
  const [homeSettings, setHomeSettings] = useState({
    title: 'JOS',
    subtitle: 'Sabores que Encienden tu Pasión',
    description:
      'Descubre nuestras deliciosas hamburguesas, hot dogs, burritos y bebidas. Personaliza tu pedido y disfruta de sabores únicos.',
    fontFamily: 'Pacifico',
    titleColor: '#FFFFFF',
    subtitleColor: '#FFFFFF',
    descriptionColor: '#FFFFFF',
    backgroundImage: '',
    useCustomBackground: false,
    backgroundColor: '#E2B714',
  });

  const [menuIntroSettings, setMenuIntroSettings] = useState({
    title: 'JOS Restaurant',
    subtitle: 'Sabores auténticos que conquistan',
    description: 'Descubre nuestra deliciosa selección de hamburguesas gourmet, hot dogs artesanales, burritos frescos y bebidas refrescantes. Cada plato preparado con ingredientes de la más alta calidad.',
    phone: '+48 794 965 638',
    location: 'Sosnowiec, Polonia',
    additionalInfo: 'Abierto todos los días • Entrega a domicilio disponible',
    schedule: 'Todos los días de 10:00 a 22:00',
    fontFamily: 'Pacifico',
    titleColor: '#FCD34D',
    subtitleColor: '#F3F4F6',
    descriptionColor: '#E5E7EB',
    phoneColor: '#FCD34D',
    locationColor: '#FCD34D',
    additionalInfoColor: '#9CA3AF',
    backgroundImage: '',
    overlayOpacity: 60,
    buttonText: 'Ordenar Ahora',
    buttonColor: '#FF5733',
    buttonTextColor: '#FFFFFF',
    showFeatures: true,
    feature1: 'Entrega rápida',
    feature2: 'Calidad premium',
    feature3: 'Hecho con amor',
    featuresColor: '#FCD34D'
  });

  const [menuHeaderSettings, setMenuHeaderSettings] = useState({
    brandName: 'JOS Restaurant',
    slogan: 'Sabores auténticos que conquistan',
    description:
      'Descubre nuestra deliciosa selección de hamburguesas gourmet, hot dogs artesanales, burritos frescos y bebidas refrescantes.',
    fontFamily: 'Pacifico',
    brandColor: '#FCD34D',
    sloganColor: '#F3F4F6',
    descriptionColor: '#E5E7EB',
    backgroundImage: '',
    showContactInfo: true,
    phone: '+48 794 965 638',
    location: 'Sosnowiec, Polonia',
  });

  // Nuevo estado para estilo del menú
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

  const [promotionBannerSettings, setPromotionBannerSettings] = useState({
    isActive: true,
    text: 'Hoy 2x1 en hamburguesas',
    backgroundColor: '#FF6B35',
    textColor: '#FFFFFF',
    showIcon: true,
    animationType: 'slide',
    fontFamily: 'Inter',
  });

  const [footerSettings, setFooterSettings] = useState({
    aboutUs: {
      isVisible: true,
      title: 'Quiénes Somos',
      content:
        'Somos un restaurante especializado en comida rápida de calidad, ofreciendo hamburguesas, hot dogs y burritos con sabor auténtico.',
      titleColor: '#FCD34D',
      contentColor: '#D1D5DB',
    },
    logo: {
      isVisible: true,
      logoImage: '',
      brandName: 'JOS',
      brandColor: '#FCD34D',
    },
    contact: {
      isVisible: true,
      title: 'Contacto',
      phone: '+48 794 965 638',
      email: 'contacto@jos-restaurant.com',
      address: 'Sosnowiec, Polonia',
      nip: 'NIP: 123456789',
      regon: 'REGON: 123333333',
      showNip: true,
      showRegon: true,
      titleColor: '#FCD34D',
      textColor: '#D1D5DB',
    },
    socialMedia: {
      isVisible: true,
      title: 'Síguenos',
      facebook: 'https://facebook.com/jos-restaurant',
      instagram: 'https://instagram.com/jos-restaurant',
      twitter: 'https://twitter.com/jos-restaurant',
      whatsapp: '+48794965638',
      titleColor: '#FCD34D',
      iconColor: '#D1D5DB',
      iconHoverColor: '#FCD34D',
    },
    policies: {
      isVisible: true,
      title: 'Políticas',
      privacyPolicy: 'https://jos-restaurant.com/privacy',
      termsConditions: 'https://jos-restaurant.com/terms',
      privacyText: 'Política de Privacidad',
      termsText: 'Términos y Condiciones',
      titleColor: '#FCD34D',
      linkColor: '#D1D5DB',
      linkHoverColor: '#FCD34D',
    },
    legalSection: {
      isVisible: true,
      copyrightText: '© 2024 JOS Restaurante. Todos los derechos reservados.',
      legalText: 'El administrador de los datos personales es JOS Restaurante, con sede en Sosnowiec.\nLa política de privacidad y cookies está disponible en [enlace a la política].',
      showNip: true,
      showRegon: true,
      showCopyright: true,
      showLegalText: true,
      showReaddy: true,
      readyText: 'Hecho con',
      readyLinkText: 'Readdy',
      textColor: '#9CA3AF',
      linkColor: '#FCD34D',
    },
    backgroundColor: '#000000',
    accentColor: '#FCD34D',
    borderColor: '#374151',
  });

  // Opciones de fuentes
  const fontOptions = [
    { value: 'Pacifico', label: 'Pacifico (Decorativa)' },
    { value: 'Inter', label: 'Inter (Moderna)' },
    { value: 'Roboto', label: 'Roboto (Clásica)' },
    { value: 'Poppins', label: 'Poppins (Elegante)' },
    { value: 'Montserrat', label: 'Montserrat (Profesional)' },
    { value: 'Open Sans', label: 'Open Sans (Limpia)' },
  ];

  // Paleta de colores predefinida - CORREGIDA sin duplicados
  const colorPalette = [
    '#FFFFFF',
    '#000000',
    '#FCD34D',
    '#FF6B35',
    '#E2B714',
    '#F3F4F6',
    '#E5E7EB',
    '#D1D5DB',
    '#9CA3AF',
    '#6B7280',
    '#374151',
    '#1F2937',
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#EAB308',
    '#84CC16',
    '#22C55E',
    '#10B981',
    '#14B8A6',
    '#06B6D4',
    '#0EA5E9',
    '#3B82F6',
    '#6366F1',
    '#8B5CF6',
    '#A855F7',
    '#D946EF',
    '#EC4899',
    '#F43F5E',
    '#FEF3E2',
    '#FEE2E2',
    '#FED7AA',
    '#FBBF24',
    '#EA580C',
  ];

  // Cargar configuraciones al montar - SOLO UNA VEZ
  useEffect(() => {
    try {
      // Cargar configuración de página principal
      const savedHomeSettings = localStorage.getItem('homeSettings');
      if (savedHomeSettings) {
        const parsed = JSON.parse(savedHomeSettings);
        setHomeSettings((prev) => ({ ...prev, ...parsed }));
      }

      // Cargar configuración de página de entrada del menú
      const savedMenuIntroSettings = localStorage.getItem('menuIntroSettings');
      if (savedMenuIntroSettings) {
        const parsed = JSON.parse(savedMenuIntroSettings);
        setMenuIntroSettings((prev) => ({ ...prev, ...parsed }));
      }

      // Cargar configuración de estilo del menú
      const savedMenuStyleSettings = localStorage.getItem('menuStyleSettings');
      if (savedMenuStyleSettings) {
        const parsed = JSON.parse(savedMenuStyleSettings);
        setMenuStyleSettings((prev) => ({ ...prev, ...parsed }));
      }

      // Cargar configuración de banner promocional
      const savedPromotionSettings = localStorage.getItem('promotionBannerSettings');
      if (savedPromotionSettings) {
        const parsed = JSON.parse(savedPromotionSettings);
        setPromotionBannerSettings((prev) => ({ ...prev, ...parsed }));
      }

      // Cargar configuración de footer
      const savedFooterSettings = localStorage.getItem('footerSettings');
      if (savedFooterSettings) {
        const parsed = JSON.parse(savedFooterSettings);
        setFooterSettings((prev) => ({ ...prev, ...parsed }));
      }

      // Cargar configuración de menu header
      const savedMenuHeaderSettings = localStorage.getItem('menuHeaderSettings');
      if (savedMenuHeaderSettings) {
        const parsed = JSON.parse(savedMenuHeaderSettings);
        setMenuHeaderSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []); // Array vacío para ejecutar solo una vez

  // Función para manejar subida de imágenes con compresión
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    section: string,
    field: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tamaño del archivo (máximo 500KB)
      if (file.size > 500000) {
        alert('La imagen es demasiado grande. Por favor, selecciona una imagen menor a 500KB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;

        if (section === 'home') {
          setHomeSettings((prev) => ({ ...prev, [field]: imageUrl }));
        } else if (section === 'menuIntro') {
          setMenuIntroSettings((prev) => ({ ...prev, [field]: imageUrl }));
        } else if (section === 'menuHeader') {
          setMenuHeaderSettings((prev) => ({ ...prev, [field]: imageUrl }));
        } else if (section === 'footer') {
          setFooterSettings((prev) => ({
            ...prev,
            logo: { ...prev.logo, [field]: imageUrl },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para guardar configuraciones con manejo de errores
  const saveSettings = () => {
    try {
      // Guardar cada configuración individualmente
      localStorage.setItem('homeSettings', JSON.stringify(homeSettings));
      localStorage.setItem('menuIntroSettings', JSON.stringify(menuIntroSettings));
      localStorage.setItem('menuHeaderSettings', JSON.stringify(menuHeaderSettings));
      localStorage.setItem('menuStyleSettings', JSON.stringify(menuStyleSettings));
      localStorage.setItem('promotionBannerSettings', JSON.stringify(promotionBannerSettings));
      localStorage.setItem('footerSettings', JSON.stringify(footerSettings));

      // Disparar evento para actualizar componentes
      window.dispatchEvent(new Event('bannerSettingsUpdated'));

      alert('¡Configuraciones guardadas exitosamente!');
    } catch (error) {
      console.error('Error saving settings:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Error: Espacio de almacenamiento insuficiente. Por favor, usa imágenes más pequeñas.');
      } else {
        alert('Error al guardar las configuraciones');
      }
    }
  };

  // Componente de selector de color
  const ColorPicker = ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (color: string) => void;
    label: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {colorPalette.map((color, index) => (
          <button
            key={`${color}-${index}`}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
              value === color ? 'border-gray-800 scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
          placeholder="#FFFFFF"
        />
      </div>
    </div>
  );

  // Renderizar sección de estilo del menú
  const renderMenuStyleSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Estilo del Menú</h3>
      <p className="text-sm text-gray-600">Personaliza los colores de fondo, botones y elementos del menú</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Fondo del Menú</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useGradient"
              checked={menuStyleSettings.useGradient}
              onChange={(e) =>
                setMenuStyleSettings((prev) => ({
                  ...prev,
                  useGradient: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="useGradient" className="text-sm font-medium text-gray-700">
              Usar gradiente de fondo
            </label>
          </div>

          {menuStyleSettings.useGradient ? (
            <>
              <ColorPicker
                value={menuStyleSettings.gradientFrom}
                onChange={(color) =>
                  setMenuStyleSettings((prev) => ({
                    ...prev,
                    gradientFrom: color,
                  }))
                }
                label="Color de Gradiente (Inicio)"
              />

              <ColorPicker
                value={menuStyleSettings.gradientTo}
                onChange={(color) =>
                  setMenuStyleSettings((prev) => ({
                    ...prev,
                    gradientTo: color,
                  }))
                }
                label="Color de Gradiente (Final)"
              />
            </>
          ) : (
            <ColorPicker
              value={menuStyleSettings.backgroundColor}
              onChange={(color) =>
                setMenuStyleSettings((prev) => ({
                  ...prev,
                  backgroundColor: color,
                }))
              }
              label="Color de Fondo Sólido"
            />
          )}

          <h4 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-6">Botones de Categorías</h4>

          <ColorPicker
            value={menuStyleSettings.categoryButtonActiveColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                categoryButtonActiveColor: color,
              }))
            }
            label="Color del Botón Activo"
          />

          <ColorPicker
            value={menuStyleSettings.categoryButtonActiveTextColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                categoryButtonActiveTextColor: color,
              }))
            }
            label="Color del Texto del Botón Activo"
          />

          <ColorPicker
            value={menuStyleSettings.categoryButtonInactiveColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                categoryButtonInactiveColor: color,
              }))
            }
            label="Color del Botón Inactivo"
          />

          <ColorPicker
            value={menuStyleSettings.categoryButtonInactiveTextColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                categoryButtonInactiveTextColor: color,
              }))
            }
            label="Color del Texto del Botón Inactivo"
          />

          <ColorPicker
            value={menuStyleSettings.categoryButtonHoverColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                categoryButtonHoverColor: color,
              }))
            }
            label="Color del Botón al Pasar el Mouse"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Tarjetas de Productos</h4>

          <ColorPicker
            value={menuStyleSettings.productCardBackgroundColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                productCardBackgroundColor: color,
              }))
            }
            label="Color de Fondo de Tarjetas"
          />

          <ColorPicker
            value={menuStyleSettings.productTitleColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                productTitleColor: color,
              }))
            }
            label="Color del Título del Producto"
          />

          <ColorPicker
            value={menuStyleSettings.productDescriptionColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                productDescriptionColor: color,
              }))
            }
            label="Color de la Descripción del Producto"
          />

          <ColorPicker
            value={menuStyleSettings.productPriceColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                productPriceColor: color,
              }))
            }
            label="Color del Precio"
          />

          <h4 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-6">Botones de Productos</h4>

          <ColorPicker
            value={menuStyleSettings.productButtonColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                productButtonColor: color,
              }))
            }
            label="Color del Botón 'Agregar al Carrito'"
          />

          <ColorPicker
            value={menuStyleSettings.productButtonTextColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                productButtonTextColor: color,
              }))
            }
            label="Color del Texto del Botón"
          />

          <ColorPicker
            value={menuStyleSettings.productButtonHoverColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                productButtonHoverColor: color,
              }))
            }
            label="Color del Botón al Pasar el Mouse"
          />

          <h4 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-6">Títulos de Sección</h4>

          <ColorPicker
            value={menuStyleSettings.sectionTitleColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                sectionTitleColor: color,
              }))
            }
            label="Color del Título de Sección"
          />

          <ColorPicker
            value={menuStyleSettings.sectionDescriptionColor}
            onChange={(color) =>
              setMenuStyleSettings((prev) => ({
                ...prev,
                sectionDescriptionColor: color,
              }))
            }
            label="Color de la Descripción de Sección"
          />
        </div>
      </div>

      {/* Vista previa del estilo del menú */}
      <div className="border border-gray-300 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Vista Previa del Estilo:</h4>
        
        {/* Fondo del menú */}
        <div 
          className="w-full p-6 rounded-lg mb-4"
          style={{
            background: menuStyleSettings.useGradient 
              ? `linear-gradient(to bottom right, ${menuStyleSettings.gradientFrom}, ${menuStyleSettings.gradientTo})`
              : menuStyleSettings.backgroundColor
          }}
        >
          {/* Título de sección */}
          <h3 
            className="text-2xl font-bold mb-2 text-center"
            style={{ color: menuStyleSettings.sectionTitleColor }}
          >
            Nuestro Delicioso Menú
          </h3>
          <p 
            className="text-center mb-4"
            style={{ color: menuStyleSettings.sectionDescriptionColor }}
          >
            Explora nuestras categorías y descubre los sabores únicos
          </p>

          {/* Botones de categorías */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              className="px-4 py-2 rounded-lg font-semibold text-sm"
              style={{
                backgroundColor: menuStyleSettings.categoryButtonActiveColor,
                color: menuStyleSettings.categoryButtonActiveTextColor
              }}
            >
              Hamburguesas
            </button>
            <button
              className="px-4 py-2 rounded-lg font-semibold text-sm"
              style={{
                backgroundColor: menuStyleSettings.categoryButtonInactiveColor,
                color: menuStyleSettings.categoryButtonInactiveTextColor
              }}
            >
              Bebidas
            </button>
          </div>

          {/* Tarjeta de producto */}
          <div 
            className="max-w-xs mx-auto rounded-lg shadow-md overflow-hidden"
            style={{ backgroundColor: menuStyleSettings.productCardBackgroundColor }}
          >
            <div className="h-24 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h4 
                className="font-bold mb-1"
                style={{ color: menuStyleSettings.productTitleColor }}
              >
                Hamburguesa Clásica
              </h4>
              <p 
                className="text-sm mb-2"
                style={{ color: menuStyleSettings.productDescriptionColor }}
              >
                Carne, lechuga, tomate, cebolla
              </p>
              <div className="flex justify-between items-center mb-3">
                <span 
                  className="text-lg font-bold"
                  style={{ color: menuStyleSettings.productPriceColor }}
                >
                  15.99 zł
                </span>
              </div>
              <button
                className="w-full py-2 rounded-lg font-semibold text-sm"
                style={{
                  backgroundColor: menuStyleSettings.productButtonColor,
                  color: menuStyleSettings.productButtonTextColor
                }}
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar sección de página de entrada del menú
  const renderMenuIntroSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Página de Entrada del Menú</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título Principal
            </label>
            <input
              type="text"
              value={menuIntroSettings.title}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="JOS Restaurant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtítulo
            </label>
            <input
              type="text"
              value={menuIntroSettings.subtitle}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  subtitle: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Sabores auténticos que conquistan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción Principal
            </label>
            <textarea
              value={menuIntroSettings.description}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
              placeholder="Descripción del restaurante..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario de Atención
              <span className="text-xs text-gray-500 block">
                Este horario se mostrará en la página de entrada y se sincroniza con "Control de Horario"
              </span>
            </label>
            <input
              type="text"
              value={menuIntroSettings.schedule}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  schedule: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Todos los días de 10:00 a 22:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="text"
              value={menuIntroSettings.phone}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="+48 794 965 638"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              value={menuIntroSettings.location}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Sosnowiec, Polonia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información Adicional
            </label>
            <input
              type="text"
              value={menuIntroSettings.additionalInfo}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  additionalInfo: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Abierto todos los días • Entrega a domicilio disponible"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto del Botón
            </label>
            <input
              type="text"
              value={menuIntroSettings.buttonText}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  buttonText: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Ordenar Ahora"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
            <select
              value={menuIntroSettings.fontFamily}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  fontFamily: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showFeatures"
              checked={menuIntroSettings.showFeatures}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  showFeatures: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="showFeatures" className="text-sm font-medium text-gray-700">
              Mostrar características destacadas
            </label>
          </div>

          {menuIntroSettings.showFeatures && (
            <div className="space-y-2 pl-6">
              <input
                type="text"
                value={menuIntroSettings.feature1}
                onChange={(e) =>
                  setMenuIntroSettings((prev) => ({
                    ...prev,
                    feature1: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Característica 1"
              />
              <input
                type="text"
                value={menuIntroSettings.feature2}
                onChange={(e) =>
                  setMenuIntroSettings((prev) => ({
                    ...prev,
                    feature2: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Característica 2"
              />
              <input
                type="text"
                value={menuIntroSettings.feature3}
                onChange={(e) =>
                  setMenuIntroSettings((prev) => ({
                    ...prev,
                    feature3: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Característica 3"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de Fondo (máx. 500KB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'menuIntro', 'backgroundImage')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {menuIntroSettings.backgroundImage && (
              <div className="mt-2">
                <img
                  src={menuIntroSettings.backgroundImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacidad del Overlay ({menuIntroSettings.overlayOpacity}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={menuIntroSettings.overlayOpacity}
              onChange={(e) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  overlayOpacity: parseInt(e.target.value),
                }))
              }
              className="w-full"
            />
          </div>

          <ColorPicker
            value={menuIntroSettings.titleColor}
            onChange={(color) =>
              setMenuIntroSettings((prev) => ({
                ...prev,
                titleColor: color,
              }))
            }
            label="Color del Título"
          />

          <ColorPicker
            value={menuIntroSettings.subtitleColor}
            onChange={(color) =>
              setMenuIntroSettings((prev) => ({
                ...prev,
                subtitleColor: color,
              }))
            }
            label="Color del Subtítulo"
          />

          <ColorPicker
            value={menuIntroSettings.descriptionColor}
            onChange={(color) =>
              setMenuIntroSettings((prev) => ({
                ...prev,
                descriptionColor: color,
              }))
            }
            label="Color de la Descripción"
          />

          <ColorPicker
            value={menuIntroSettings.phoneColor}
            onChange={(color) =>
              setMenuIntroSettings((prev) => ({
                ...prev,
                phoneColor: color,
              }))
            }
            label="Color del Teléfono"
          />

          <ColorPicker
            value={menuIntroSettings.locationColor}
            onChange={(color) =>
              setMenuIntroSettings((prev) => ({
                ...prev,
                locationColor: color,
              }))
            }
            label="Color de la Ubicación"
          />

          <ColorPicker
            value={menuIntroSettings.additionalInfoColor}
            onChange={(color) =>
              setMenuIntroSettings((prev) => ({
                ...prev,
                additionalInfoColor: color,
              }))
            }
            label="Color de Información Adicional"
          />

          <ColorPicker
            value={menuIntroSettings.buttonColor}
            onChange={(color) =>
              setMenuIntroSettings((prev) => ({
                ...prev,
                buttonColor: color,
              }))
            }
            label="Color del Botón"
          />

          <ColorPicker
            value={menuIntroSettings.buttonTextColor}
            onChange={(color) =>
              setMenuIntroSettings((prev) => ({
                ...prev,
                buttonTextColor: color,
              }))
            }
            label="Color del Texto del Botón"
          />

          {menuIntroSettings.showFeatures && (
            <ColorPicker
              value={menuIntroSettings.featuresColor}
              onChange={(color) =>
                setMenuIntroSettings((prev) => ({
                  ...prev,
                  featuresColor: color,
                }))
              }
              label="Color de las Características"
            />
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar sección de banner promocional (modificado)
  const renderPromotionSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Banner de Promoción "Oferta Especial"</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={promotionBannerSettings.isActive}
              onChange={(e) =>
                setPromotionBannerSettings((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Activar Banner Promocional
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto de la Oferta Especial
              <span className="text-xs text-gray-500 block">
                Puedes cambiar "Oferta Especial" y el contenido completo
              </span>
            </label>
            <input
              type="text"
              value={promotionBannerSettings.text}
              onChange={(e) =>
                setPromotionBannerSettings((prev) => ({
                  ...prev,
                  text: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Hoy 2x1 en hamburguesas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuente</label>
            <select
              value={promotionBannerSettings.fontFamily}
              onChange={(e) =>
                setPromotionBannerSettings((prev) => ({
                  ...prev,
                  fontFamily: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Animación</label>
            <select
              value={promotionBannerSettings.animationType}
              onChange={(e) =>
                setPromotionBannerSettings((prev) => ({
                  ...prev,
                  animationType: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="slide">Deslizamiento</option>
              <option value="fade">Desvanecimiento</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showIcon"
              checked={promotionBannerSettings.showIcon}
              onChange={(e) =>
                setPromotionBannerSettings((prev) => ({
                  ...prev,
                  showIcon: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <label htmlFor="showIcon" className="text-sm text-gray-700">
              Mostrar iconos de fuego
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <ColorPicker
            value={promotionBannerSettings.backgroundColor}
            onChange={(color) =>
              setPromotionBannerSettings((prev) => ({
                ...prev,
                backgroundColor: color,
              }))
            }
            label="Color de Fondo"
          />

          <ColorPicker
            value={promotionBannerSettings.textColor}
            onChange={(color) =>
              setPromotionBannerSettings((prev) => ({
                ...prev,
                textColor: color,
              }))
            }
            label="Color del Texto"
          />

          {/* Vista previa del banner */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Vista Previa:</h4>
            <div
              className="w-full py-3 rounded"
              style={{
                backgroundColor: promotionBannerSettings.backgroundColor,
                color: promotionBannerSettings.textColor,
                fontFamily: promotionBannerSettings.fontFamily,
              }}
            >
              <div className="flex items-center justify-center text-center">
                {promotionBannerSettings.showIcon && <i className="ri-fire-line text-lg mr-3"></i>}
                <span className="font-bold">{promotionBannerSettings.text}</span>
                {promotionBannerSettings.showIcon && <i className="ri-fire-line text-lg ml-3"></i>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render principal del componente (modificado)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Banners</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-eye-line mr-2"></i>
            {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
          </button>
          <button
            onClick={saveSettings}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-save-line mr-2"></i>
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Navegación de secciones */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'home', label: 'Página Principal', icon: 'ri-home-line' },
            { id: 'menuIntro', label: 'Página de Entrada', icon: 'ri-door-open-line' },
            { id: 'menuHeader', label: 'Encabezado Menú', icon: 'ri-restaurant-line' },
            { id: 'menuStyle', label: 'Estilo del Menú', icon: 'ri-palette-line' },
            { id: 'promotion', label: 'Banner Promocional', icon: 'ri-fire-line' },
            { id: 'footer', label: 'Pie de Página', icon: 'ri-layout-bottom-line' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={`${section.icon} mr-2`}></i>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la sección activa */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeSection === 'home' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
              Banner Principal - Página de Inicio
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={homeSettings.title}
                    onChange={(e) =>
                      setHomeSettings((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="JOS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={homeSettings.subtitle}
                    onChange={(e) =>
                      setHomeSettings((prev) => ({
                        ...prev,
                        subtitle: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Sabores que Encienden tu Pasión"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={homeSettings.description}
                    onChange={(e) =>
                      setHomeSettings((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                    placeholder="Descripción del restaurante..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente
                  </label>
                  <select
                    value={homeSettings.fontFamily}
                    onChange={(e) =>
                      setHomeSettings((prev) => ({
                        ...prev,
                        fontFamily: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <ColorPicker
                  value={homeSettings.titleColor}
                  onChange={(color) =>
                    setHomeSettings((prev) => ({
                      ...prev,
                      titleColor: color,
                    }))
                  }
                  label="Color del Título"
                />

                <ColorPicker
                  value={homeSettings.subtitleColor}
                  onChange={(color) =>
                    setHomeSettings((prev) => ({
                      ...prev,
                      subtitleColor: color,
                    }))
                  }
                  label="Color del Subtítulo"
                />

                <ColorPicker
                  value={homeSettings.descriptionColor}
                  onChange={(color) =>
                    setHomeSettings((prev) => ({
                      ...prev,
                      descriptionColor: color,
                    }))
                  }
                  label="Color de la Descripción"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen de Fondo (máx. 500KB)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'home', 'backgroundImage')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {homeSettings.backgroundImage && (
                    <div className="mt-2">
                      <img
                        src={homeSettings.backgroundImage}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'menuIntro' && renderMenuIntroSection()}

        {activeSection === 'menuHeader' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Encabezado del Menú</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Marca
                  </label>
                  <input
                    type="text"
                    value={menuHeaderSettings.brandName}
                    onChange={(e) =>
                      setMenuHeaderSettings((prev) => ({
                        ...prev,
                        brandName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="JOS Restaurant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eslogan
                  </label>
                  <input
                    type="text"
                    value={menuHeaderSettings.slogan}
                    onChange={(e) =>
                      setMenuHeaderSettings((prev) => ({
                        ...prev,
                        slogan: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Sabores auténticos que conquistan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={menuHeaderSettings.description}
                    onChange={(e) =>
                      setMenuHeaderSettings((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                    placeholder="Descripción del menú..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <ColorPicker
                  value={menuHeaderSettings.brandColor}
                  onChange={(color) =>
                    setMenuHeaderSettings((prev) => ({
                      ...prev,
                      brandColor: color,
                    }))
                  }
                  label="Color de la Marca"
                />

                <ColorPicker
                  value={menuHeaderSettings.sloganColor}
                  onChange={(color) =>
                    setMenuHeaderSettings((prev) => ({
                      ...prev,
                      sloganColor: color,
                    }))
                  }
                  label="Color del Eslogan"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'menuStyle' && renderMenuStyleSection()}

        {activeSection === 'promotion' && renderPromotionSection()}

        {activeSection === 'footer' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Configuración Completa del Pie de Página</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Columna Izquierda */}
              <div className="space-y-6">
                {/* Configuración del Logo */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Logo y Marca</h4>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="logoVisible"
                      checked={footerSettings.logo.isVisible}
                      onChange={(e) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          logo: { ...prev.logo, isVisible: e.target.checked },
                        }))
                      }
                      className="mr-2"
                    />
                    <label htmlFor="logoVisible" className="text-sm font-medium text-gray-700">
                      Mostrar logo y marca
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Marca
                      </label>
                      <input
                        type="text"
                        value={footerSettings.logo.brandName}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            logo: { ...prev.logo, brandName: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="JOS"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo (máx. 500KB)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'footer', 'logoImage')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      {footerSettings.logo.logoImage && (
                        <div className="mt-2">
                          <img
                            src={footerSettings.logo.logoImage}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>

                    <ColorPicker
                      value={footerSettings.logo.brandColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          logo: { ...prev.logo, brandColor: color },
                        }))
                      }
                      label="Color de la Marca"
                    />
                  </div>
                </div>

                {/* Configuración de Quiénes Somos */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Sección "Quiénes Somos"</h4>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="aboutUsVisible"
                      checked={footerSettings.aboutUs.isVisible}
                      onChange={(e) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          aboutUs: { ...prev.aboutUs, isVisible: e.target.checked },
                        }))
                      }
                      className="mr-2"
                    />
                    <label htmlFor="aboutUsVisible" className="text-sm font-medium text-gray-700">
                      Mostrar sección "Quiénes Somos"
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Sección
                      </label>
                      <input
                        type="text"
                        value={footerSettings.aboutUs.title}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            aboutUs: { ...prev.aboutUs, title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Quiénes Somos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido
                      </label>
                      <textarea
                        value={footerSettings.aboutUs.content}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            aboutUs: { ...prev.aboutUs, content: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 text-sm"
                        placeholder="Descripción de la empresa..."
                      />
                    </div>

                    <ColorPicker
                      value={footerSettings.aboutUs.titleColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          aboutUs: { ...prev.aboutUs, titleColor: color },
                        }))
                      }
                      label="Color del Título"
                    />

                    <ColorPicker
                      value={footerSettings.aboutUs.contentColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          aboutUs: { ...prev.aboutUs, contentColor: color },
                        }))
                      }
                      label="Color del Contenido"
                    />
                  </div>
                </div>

                {/* Configuración de Contacto */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Información de Contacto</h4>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="contactVisible"
                      checked={footerSettings.contact.isVisible}
                      onChange={(e) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, isVisible: e.target.checked },
                        }))
                      }
                      className="mr-2"
                    />
                    <label htmlFor="contactVisible" className="text-sm font-medium text-gray-700">
                      Mostrar información de contacto
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Sección
                      </label>
                      <input
                        type="text"
                        value={footerSettings.contact.title}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Contacto"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={footerSettings.contact.phone}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, phone: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="+48 794 965 638"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={footerSettings.contact.email}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, email: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="contacto@jos-restaurant.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={footerSettings.contact.address}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, address: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Sosnowiec, Polonia"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIP
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showNip"
                          checked={footerSettings.contact.showNip}
                          onChange={(e) =>
                            setFooterSettings((prev) => ({
                              ...prev,
                              contact: { ...prev.contact, showNip: e.target.checked },
                            }))
                          }
                          className="mr-1"
                        />
                        <label htmlFor="showNip" className="text-xs text-gray-600 mr-2">Mostrar</label>
                        <input
                          type="text"
                          value={footerSettings.contact.nip}
                          onChange={(e) =>
                            setFooterSettings((prev) => ({
                              ...prev,
                              contact: { ...prev.contact, nip: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="NIP: 123456789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        REGON
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showRegon"
                          checked={footerSettings.contact.showRegon}
                          onChange={(e) =>
                            setFooterSettings((prev) => ({
                              ...prev,
                              contact: { ...prev.contact, showRegon: e.target.checked },
                            }))
                          }
                          className="mr-1"
                        />
                        <label htmlFor="showRegon" className="text-xs text-gray-600 mr-2">Mostrar</label>
                        <input
                          type="text"
                          value={footerSettings.contact.regon}
                          onChange={(e) =>
                            setFooterSettings((prev) => ({
                              ...prev,
                              contact: { ...prev.contact, regon: e.target.value },
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="REGON: 123333333"
                        />
                      </div>
                    </div>

                    <ColorPicker
                      value={footerSettings.contact.titleColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, titleColor: color },
                        }))
                      }
                      label="Color del Título"
                    />

                    <ColorPicker
                      value={footerSettings.contact.textColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, textColor: color },
                        }))
                      }
                      label="Color del Texto"
                    />
                  </div>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="space-y-6">
                {/* Configuración de Redes Sociales */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Redes Sociales</h4>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="socialVisible"
                      checked={footerSettings.socialMedia.isVisible}
                      onChange={(e) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, isVisible: e.target.checked },
                        }))
                      }
                      className="mr-2"
                    />
                    <label htmlFor="socialVisible" className="text-sm font-medium text-gray-700">
                      Mostrar redes sociales
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Sección
                      </label>
                      <input
                        type="text"
                        value={footerSettings.socialMedia.title}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Síguenos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        value={footerSettings.socialMedia.facebook}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, facebook: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="https://facebook.com/jos-restaurant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={footerSettings.socialMedia.instagram}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, instagram: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="https://instagram.com/jos-restaurant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter URL
                      </label>
                      <input
                        type="url"
                        value={footerSettings.socialMedia.twitter}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, twitter: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="https://twitter.com/jos-restaurant"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp (solo número)
                      </label>
                      <input
                        type="text"
                        value={footerSettings.socialMedia.whatsapp}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, whatsapp: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="+48794965638"
                      />
                    </div>

                    <ColorPicker
                      value={footerSettings.socialMedia.titleColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, titleColor: color },
                        }))
                      }
                      label="Color del Título"
                    />

                    <ColorPicker
                      value={footerSettings.socialMedia.iconColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, iconColor: color },
                        }))
                      }
                      label="Color de los Iconos"
                    />

                    <ColorPicker
                      value={footerSettings.socialMedia.iconHoverColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, iconHoverColor: color },
                        }))
                      }
                      label="Color de Iconos al Pasar el Mouse"
                    />
                  </div>
                </div>

                {/* Configuración de Políticas */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Políticas</h4>
                  
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="policiesVisible"
                      checked={footerSettings.policies.isVisible}
                      onChange={(e) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          policies: { ...prev.policies, isVisible: e.target.checked },
                        }))
                      }
                      className="mr-2"
                    />
                    <label htmlFor="policiesVisible" className="text-sm font-medium text-gray-700">
                      Mostrar políticas
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la Sección
                      </label>
                      <input
                        type="text"
                        value={footerSettings.policies.title}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            policies: { ...prev.policies, title: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Políticas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto "Política de Privacidad"
                      </label>
                      <input
                        type="text"
                        value={footerSettings.policies.privacyText}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            policies: { ...prev.policies, privacyText: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Política de Privacidad"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Política de Privacidad
                      </label>
                      <input
                        type="url"
                        value={footerSettings.policies.privacyPolicy}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            policies: { ...prev.policies, privacyPolicy: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="https://jos-restaurant.com/privacy"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto "Términos y Condiciones"
                      </label>
                      <input
                        type="text"
                        value={footerSettings.policies.termsText}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            policies: { ...prev.policies, termsText: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Términos y Condiciones"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Términos y Condiciones
                      </label>
                      <input
                        type="url"
                        value={footerSettings.policies.termsConditions}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            policies: { ...prev.policies, termsConditions: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="https://jos-restaurant.com/terms"
                      />
                    </div>

                    <ColorPicker
                      value={footerSettings.policies.titleColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          policies: { ...prev.policies, titleColor: color },
                        }))
                      }
                      label="Color del Título"
                    />

                    <ColorPicker
                      value={footerSettings.policies.linkColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          policies: { ...prev.policies, linkColor: color },
                        }))
                      }
                      label="Color de los Enlaces"
                    />

                    <ColorPicker
                      value={footerSettings.policies.linkHoverColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          policies: { ...prev.policies, linkHoverColor: color },
                        }))
                      }
                      label="Color de Enlaces al Pasar el Mouse"
                    />
                  </div>
                </div>

                {/* Configuración de Sección Legal */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Sección Legal (Parte Inferior)</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showCopyright"
                        checked={footerSettings.legalSection.showCopyright}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            legalSection: { ...prev.legalSection, showCopyright: e.target.checked },
                          }))
                        }
                        className="mr-2"
                      />
                      <label htmlFor="showCopyright" className="text-sm font-medium text-gray-700">
                        Mostrar texto de copyright
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto de Copyright
                      </label>
                      <input
                        type="text"
                        value={footerSettings.legalSection.copyrightText}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            legalSection: { ...prev.legalSection, copyrightText: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="© 2024 JOS Restaurante. Todos los derechos reservados."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showLegalText"
                        checked={footerSettings.legalSection.showLegalText}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            legalSection: { ...prev.legalSection, showLegalText: e.target.checked },
                          }))
                        }
                        className="mr-2"
                      />
                      <label htmlFor="showLegalText" className="text-sm font-medium text-gray-700">
                        Mostrar texto legal adicional
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto Legal Adicional
                        <span className="text-xs text-gray-500 block">
                          Usa \n para saltos de línea
                        </span>
                      </label>
                      <textarea
                        value={footerSettings.legalSection.legalText}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            legalSection: { ...prev.legalSection, legalText: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 text-sm"
                        placeholder="El administrador de los datos personales es JOS Restaurante, con sede en Sosnowiec.\nLa política de privacidad y cookies está disponible en [enlace a la política]."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showReaddy"
                        checked={footerSettings.legalSection.showReaddy}
                        onChange={(e) =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            legalSection: { ...prev.legalSection, showReaddy: e.target.checked },
                          }))
                        }
                        className="mr-2"
                      />
                      <label htmlFor="showReaddy" className="text-sm font-medium text-gray-700">
                        Mostrar enlace "Hecho con Readdy"
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto antes del enlace
                        </label>
                        <input
                          type="text"
                          value={footerSettings.legalSection.readyText}
                          onChange={(e) =>
                            setFooterSettings((prev) => ({
                              ...prev,
                              legalSection: { ...prev.legalSection, readyText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Hecho con"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto del enlace
                        </label>
                        <input
                          type="text"
                          value={footerSettings.legalSection.readyLinkText}
                          onChange={(e) =>
                            setFooterSettings((prev) => ({
                              ...prev,
                              legalSection: { ...prev.legalSection, readyLinkText: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Readdy"
                        />
                      </div>
                    </div>

                    <ColorPicker
                      value={footerSettings.legalSection.textColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          legalSection: { ...prev.legalSection, textColor: color },
                        }))
                      }
                      label="Color del Texto Legal"
                    />

                    <ColorPicker
                      value={footerSettings.legalSection.linkColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          legalSection: { ...prev.legalSection, linkColor: color },
                        }))
                      }
                      label="Color de los Enlaces"
                    />
                  </div>
                </div>

                {/* Configuración General del Footer */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Configuración General</h4>
                  
                  <div className="space-y-3">
                    <ColorPicker
                      value={footerSettings.backgroundColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          backgroundColor: color,
                        }))
                      }
                      label="Color de Fondo del Footer"
                    />

                    <ColorPicker
                      value={footerSettings.accentColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          accentColor: color,
                        }))
                      }
                      label="Color de Acento Principal"
                    />

                    <ColorPicker
                      value={footerSettings.borderColor}
                      onChange={(color) =>
                        setFooterSettings((prev) => ({
                          ...prev,
                          borderColor: color,
                        }))
                      }
                      label="Color de Bordes y Líneas"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vista previa del footer */}
            <div className="border border-gray-300 rounded-lg p-4 mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Vista Previa del Footer:</h4>
              <div 
                className="w-full p-6 rounded-lg text-white"
                style={{ backgroundColor: footerSettings.backgroundColor }}
              >
                <div className="grid grid-cols-4 gap-6 mb-6">
                  {/* Logo */}
                  {footerSettings.logo.isVisible && (
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full border-2 mr-2 flex items-center justify-center"
                             style={{ borderColor: footerSettings.accentColor, backgroundColor: footerSettings.accentColor }}>
                          <i className="ri-fire-line text-sm text-black"></i>
                        </div>
                        <h3 className="font-['Pacifico'] text-lg" style={{ color: footerSettings.logo.brandColor }}>
                          {footerSettings.logo.brandName}
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Quiénes Somos */}
                  {footerSettings.aboutUs.isVisible && (
                    <div>
                      <h4 className="font-bold mb-2 border-b pb-1" 
                          style={{ 
                            color: footerSettings.aboutUs.titleColor,
                            borderColor: footerSettings.borderColor 
                          }}>
                        {footerSettings.aboutUs.title}
                      </h4>
                      <p className="text-xs leading-relaxed" style={{ color: footerSettings.aboutUs.contentColor }}>
                        {footerSettings.aboutUs.content.substring(0, 80)}...
                      </p>
                    </div>
                  )}

                  {/* Contacto */}
                  {footerSettings.contact.isVisible && (
                    <div>
                      <h4 className="font-bold mb-2 border-b pb-1" 
                          style={{ 
                            color: footerSettings.contact.titleColor,
                            borderColor: footerSettings.borderColor 
                          }}>
                        {footerSettings.contact.title}
                      </h4>
                      <div className="space-y-1 text-xs" style={{ color: footerSettings.contact.textColor }}>
                        <div className="flex items-center">
                          <i className="ri-phone-line mr-2" style={{ color: footerSettings.accentColor }}></i>
                          <span>{footerSettings.contact.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-mail-line mr-2" style={{ color: footerSettings.accentColor }}></i>
                          <span>{footerSettings.contact.email}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-map-pin-line mr-2" style={{ color: footerSettings.accentColor }}></i>
                          <span>{footerSettings.contact.address}</span>
                        </div>
                        {footerSettings.contact.showNip && (
                          <div className="flex items-center">
                            <i className="ri-file-text-line mr-2" style={{ color: footerSettings.accentColor }}></i>
                            <span>{footerSettings.contact.nip}</span>
                          </div>
                        )}
                        {footerSettings.contact.showRegon && (
                          <div className="flex items-center">
                            <i className="ri-file-list-line mr-2" style={{ color: footerSettings.accentColor }}></i>
                            <span>{footerSettings.contact.regon}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Redes Sociales y Políticas */}
                  <div>
                    {/* Redes Sociales */}
                    {footerSettings.socialMedia.isVisible && (
                      <div className="mb-4">
                        <h4 className="font-bold mb-2 border-b pb-1" 
                            style={{ 
                              color: footerSettings.socialMedia.titleColor,
                              borderColor: footerSettings.borderColor 
                            }}>
                          {footerSettings.socialMedia.title}
                        </h4>
                        <div className="flex space-x-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                               style={{ backgroundColor: footerSettings.socialMedia.iconColor }}>
                            <i className="ri-facebook-fill"></i>
                          </div>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                               style={{ backgroundColor: footerSettings.socialMedia.iconColor }}>
                            <i className="ri-instagram-line"></i>
                          </div>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                               style={{ backgroundColor: footerSettings.socialMedia.iconColor }}>
                            <i className="ri-twitter-line"></i>
                          </div>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                               style={{ backgroundColor: footerSettings.socialMedia.iconColor }}>
                            <i className="ri-whatsapp-line"></i>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Políticas */}
                    {footerSettings.policies.isVisible && (
                      <div>
                        <h4 className="font-bold mb-2 border-b pb-1" 
                            style={{ 
                              color: footerSettings.policies.titleColor,
                              borderColor: footerSettings.borderColor 
                            }}>
                          {footerSettings.policies.title}
                        </h4>
                        <div className="space-y-1 text-xs">
                          <div style={{ color: footerSettings.policies.linkColor }}>
                            {footerSettings.policies.privacyText}
                          </div>
                          <div style={{ color: footerSettings.policies.linkColor }}>
                            {footerSettings.policies.termsText}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sección Legal */}
                <div className="border-t pt-4" style={{ borderColor: footerSettings.borderColor }}>
                  <div className="flex justify-between items-center text-xs">
                    <div style={{ color: footerSettings.legalSection.textColor }}>
                      {footerSettings.legalSection.showCopyright && (
                        <p className="mb-1">{footerSettings.legalSection.copyrightText}</p>
                      )}
                      {footerSettings.legalSection.showLegalText && footerSettings.legalSection.legalText && (
                        <div>
                          {footerSettings.legalSection.legalText.split('\n').slice(0, 2).map((line, index) => (
                            <p key={index} className="mb-1">{line.substring(0, 60)}...</p>
                          ))}
                        </div>
                      )}
                    </div>
                    {footerSettings.legalSection.showReaddy && (
                      <div className="flex items-center" style={{ color: footerSettings.legalSection.textColor }}>
                        <span>{footerSettings.legalSection.readyText}</span>
                        <span className="ml-1" style={{ color: footerSettings.legalSection.linkColor }}>
                          {footerSettings.legalSection.readyLinkText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vista previa simplificada */}
      {showPreview && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Vista Previa de Cambios</h3>
          <div className="space-y-4">
            {activeSection === 'promotion' && promotionBannerSettings.isActive && (
              <div
                className="w-full py-3 rounded text-center"
                style={{
                  backgroundColor: promotionBannerSettings.backgroundColor,
                  color: promotionBannerSettings.textColor,
                  fontFamily: promotionBannerSettings.fontFamily,
                }}
              >
                <div className="flex items-center justify-center">
                  {promotionBannerSettings.showIcon && (
                    <i className="ri-fire-line text-lg mr-3"></i>
                  )}
                  <span className="font-bold">{promotionBannerSettings.text}</span>
                  {promotionBannerSettings.showIcon && (
                    <i className="ri-fire-line text-lg ml-3"></i>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
