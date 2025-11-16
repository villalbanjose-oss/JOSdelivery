
'use client';
import { useState, useEffect } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [businessData, setBusinessData] = useState({
    name: 'JOS Restaurant',
    whatsapp: '794965638',
    email: 'contacto@jos-restaurant.com',
    city: 'Sosnowiec',
    country: 'Polonia',
    address: 'Calle Principal 123'
  });

  useEffect(() => {
    const savedBusinessData = localStorage.getItem('businessSettings');
    if (savedBusinessData) {
      try {
        const parsed = JSON.parse(savedBusinessData);
        setBusinessData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error parsing businessSettings:', e);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleWhatsAppClick = () => {
    const phoneNumber = (businessData.whatsapp || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`¡Hola! Me gustaría hacer un pedido en ${businessData.name || 'JOS Restaurant'}.`);
    window.open(`https://wa.me/48${phoneNumber}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Consulta - ${businessData.name || 'JOS Restaurant'}`);
    const body = encodeURIComponent(`Hola,\n\nMe gustaría hacer una consulta sobre sus servicios.\n\nGracias.`);
    window.open(`mailto:${businessData.email || 'contacto@jos-restaurant.com'}?subject=${subject}&body=${body}`, '_blank');
  };

  const handlePhoneClick = () => {
    const phoneNumber = (businessData.whatsapp || '').replace(/[^0-9]/g, '');
    window.open(`tel:+48${phoneNumber}`, '_self');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Contacto</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Información del Negocio */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4">
              <div className="w-full h-full rounded-full border-4 border-yellow-400 flex items-center justify-center" 
                   style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
                <i className="ri-fire-line text-3xl text-black"></i>
              </div>
            </div>
            <h3 className="font-['Pacifico'] text-3xl text-yellow-600 mb-2">{businessData.name}</h3>
            <p className="text-gray-600">Comida rápida de calidad</p>
          </div>

          {/* Opciones de Contacto */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl flex items-center transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <i className="ri-whatsapp-fill text-green-500 text-2xl"></i>
              </div>
              <div className="text-left">
                <h4 className="font-semibold">WhatsApp</h4>
                <p className="text-sm opacity-90">+48 {businessData.whatsapp}</p>
              </div>
            </button>

            {/* Teléfono */}
            <button
              onClick={handlePhoneClick}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl flex items-center transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <i className="ri-phone-fill text-blue-500 text-2xl"></i>
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Teléfono</h4>
                <p className="text-sm opacity-90">+48 {businessData.whatsapp}</p>
              </div>
            </button>

            {/* Email */}
            <button
              onClick={handleEmailClick}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl flex items-center transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <i className="ri-mail-fill text-red-500 text-2xl"></i>
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm opacity-90">{businessData.email}</p>
              </div>
            </button>
          </div>

          {/* Información de Ubicación */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center mb-3">
              <i className="ri-map-pin-line text-yellow-600 text-xl mr-3"></i>
              <h4 className="font-semibold text-gray-800">Ubicación</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {businessData.address}<br />
              {businessData.city}, {businessData.country}
            </p>
          </div>

          {/* Horarios */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
            <div className="flex items-center mb-3">
              <i className="ri-time-line text-yellow-600 text-xl mr-3"></i>
              <h4 className="font-semibold text-gray-800">Horarios de Atención</h4>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Lunes - Viernes:</span>
                <span>11:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado - Domingo:</span>
                <span>12:00 - 23:00</span>
              </div>
            </div>
          </div>

          {/* Botón de Cerrar */}
          <button
            onClick={onClose}
            className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}