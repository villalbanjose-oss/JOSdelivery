
'use client';
import { useState, useEffect } from 'react';

export default function PromotionBanner() {
  const [bannerSettings, setBannerSettings] = useState({
    isActive: true,
    text: 'Hoy 2x1 en hamburguesas',
    backgroundColor: '#FF6B35',
    textColor: '#FFFFFF',
    showIcon: true,
    animationType: 'slide',
    fontFamily: 'Inter'
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      try {
        const savedBannerSettings = localStorage.getItem('promotionBannerSettings');
        if (savedBannerSettings) {
          const parsed = JSON.parse(savedBannerSettings);
          setBannerSettings(parsed);
        }
        setIsLoaded(true);
      } catch (e) {
        console.error('Error parsing banner settings:', e);
        setIsLoaded(true);
      }
    }

    // Escuchar cambios en la configuración - SOLO SI YA ESTÁ CARGADO
    const handleSettingsUpdate = () => {
      if (isLoaded) {
        try {
          const updatedSettings = localStorage.getItem('promotionBannerSettings');
          if (updatedSettings) {
            const parsed = JSON.parse(updatedSettings);
            setBannerSettings(parsed);
          }
        } catch (e) {
          console.error('Error parsing updated banner settings:', e);
        }
      }
    };

    window.addEventListener('bannerSettingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('bannerSettingsUpdated', handleSettingsUpdate);
  }, [isLoaded]);

  useEffect(() => {
    if (bannerSettings.isActive && isLoaded) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [bannerSettings.isActive, isLoaded]);

  if (!bannerSettings.isActive || !isLoaded) {
    return null;
  }

  const slideAnimation = isVisible 
    ? 'transform translate-y-0 opacity-100' 
    : 'transform -translate-y-full opacity-0';

  const fadeAnimation = isVisible 
    ? 'opacity-100' 
    : 'opacity-0';

  const animationClass = bannerSettings.animationType === 'slide' ? slideAnimation : fadeAnimation;

  return (
    <div 
      className={`w-full transition-all duration-500 ease-out ${animationClass}`}
      style={{ 
        backgroundColor: bannerSettings.backgroundColor,
        color: bannerSettings.textColor,
        fontFamily: bannerSettings.fontFamily
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center text-center">
          {bannerSettings.showIcon && (
            <div className="w-6 h-6 flex items-center justify-center mr-3">
              <i 
                className="ri-fire-line text-lg animate-pulse" 
                aria-hidden="true"
                style={{ color: bannerSettings.textColor }}
              ></i>
            </div>
          )}
          
          <div className="flex items-center">
            <span className="font-bold text-base">
              {bannerSettings.text}
            </span>
          </div>

          {bannerSettings.showIcon && (
            <div className="w-6 h-6 flex items-center justify-center ml-3">
              <i 
                className="ri-fire-line text-lg animate-pulse" 
                aria-hidden="true"
                style={{ color: bannerSettings.textColor }}
              ></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}