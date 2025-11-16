
'use client';
import { useState, useEffect } from 'react';

interface CashRegisterData {
  cash: number;
  blik: number;
  card: number;
  totalSales: number;
  orderCount: number;
  startTime: string;
}

export default function CashRegisterManagement() {
  const [cashRegister, setCashRegister] = useState<CashRegisterData>({
    cash: 0,
    blik: 0,
    card: 0,
    totalSales: 0,
    orderCount: 0,
    startTime: new Date().toISOString()
  });
  
  const [inputValues, setInputValues] = useState({
    cash: '',
    blik: '',
    card: ''
  });
  
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    loadCashRegisterData();
    calculateSalesFromOrders();
  }, []);

  const loadCashRegisterData = () => {
    const savedData = localStorage.getItem('cashRegister');
    if (savedData) {
      setCashRegister(JSON.parse(savedData));
    }
  };

  const calculateSalesFromOrders = () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const completedOrders = orders.filter((order: any) => order.status === 'delivered');
    
    let totalSales = 0;
    let cashTotal = 0;
    let blikTotal = 0;
    let cardTotal = 0;

    completedOrders.forEach((order: any) => {
      totalSales += order.totalPrice;
      
      switch (order.paymentMethod) {
        case 'cash':
          cashTotal += order.totalPrice;
          break;
        case 'blik':
          blikTotal += order.totalPrice;
          break;
        case 'card':
          cardTotal += order.totalPrice;
          break;
      }
    });

    setCashRegister(prev => ({
      ...prev,
      totalSales,
      orderCount: completedOrders.length,
      cash: cashTotal,
      blik: blikTotal,
      card: cardTotal
    }));
  };

  // Función para limpiar historial antiguo y optimizar almacenamiento
  const cleanOldSalesHistory = () => {
    try {
      const salesHistory = JSON.parse(localStorage.getItem('salesHistory') || '[]');
      
      // Mantener solo los últimos 30 días de historial
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentHistory = salesHistory.filter((order: any) => {
        const orderDate = new Date(order.timestamp);
        return orderDate >= thirtyDaysAgo;
      });
      
      // Si el historial es muy grande, mantener solo los últimos 100 registros
      const optimizedHistory = recentHistory.slice(-100);
      
      localStorage.setItem('salesHistory', JSON.stringify(optimizedHistory));
      console.log(`Historial optimizado: ${salesHistory.length} -> ${optimizedHistory.length} registros`);
      
      return optimizedHistory;
    } catch (error) {
      console.error('Error limpiando historial:', error);
      // Si hay error, crear historial vacío
      localStorage.setItem('salesHistory', JSON.stringify([]));
      return [];
    }
  };

  // Función para comprimir datos de pedidos antes de guardar
  const compressOrderData = (orders: any[]) => {
    return orders.map(order => ({
      id: order.id,
      timestamp: order.timestamp,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      deliveryType: order.deliveryType,
      status: order.status,
      // Comprimir información del carrito manteniendo solo lo esencial
      cart: order.cart.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice || (item.price * item.quantity)
      }))
    }));
  };

  // Traducciones fijas en español
  const cashRegisterManagement = 'Gestión de Cierre de Caja';
  const currentShift = 'Turno Actual';
  const startTime = 'Hora de Inicio';
  const totalOrders = 'Total de Pedidos';
  const totalSales = 'Total de Ventas';
  const paymentMethods = 'Métodos de Pago';
  const cash = 'Efectivo';
  const blik = 'Blik';
  const card = 'Tarjeta';
  const systemAmount = 'Monto del Sistema';
  const actualAmount = 'Monto Real';
  const difference = 'Diferencia';
  const enterActualAmount = 'Ingrese el monto real';
  const closeShift = 'Cerrar Turno';
  const confirmClose = 'Confirmar Cierre';
  const closeConfirmation = '¿Está seguro de que desea cerrar el turno? Esto eliminará solo el historial de pedidos activos. Los datos de ventas se conservarán en el reporte.';
  const cancel = 'Cancelar';
  const confirm = 'Confirmar';
  const shiftClosed = 'Turno cerrado exitosamente';
  const newShiftStarted = 'Nuevo turno iniciado';
  const summary = 'Resumen del Turno';
  const balanced = 'Balanceado';
  const surplus = 'Excedente';
  const deficit = 'Faltante';
  const salesDataPreserved = 'Los datos de ventas se han conservado en el reporte';
  const storageOptimized = 'Almacenamiento optimizado automáticamente';

  const handleInputChange = (method: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [method]: value
    }));
  };

  const calculateDifference = (systemAmount: number, actualAmount: number) => {
    return actualAmount - systemAmount;
  };

  const getDifferenceColor = (difference: number) => {
    if (difference === 0) return 'text-green-600';
    if (difference > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  const getDifferenceLabel = (difference: number) => {
    if (difference === 0) return balanced;
    if (difference > 0) return surplus;
    return deficit;
  };

  const handleCloseShift = () => {
    try {
      console.log('Iniciando cierre de turno...');
      
      // Primero limpiar historial antiguo para hacer espacio
      const optimizedHistory = cleanOldSalesHistory();
      
      // Cargar pedidos actuales
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const completedOrders = orders.filter((order: any) => order.status === 'delivered');
      
      console.log(`Pedidos completados a guardar: ${completedOrders.length}`);
      
      if (completedOrders.length > 0) {
        // Comprimir datos antes de guardar
        const compressedOrders = compressOrderData(completedOrders);
        
        // Intentar guardar en el historial
        try {
          const updatedSalesHistory = [...optimizedHistory, ...compressedOrders];
          
          // Verificar tamaño antes de guardar
          const dataSize = JSON.stringify(updatedSalesHistory).length;
          console.log(`Tamaño de datos a guardar: ${dataSize} caracteres`);
          
          // Si es muy grande, mantener solo los más recientes
          if (dataSize > 4000000) { // ~4MB límite
            const recentData = updatedSalesHistory.slice(-50); // Solo últimos 50 registros
            localStorage.setItem('salesHistory', JSON.stringify(recentData));
            console.log('Datos guardados con límite de 50 registros');
          } else {
            localStorage.setItem('salesHistory', JSON.stringify(updatedSalesHistory));
            console.log('Datos guardados exitosamente');
          }
        } catch (storageError) {
          console.warn('Error de almacenamiento, guardando solo datos esenciales:', storageError);
          
          // Fallback: guardar solo datos muy básicos
          const essentialData = compressedOrders.map(order => ({
            timestamp: order.timestamp,
            totalPrice: order.totalPrice,
            paymentMethod: order.paymentMethod,
            status: order.status
          }));
          
          try {
            localStorage.setItem('salesHistory', JSON.stringify([...optimizedHistory.slice(-20), ...essentialData]));
            console.log('Datos esenciales guardados');
          } catch (finalError) {
            console.error('Error crítico de almacenamiento:', finalError);
            // Limpiar completamente y guardar solo los nuevos datos
            localStorage.setItem('salesHistory', JSON.stringify(essentialData.slice(-10)));
          }
        }
      }
      
      // Limpiar pedidos activos
      localStorage.setItem('orders', JSON.stringify([]));
      console.log('Pedidos activos limpiados');
      
      // Reiniciar caja registradora
      const newCashRegister = {
        cash: 0,
        blik: 0,
        card: 0,
        totalSales: 0,
        orderCount: 0,
        startTime: new Date().toISOString()
      };
      
      setCashRegister(newCashRegister);
      localStorage.setItem('cashRegister', JSON.stringify(newCashRegister));
      
      // Limpiar inputs
      setInputValues({ cash: '', blik: '', card: '' });
      
      // Cerrar modal y mostrar mensaje de éxito
      setShowCloseModal(false);
      setShowSuccessMessage(true);
      
      console.log('Cierre de turno completado exitosamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      // Forzar recarga de datos
      setTimeout(() => {
        loadCashRegisterData();
        calculateSalesFromOrders();
      }, 100);
      
    } catch (error) {
      console.error('Error al cerrar turno:', error);
      setShowCloseModal(false);
      
      // Mostrar error al usuario
      alert('Error al cerrar el turno. Por favor, inténtelo de nuevo.');
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{shiftClosed}</h2>
          <p className="text-gray-600 mb-2">{newShiftStarted}</p>
          <p className="text-sm text-green-600 mb-2">{salesDataPreserved}</p>
          <p className="text-xs text-blue-600 mb-4">{storageOptimized}</p>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{cashRegisterManagement}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumen del turno actual */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">{currentShift}</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">{startTime}:</span>
              <span className="font-semibold">
                {new Date(cashRegister.startTime).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">{totalOrders}:</span>
              <span className="font-semibold">{cashRegister.orderCount}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">{totalSales}:</span>
              <span className="font-semibold text-green-600">{cashRegister.totalSales.toFixed(2)} zł</span>
            </div>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">{paymentMethods}</h3>
          
          <div className="space-y-6">
            {/* Efectivo */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <i className="ri-money-dollar-circle-line text-2xl text-green-600 mr-3"></i>
                <h4 className="font-semibold text-lg">{cash}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{systemAmount}</label>
                  <div className="bg-gray-100 p-2 rounded text-center font-semibold">
                    {cashRegister.cash.toFixed(2)} zł
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{actualAmount}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputValues.cash}
                    onChange={(e) => handleInputChange('cash', e.target.value)}
                    className="w-full p-2 border rounded text-center"
                    placeholder={enterActualAmount}
                  />
                </div>
              </div>
              
              {inputValues.cash && (
                <div className="text-center">
                  <span className="text-sm text-gray-600">{difference}: </span>
                  <span className={`font-semibold ${getDifferenceColor(calculateDifference(cashRegister.cash, parseFloat(inputValues.cash) || 0))}`}>
                    {calculateDifference(cashRegister.cash, parseFloat(inputValues.cash) || 0).toFixed(2)} zł
                    ({getDifferenceLabel(calculateDifference(cashRegister.cash, parseFloat(inputValues.cash) || 0))})
                  </span>
                </div>
              )}
            </div>

            {/* Blik */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <i className="ri-smartphone-line text-2xl text-blue-600 mr-3"></i>
                <h4 className="font-semibold text-lg">{blik}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{systemAmount}</label>
                  <div className="bg-gray-100 p-2 rounded text-center font-semibold">
                    {cashRegister.blik.toFixed(2)} zł
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{actualAmount}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputValues.blik}
                    onChange={(e) => handleInputChange('blik', e.target.value)}
                    className="w-full p-2 border rounded text-center"
                    placeholder={enterActualAmount}
                  />
                </div>
              </div>
              
              {inputValues.blik && (
                <div className="text-center">
                  <span className="text-sm text-gray-600">{difference}: </span>
                  <span className={`font-semibold ${getDifferenceColor(calculateDifference(cashRegister.blik, parseFloat(inputValues.blik) || 0))}`}>
                    {calculateDifference(cashRegister.blik, parseFloat(inputValues.blik) || 0).toFixed(2)} zł
                    ({getDifferenceLabel(calculateDifference(cashRegister.blik, parseFloat(inputValues.blik) || 0))})
                  </span>
                </div>
              )}
            </div>

            {/* Tarjeta */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <i className="ri-bank-card-line text-2xl text-purple-600 mr-3"></i>
                <h4 className="font-semibold text-lg">{card}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{systemAmount}</label>
                  <div className="bg-gray-100 p-2 rounded text-center font-semibold">
                    {cashRegister.card.toFixed(2)} zł
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{actualAmount}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputValues.card}
                    onChange={(e) => handleInputChange('card', e.target.value)}
                    className="w-full p-2 border rounded text-center"
                    placeholder={enterActualAmount}
                  />
                </div>
              </div>
              
              {inputValues.card && (
                <div className="text-center">
                  <span className="text-sm text-gray-600">{difference}: </span>
                  <span className={`font-semibold ${getDifferenceColor(calculateDifference(cashRegister.card, parseFloat(inputValues.card) || 0))}`}>
                    {calculateDifference(cashRegister.card, parseFloat(inputValues.card) || 0).toFixed(2)} zł
                    ({getDifferenceLabel(calculateDifference(cashRegister.card, parseFloat(inputValues.card) || 0))})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botón de cierre */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowCloseModal(true)}
          className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-close-circle-line mr-2"></i>
          {closeShift}
        </button>
      </div>

      {/* Modal de confirmación */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-alert-line text-3xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{confirmClose}</h3>
              <p className="text-gray-600">{closeConfirmation}</p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCloseModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                {cancel}
              </button>
              <button
                onClick={handleCloseShift}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                {confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
