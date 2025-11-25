'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { cleanMultiLanguageData } from '../lib/menuData';

export default function HomePage() {
  const [homeSettings, setHomeSettings] = useState({
    title: 'JOS',
    subtitle: 'Sabores que Encienden tu Pasión',
    description: 'Descubre nuestras deliciosas hamburguesas, hot dogs, burritos y bebidas. Personaliza tu pedido y disfruta de sabores únicos.',
    fontFamily: 'Pacifico',
    backgroundImage: '',
    useCustomBackground: false
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

  const [businessStatus, setBusinessStatus] = useState({ isOpen: true, message: '' });
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      cleanMultiLanguageData();

      const savedHomeSettings = localStorage.getItem('homeSettings');
      if (savedHomeSettings) {
        try {
          const parsed = JSON.parse(savedHomeSettings);
          setHomeSettings(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Error parsing homeSettings:', e);
        }
      }

      const savedScheduleSettings = localStorage.getItem('scheduleSettings');
      if (savedScheduleSettings) {
        try {
          const parsed = JSON.parse(savedScheduleSettings);
          setScheduleSettings(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Error parsing scheduleSettings:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateBusinessStatus = () => {
      if (typeof window === 'undefined') return;

      if (!scheduleSettings.isEnabled) {
        setBusinessStatus({ isOpen: true, message: '' });
        return;
      }

      const now = new Date();
      const currentDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][now.getDay()];
      const currentTime = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
      const todaySchedule = scheduleSettings.schedule[currentDay as keyof typeof scheduleSettings.schedule];
      
      const dayNames = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
      };

      if (!todaySchedule.enabled) {
        setBusinessStatus({ 
          isOpen: false, 
          message: `Hoy ${dayNames[currentDay as keyof typeof dayNames]}: ${scheduleSettings.closedMessage}`
        });
        return;
      }
      
      const isOpen = currentTime >= todaySchedule.open && currentTime <= todaySchedule.close;
      setBusinessStatus({ 
        isOpen, 
        message: `Hoy ${dayNames[currentDay as keyof typeof dayNames]}: ${isOpen ? 'ABIERTO' : 'CERRADO'} (${todaySchedule.open} - ${todaySchedule.close})`
      });
    };

    calculateBusinessStatus();

    intervalRef.current = setInterval(() => {
      calculateBusinessStatus();
    }, 60000);

    const handleScheduleUpdate = () => {
      const savedScheduleSettings = localStorage.getItem('scheduleSettings');
      if (savedScheduleSettings) {
        try {
          const parsed = JSON.parse(savedScheduleSettings);
          setScheduleSettings(parsed);
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
  }, [mounted, scheduleSettings.isEnabled, scheduleSettings.closedMessage, scheduleSettings.schedule]);

  const backgroundStyle = homeSettings.useCustomBackground && homeSettings.backgroundImage
    ? { backgroundImage: `url(${homeSettings.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' };

  if (!mounted) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full"></div>
              <div className="h-12 bg-white/20 rounded mb-4 max-w-md mx-auto"></div>
              <div className="h-6 bg-white/20 rounded mb-8 max-w-lg mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full border-8 border-white flex items-center justify-center shadow-2xl" 
                   style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
                <i className="ri-fire-line text-6xl text-white"></i>
              </div>
            </div>
            <h1 className={`font-['${homeSettings.fontFamily}'] text-6xl text-white mb-4 drop-shadow-lg`}>
              {homeSettings.title}
            </h1>
            <p className="text-2xl text-white/90 mb-8 drop-shadow">
              {homeSettings.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/menu">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <i className="ri-restaurant-line text-3xl text-white"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ver Menú</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {homeSettings.description}
                </p>
                
                {scheduleSettings.isEnabled && (
                  <div className={`mb-4 p-3 rounded-lg ${businessStatus.isOpen ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center justify-center">
                      <i className={`ri-time-line mr-2 ${businessStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}></i>
                      <span className={`text-sm font-medium ${businessStatus.isOpen ? 'text-green-800' : 'text-red-800'}`}>
                        {businessStatus.message}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className={`mt-6 inline-flex items-center font-semibold ${businessStatus.isOpen ? 'text-orange-600' : 'text-gray-500'}`}>
                  {businessStatus.isOpen ? 'Ordenar Ahora' : 'Ver Menú'}
                  <i className="ri-arrow-right-line ml-2"></i>
                </div>
              </div>
            </Link>

            <Link href="/admin">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <i className="ri-settings-line text-3xl text-white"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Panel de Administración</h2>
                <p className="text-gray-600 leading-relaxed">
                  Gestiona productos, pedidos, ventas y configuraciones. 
                  Acceso completo para administradores del restaurante.
                </p>
                <div className="mt-6 inline-flex items-center text-blue-600 font-semibold">
                  Acceder al Panel
                  <i className="ri-arrow-right-line ml-2"></i>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">¿Por qué elegir {homeSettings.title}?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-white/90">
              <div className="text-center">
                <i className="ri-time-line text-3xl mb-2"></i>
                <p className="font-semibold">Rápido</p>
                <p className="text-sm">Pedidos listos en minutos</p>
              </div>
              <div className="text-center">
                <i className="ri-heart-line text-3xl mb-2"></i>
                <p className="font-semibold">Fresco</p>
                <p className="text-sm">Ingredientes de calidad</p>
              </div>
              <div className="text-center">
                <i className="ri-star-line text-3xl mb-2"></i>
                <p className="font-semibold">Único</p>
                <p className="text-sm">Sabores auténticos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
