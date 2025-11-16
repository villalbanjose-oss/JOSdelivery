'use client';
import { useEffect, useState } from 'react';

export default function OrderNotification() {
  const [hasNewOrder, setHasNewOrder] = useState(false);

  useEffect(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhJSJq1+mxZhwGOZHX8sx5KQYZHZXO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwF');

    const checkForNewOrders = () => {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const lastOrderCount = parseInt(localStorage.getItem('lastOrderCount') || '0');
      
      if (orders.length > lastOrderCount) {
        setHasNewOrder(true);
        
        // Reproducir sonido
        audio.play().catch(() => {});
        
        // Mostrar notificación del navegador
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('¡Nuevo Pedido JOS!', {
            body: 'Ha llegado un nuevo pedido al sistema',
            icon: '/favicon.ico'
          });
        }
        
        localStorage.setItem('lastOrderCount', orders.length.toString());
        
        // Ocultar notificación después de 5 segundos
        setTimeout(() => setHasNewOrder(false), 5000);
      }
    };

    // Verificar cada 3 segundos
    const interval = setInterval(checkForNewOrders, 3000);
    
    // Pedir permiso para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, []);

  if (!hasNewOrder) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-orange-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-bounce">
      <div className="flex items-center">
        <div className="w-8 h-8 mr-3">
          <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center animate-pulse" 
               style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
            <i className="ri-notification-line text-sm text-gray-800"></i>
          </div>
        </div>
        <div>
          <h3 className="font-bold">¡Nuevo Pedido!</h3>
          <p className="text-sm">Se ha recibido un pedido</p>
        </div>
      </div>
    </div>
  );
}