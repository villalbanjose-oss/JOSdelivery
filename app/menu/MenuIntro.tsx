
'use client';
import { useState, useEffect } from 'react';

interface MenuIntroProps {
  onOrderNowClick: () => void;
}

export default function MenuIntro({ onOrderNowClick }: MenuIntroProps) {
  const [settings, setSettings] = useState({
    title: 'JOS Restaurant',
    subtitle: 'Sabores auténticos que conquistan',
    description: 'Descubre nuestra deliciosa selección de hamburguesas gourmet, hot dogs artesanales, burritos frescos y bebidas refrescantes. Cada plato preparado con ingredientes de la más alta calidad.',
    phone: '+48 794 965 638',
    location: 'Sosnowiec, Polonia',
    additionalInfo: 'Abierto todos los días • Entrega a domicilio disponible',
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

  const [scheduleInfo, setScheduleInfo] = useState({
    isOpen: true,
    message: 'Abierto Ahora',
    displayText: 'Todos los días de 10:00 a 23:00'
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Función para obtener el estado actual del negocio desde la configuración de horarios
  const getCurrentBusinessStatus = () => {
    try {
      const savedScheduleSettings = localStorage.getItem('scheduleSettings');
      if (!savedScheduleSettings) {
        return {
          isOpen: true,
          message: 'Abierto Ahora',
          displayText: 'Horario no configurado'
        };
      }

      const scheduleSettings = JSON.parse(savedScheduleSettings);
      
      if (!scheduleSettings.isEnabled) {
        return {
          isOpen: true,
          message: 'Abierto Ahora',
          displayText: 'Horario no configurado'
        };
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

      const dayNames = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
      };

      const todaySchedule = scheduleSettings.schedule[currentDay];

      if (!todaySchedule.enabled) {
        return {
          isOpen: false,
          message: scheduleSettings.closedMessage || 'Cerrado por ahora',
          displayText: `Hoy ${dayNames[currentDay]}: Cerrado`
        };
      }

      const isOpen =
        currentTime >= todaySchedule.open && currentTime <= todaySchedule.close;
      
      return {
        isOpen,
        message: isOpen ? 'Abierto Ahora' : (scheduleSettings.closedMessage || 'Cerrado por ahora'),
        displayText: `Hoy ${dayNames[currentDay]}: ${todaySchedule.open} - ${todaySchedule.close}`
      };
    } catch (error) {
      console.error('Error getting business status:', error);
      return {
        isOpen: true,
        message: 'Abierto Ahora',
        displayText: 'Horario no disponible'
      };
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('menuIntroSettings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }

        // Cargar estado actual del horario
        const businessStatus = getCurrentBusinessStatus();
        setScheduleInfo(businessStatus);
      } catch (error) {
        console.error('Error loading menu intro settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();

    // Escuchar cambios en la configuración de horarios
    const handleScheduleUpdate = () => {
      const businessStatus = getCurrentBusinessStatus();
      setScheduleInfo(businessStatus);
    };

    // Escuchar cambios en configuración de negocio
    const handleBusinessSettingsUpdate = () => {
      loadSettings();
    };

    window.addEventListener('scheduleUpdated', handleScheduleUpdate);
    window.addEventListener('bannerSettingsUpdated', loadSettings);
    window.addEventListener('businessSettingsUpdated', handleBusinessSettingsUpdate);

    // Actualizar cada minuto para mantener el horario actualizado
    const interval = setInterval(() => {
      const businessStatus = getCurrentBusinessStatus();
      setScheduleInfo(businessStatus);
    }, 60000);

    return () => {
      window.removeEventListener('scheduleUpdated', handleScheduleUpdate);
      window.removeEventListener('bannerSettingsUpdated', loadSettings);
      window.removeEventListener('businessSettingsUpdated', handleBusinessSettingsUpdate);
      clearInterval(interval);
    };
  }, [isMounted]);

  const handleOrderNow = () => {
    onOrderNowClick();
  };

  // Determinar la imagen de fondo
  const backgroundImageUrl = settings.backgroundImage || 
    `https://readdy.ai/api/search-image?query=delicious%20restaurant%20food%20background%20with%20hamburgers%20hot%20dogs%20burritos%20and%20drinks%20on%20wooden%20table%20warm%20lighting%20cozy%20atmosphere%20professional%20food%20photography%20high%20quality%20appetizing&width=1920&height=1080&seq=menu-hero-bg&orientation=landscape`;

  if (!isMounted || !isLoaded) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black" suppressHydrationWarning={true}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" suppressHydrationWarning={true}>
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImageUrl}')`
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${settings.overlayOpacity / 100})`
          }}
        ></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-6 sm:space-y-8">
          {/* Logo y nombre */}
          <div className="space-y-4">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-2xl"
              style={{
                fontFamily: settings.fontFamily,
                color: settings.titleColor
              }}
            >
              {settings.title}
            </h1>
            <p 
              className="text-xl sm:text-2xl md:text-3xl font-light drop-shadow-lg"
              style={{
                color: settings.subtitleColor
              }}
            >
              {settings.subtitle}
            </p>
          </div>

          {/* Estado del horario */}
          <div className="space-y-2">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              scheduleInfo.isOpen 
                ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                : 'bg-red-500/20 text-red-300 border border-red-400/30'
            }`}>
              <i className={`${scheduleInfo.isOpen ? 'ri-time-line' : 'ri-close-circle-line'} mr-2`}></i>
              {scheduleInfo.message}
            </div>
            <p className="text-sm opacity-75" style={{ color: settings.additionalInfoColor }}>
              {scheduleInfo.displayText}
            </p>
          </div>

          {/* Descripción */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p 
              className="text-base sm:text-lg md:text-xl leading-relaxed drop-shadow-md"
              style={{
                color: settings.descriptionColor
              }}
            >
              {settings.description}
            </p>
            
            {settings.showFeatures && (
              <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
                <div className="flex items-center" style={{ color: settings.featuresColor }}>
                  <i className="ri-time-line mr-2"></i>
                  <span>{settings.feature1}</span>
                </div>
                <div className="flex items-center" style={{ color: settings.featuresColor }}>
                  <i className="ri-star-fill mr-2"></i>
                  <span>{settings.feature2}</span>
                </div>
                <div className="flex items-center" style={{ color: settings.featuresColor }}>
                  <i className="ri-heart-fill mr-2"></i>
                  <span>{settings.feature3}</span>
                </div>
              </div>
            )}
          </div>

          {/* Botón principal */}
          <div className="pt-4">
            <button
              onClick={handleOrderNow}
              className="w-full text-base sm:text-lg md:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
              style={{ 
                backgroundColor: settings.buttonColor,
                color: settings.buttonTextColor
              }}
            >
              <i className="ri-restaurant-line mr-2 sm:mr-3"></i>
              {settings.buttonText}
            </button>
          </div>

          {/* Información adicional */}
          <div className="pt-6 space-y-3">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
              <div className="flex items-center">
                <i className="ri-phone-line mr-2" style={{ color: settings.phoneColor }}></i>
                <span style={{ color: settings.phoneColor }}>{settings.phone}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-map-pin-line mr-2" style={{ color: settings.locationColor }}></i>
                <span style={{ color: settings.locationColor }}>{settings.location}</span>
              </div>
            </div>
            
            <p 
              className="text-xs"
              style={{ color: settings.additionalInfoColor }}
            >
              {settings.additionalInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
