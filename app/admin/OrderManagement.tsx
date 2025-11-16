'use client';
import { useState, useEffect } from 'react';

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [lastOrderCount, setLastOrderCount] = useState(0);

  const playNotificationSound = () => {
    try {
      const audio = new Audio();
      audio.src =
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuU2fPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuU2fPNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuU2fPNeSs=';
      audio.volume = 0.7;
      audio.play().catch((e) => console.log('Audio play failed:', e));
    } catch (error) {
      console.log('Error playing notification sound:', error);
    }
  };

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const sortedOrders = savedOrders.sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      if (savedOrders.length > lastOrderCount && lastOrderCount > 0) {
        playNotificationSound();
      }

      setOrders(sortedOrders);
      setLastOrderCount(savedOrders.length);
    };

    loadOrders();
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, [lastOrderCount]);

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const cancelOrderFunc = (orderId: number) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'preparing':
        return 'Preparando';
      case 'ready':
        return 'Listo';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getConfirmationChannelLabel = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'viber':
        return 'Viber';
      case 'telegram':
        return 'Telegram';
      default:
        return channel || 'No especificado';
    }
  };

  const getIngredientName = (customization: string) => {
    return customization.replace('add-', '').replace('remove-', '');
  };

  const calculateExtrasPrice = (customizations: string[]) => {
    let total = 0;
    if (customizations && customizations.length > 0) {
      customizations.forEach((customization) => {
        if (customization.startsWith('add-')) {
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

  const getProductName = (product: any) => {
    if (!product) return 'Producto sin nombre';
    
    if (typeof product.name === 'string') {
      return product.name;
    }
    
    if (typeof product.name === 'object' && product.name !== null) {
      if (product.name.es) return product.name.es;
      if (product.name.en) return product.name.en;
      
      const values = Object.values(product.name);
      if (values.length > 0 && typeof values[0] === 'string') {
        return values[0];
      }
    }
    
    return 'Producto sin nombre';
  };

  const getComboName = (combo: any) => {
    if (!combo) return 'Combo sin nombre';
    
    if (typeof combo === 'string') return combo;
    
    if (typeof combo.name === 'string') {
      return combo.name;
    }
    
    if (typeof combo.name === 'object' && combo.name !== null) {
      if (combo.name.es) return combo.name.es;
      if (combo.name.en) return combo.name.en;
      
      const values = Object.values(combo.name);
      if (values.length > 0 && typeof values[0] === 'string') {
        return values[0];
      }
    }
    
    return 'Combo sin nombre';
  };

  const getComboDescription = (combo: any) => {
    if (!combo || !combo.description) return '';
    
    if (typeof combo.description === 'string') {
      return combo.description;
    }
    
    if (typeof combo.description === 'object' && combo.description !== null) {
      if (combo.description.es) return combo.description.es;
      if (combo.description.en) return combo.description.en;
      
      const values = Object.values(combo.description);
      if (values.length > 0 && typeof values[0] === 'string') {
        return values[0];
      }
    }
    
    return '';
  };

  const printKitchenReceipt = (order: any) => {
    const currentDate = new Date();
    const formatDate = currentDate.toLocaleDateString('es-ES');
    const formatTime = currentDate.toLocaleTimeString('es-ES');

    const savedSettings = localStorage.getItem('checkoutSettings');
    let deliveryFee = 7;
    let deliveryOutsideMessage = 'Entregas fuera de Sosnowiec 14zl';
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        deliveryFee = settings.deliveryFee || 7;
        deliveryOutsideMessage = settings.deliveryOutsideMessage || 'Entregas fuera de Sosnowiec 14zl';
      } catch (e) {
        console.log('Error parsing settings');
      }
    }

    const subtotal = order.deliveryType === 'delivery' 
      ? (order.totalPrice || 0) - deliveryFee 
      : (order.totalPrice || 0);

    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Comanda #${order.id}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.4;
            color: #000;
            background: #fff;
            padding: 10px;
            max-width: 350px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        
        .header h1 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .header h2 {
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .section {
            margin-bottom: 15px;
            padding: 8px;
            border: 2px solid #000;
            background: #f9f9f9;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 8px;
            text-decoration: underline;
        }
        
        .customer-info p, .order-info p {
            margin-bottom: 3px;
            font-size: 13px;
        }
        
        .product {
            border: 2px solid #333;
            margin-bottom: 12px;
            padding: 10px;
            background: #fff;
        }
        
        .product-header {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 8px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
            text-transform: uppercase;
        }
        
        .quantity {
            background: #000;
            color: #fff;
            padding: 3px 8px;
            border-radius: 3px;
            font-weight: bold;
            float: right;
        }
        
        .customizations {
            margin-top: 10px;
            padding: 8px;
            background: #f0f0f0;
            border-left: 4px solid #333;
        }
        
        .customizations-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 13px;
        }
        
        .extra {
            color: #006600;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .remove {
            color: #cc0000;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .combo {
            color: #6600cc;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .comments {
            margin-top: 8px;
            padding: 8px;
            background: #ffffcc;
            border: 2px solid #ffcc00;
            font-style: italic;
        }
        
        .total-section {
            border-top: 3px solid #000;
            padding-top: 10px;
            margin-top: 15px;
        }

        .total-line {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 14px;
        }

        .total-line.subtotal {
            border-bottom: 1px dashed #666;
            margin-bottom: 5px;
        }

        .total-line.delivery {
            color: #0066cc;
            font-weight: bold;
        }

        .total-line.final {
            font-size: 18px;
            font-weight: bold;
            border-top: 2px solid #000;
            padding-top: 8px;
            margin-top: 8px;
        }

        .delivery-note {
            font-size: 11px;
            color: #0066cc;
            font-style: italic;
            margin-top: 3px;
        }
        
        .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 12px;
        }
        
        @media print {
            body { 
                font-size: 12px; 
                max-width: 300px;
            }
            .no-print { 
                display: none; 
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🍽️ COMANDA DE COCINA</h1>
        <h2>PEDIDO #${order.id}</h2>
        <p>${formatDate} - ${formatTime}</p>
    </div>

    <div class="section">
        <div class="section-title">👤 INFORMACIÓN DEL CLIENTE</div>
        <div class="customer-info">
            <p><strong>NOMBRE:</strong> ${order.firstName || 'N/A'} ${order.lastName || ''}</p>
            <p><strong>TELÉFONO:</strong> ${order.phone || 'N/A'}</p>
            ${order.email ? `<p><strong>EMAIL:</strong> ${order.email}</p>` : ''}
            ${order.confirmationChannel ? `<p><strong>CONFIRMAR POR:</strong> ${getConfirmationChannelLabel(order.confirmationChannel).toUpperCase()}</p>` : ''}
            <p><strong>TIPO:</strong> ${order.deliveryType === 'pickup' ? 'RECOGER EN PUNTO' : 'DOMICILIO'}</p>
            ${order.deliveryType === 'delivery' && order.address ? 
                `<p><strong>DIRECCIÓN:</strong> ${order.address}, ${order.city || ''}</p>` : ''}
            ${order.deliveryType === 'delivery' && order.deliveryNotes ? 
                `<p><strong>NOTAS:</strong> ${order.deliveryNotes}</p>` : ''}
        </div>
    </div>

    <div class="section">
        <div class="section-title">📋 INFORMACIÓN DEL PEDIDO</div>
        <div class="order-info">
            <p><strong>ESTADO:</strong> ${getStatusText(order.status).toUpperCase()}</p>
            <p><strong>HORA PEDIDO:</strong> ${new Date(order.timestamp).toLocaleString('es-ES')}</p>
            <p><strong>MÉTODO PAGO:</strong> ${order.paymentMethod === 'cash' ? 'EFECTIVO' : 
                order.paymentMethod === 'blik' ? 'BLIK' : 'TARJETA'}</p>
        </div>
    </div>

    <div style="text-align: center; font-weight: bold; font-size: 16px; margin: 15px 0; border: 2px solid #000; padding: 8px;">
        🍴 PRODUCTOS A PREPARAR
    </div>

    ${order.cart && order.cart.length > 0 ? order.cart.map((item: any, index: number) => `
        <div class="product">
            <div class="product-header">
                ${index + 1}. ${getProductName(item).toUpperCase()}
                <span class="quantity">CANT: ${item.quantity || 1}</span>
                <div style="clear: both;"></div>
            </div>

            ${item.customizations && item.customizations.length > 0 ? `
                <div class="customizations">
                    <div class="customizations-title">🔧 PERSONALIZACIONES:</div>
                    
                    ${item.customizations.filter((c: string) => c.startsWith('add-')).length > 0 ? `
                        <div style="margin-bottom: 8px;">
                            <strong>AGREGAR:</strong><br>
                            ${item.customizations
                                .filter((c: string) => c.startsWith('add-'))
                                .map((extra: string) => {
                                  const { name, price } = getExtraIngredientDetails(extra);
                                  return `<div class="extra">➕ ${name.toUpperCase()} (+${price.toFixed(2)} ZŁ)</div>`;
                                })
                                .join('')}
                        </div>
                    ` : ''}

                    ${item.customizations.filter((c: string) => c.startsWith('remove-')).length > 0 ? `
                        <div style="margin-bottom: 8px;">
                            <strong>ELIMINAR:</strong><br>
                            ${item.customizations
                                .filter((c: string) => c.startsWith('remove-'))
                                .map((remove: string) => `<div class="remove">❌ SIN ${getIngredientName(remove).toUpperCase()}</div>`)
                                .join('')}
                        </div>
                    ` : ''}
                </div>
            ` : ''}

            ${item.selectedCombo ? `
                <div class="customizations">
                    <div class="customizations-title">🎁 COMBO SELECCIONADO:</div>
                    <div class="combo">${getComboName(item.selectedCombo).toUpperCase()}${item.selectedCombo.price ? ` (+${item.selectedCombo.price.toFixed(2)} ZŁ)` : ''}</div>
                    ${getComboDescription(item.selectedCombo) ? `<div style="font-size: 12px; margin-top: 3px;">${getComboDescription(item.selectedCombo)}</div>` : ''}
                </div>
            ` : ''}

            ${item.comments ? `
                <div class="comments">
                    <strong>💬 COMENTARIOS ESPECIALES:</strong><br>
                    "${item.comments.toUpperCase()}"
                </div>
            ` : ''}
        </div>
    `).join('') : '<p style="text-align: center;">No hay productos en este pedido</p>'}

    <div class="total-section">
        <div class="total-line subtotal">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)} ZŁ</span>
        </div>
        ${order.deliveryType === 'delivery' ? `
        <div class="total-line delivery">
            <span>Costo de Domicilio:</span>
            <span>+${deliveryFee.toFixed(2)} ZŁ</span>
        </div>
        <div class="delivery-note">${deliveryOutsideMessage}</div>
        ` : ''}
        <div class="total-line final">
            <span>💰 TOTAL:</span>
            <span>${(order.totalPrice || 0).toFixed(2)} ZŁ</span>
        </div>
        <p style="text-align: center; margin-top: 10px;">--- FIN DE COMANDA ---</p>
    </div>

    <div class="footer">
        <p>Impreso: ${formatDate} ${formatTime}</p>
    </div>

    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="background: #22c55e; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; margin-right: 10px;">
            🖨️ IMPRIMIR COMANDA
        </button>
        <button onclick="window.close()" style="background: #ef4444; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
            ❌ CERRAR
        </button>
    </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=400,height=600,scrollbars=yes,resizable=yes');
    
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.focus();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    } else {
      alert('Por favor, permite las ventanas emergentes para imprimir la comanda. O copia el contenido manualmente.');
      
      const blob = new Blob([receiptContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comanda-${order.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h2>
        {orders.length > 0 && (
          <div className="flex items-center bg-green-100 px-4 py-2 rounded-lg">
            <i className="ri-notification-line text-green-600 mr-2"></i>
            <span className="text-green-800 font-semibold">{orders.length} pedidos activos</span>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-shopping-cart-line text-6xl text-gray-400 mb-4"></i>
          <p className="text-xl text-gray-600">No hay pedidos registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pedido #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hora del Pedido</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.firstName} {order.lastName}
                      <div className="text-xs text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {order.totalPrice?.toFixed(2) || '0.00'} zł
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap transition-colors flex items-center"
                        >
                          <i className="ri-eye-line mr-1"></i>
                          Ver Detalles
                        </button>

                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 cursor-pointer pr-8"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="preparing">Preparando</option>
                          <option value="ready">Listo</option>
                          <option value="delivered">Entregado</option>
                        </select>

                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => cancelOrderFunc(order.id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer whitespace-nowrap transition-colors"
                          >
                            <i className="ri-close-circle-line mr-1"></i>
                            Cancelar Pedido
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalles del pedido - CORREGIDO para mostrar precios reales */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <i className="ri-file-list-3-line mr-2 text-orange-500"></i>
                  Detalles del Pedido #{selectedOrder.id}
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => printKitchenReceipt(selectedOrder)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-printer-line"></i>
                    <span>Imprimir Comanda</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Cliente</h4>
                  <div className="space-y-2">
                    <p>
                      <strong>Nombre:</strong> {selectedOrder.firstName || 'N/A'}{' '}
                      {selectedOrder.lastName || ''}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {selectedOrder.phone || 'N/A'}
                    </p>
                    {selectedOrder.email && <p><strong>Email:</strong> {selectedOrder.email}</p>}
                    {selectedOrder.confirmationChannel && (
                      <p>
                        <strong>Confirmar pedido por:</strong>{' '}
                        <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          <i className={`mr-1 ${
                            selectedOrder.confirmationChannel === 'whatsapp' ? 'ri-whatsapp-line' :
                            selectedOrder.confirmationChannel === 'viber' ? 'ri-message-line' :
                            selectedOrder.confirmationChannel === 'telegram' ? 'ri-telegram-line' :
                            'ri-message-line'
                          }`}></i>
                          {getConfirmationChannelLabel(selectedOrder.confirmationChannel)}
                        </span>
                      </p>
                    )}
                    {selectedOrder.deliveryType === 'delivery' && (
                      <>
                        <p>
                          <strong>Dirección:</strong> {selectedOrder.address || 'N/A'}
                        </p>
                        <p>
                          <strong>Ciudad:</strong> {selectedOrder.city || 'N/A'}
                        </p>
                        {selectedOrder.deliveryNotes && (
                          <p>
                            <strong>Notas:</strong> {selectedOrder.deliveryNotes}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Información del Pedido</h4>
                  <div className="space-y-2">
                    <p>
                      <strong>Tipo de Entrega:</strong>{' '}
                      {selectedOrder.deliveryType === 'pickup' ? 'Recoger en Punto' : 'Domicilio'}
                    </p>
                    <p>
                      <strong>Método de Pago:</strong>{' '}
                      {selectedOrder.paymentMethod === 'cash'
                        ? 'Efectivo'
                        : selectedOrder.paymentMethod === 'blik'
                        ? 'Blik'
                        : 'Tarjeta'}
                    </p>
                    <p>
                      <strong>Hora del Pedido:</strong>{' '}
                      {new Date(selectedOrder.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <strong>Estado:</strong>{' '}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* COMANDA DETALLADA - CORREGIDA para mostrar precios reales */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-4 text-xl border-b pb-2">
                  🍽️ COMANDA DETALLADA
                </h4>
                <div className="space-y-4">
                  {selectedOrder.cart && selectedOrder.cart.length > 0 ? (
                    selectedOrder.cart.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h5 className="font-bold text-xl text-gray-800">
                              {getProductName(item)}
                            </h5>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Cantidad: {item.quantity || 1}
                              </span>
                              <span className="text-gray-600">
                                Precio unitario: {(item.price || 0).toFixed(2)} zł
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-2xl text-orange-600">
                              {((item.totalPrice || item.price * item.quantity) || 0).toFixed(2)} zł
                            </span>
                          </div>
                        </div>

                        {/* PERSONALIZACIONES DETALLADAS - CORREGIDAS para mostrar precios reales */}
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg border-l-4 border-orange-400">
                            <h6 className="font-bold text-gray-800 mb-3 flex items-center">
                              <i className="ri-settings-3-line mr-1"></i>
                              Personalizaciones:
                            </h6>

                            {/* Ingredientes Extra - CORREGIDOS para mostrar precios reales */}
                            {item.customizations.filter((c: string) => c.startsWith('add-')).length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-bold text-green-700 mb-2 flex items-center">
                                  <i className="ri-add-circle-line mr-1"></i>
                                  Ingredientes Extra:
                                </p>
                                <div className="grid grid-cols-1 gap-1">
                                  {item.customizations
                                    .filter((c: string) => c.startsWith('add-'))
                                    .map((customization: string, idx: number) => {
                                      const { name, price } = getExtraIngredientDetails(customization);
                                      return (
                                        <div
                                          key={idx}
                                          className="flex justify-between items-center bg-green-50 px-3 py-2 rounded"
                                        >
                                          <span className="text-green-700 font-medium">
                                            ➕ {name}
                                          </span>
                                          <span className="text-green-600 font-bold">+{price.toFixed(2)} zł</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                            {/* Ingredientes Eliminados */}
                            {item.customizations.filter((c: string) => c.startsWith('remove-')).length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-bold text-red-700 mb-2 flex items-center">
                                  <i className="ri-subtract-line mr-1"></i>
                                  Ingredientes Eliminados:
                                </p>
                                <div className="grid grid-cols-1 gap-1">
                                  {item.customizations
                                    .filter((c: string) => c.startsWith('remove-'))
                                    .map((customization: string, idx: number) => (
                                      <div key={idx} className="bg-red-50 px-3 py-2 rounded">
                                        <span className="text-red-700 font-medium">
                                          ❌ SIN {getIngredientName(customization)}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {/* Combos seleccionados */}
                            {item.selectedCombo && (
                              <div className="mb-3">
                                <p className="text-sm font-bold text-purple-700 mb-2 flex items-center">
                                  <i className="ri-gift-line mr-1"></i>
                                  Combo Seleccionado:
                                </p>
                                <div className="bg-purple-50 px-3 py-2 rounded">
                                  <div className="flex justify-between items-center">
                                    <span className="text-purple-700 font-medium">
                                      🎁 {getComboName(item.selectedCombo)}
                                    </span>
                                    {item.selectedCombo.price && (
                                      <span className="text-purple-600 font-bold">+{item.selectedCombo.price.toFixed(2)} zł</span>
                                    )}
                                  </div>
                                  {getComboDescription(item.selectedCombo) && (
                                    <p className="text-purple-600 text-sm mt-1">{getComboDescription(item.selectedCombo)}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Cálculo de extras - CORREGIDO para usar precios reales */}
                            {item.customizations.filter((c: string) => c.startsWith('add-')).length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Costo de extras:</span>
                                  <span className="font-bold text-green-600">
                                    +{calculateExtrasPrice(item.customizations).toFixed(2)} zł
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* COMENTARIOS ESPECIALES */}
                        {item.comments && (
                          <div className="mt-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                            <p className="text-sm font-bold text-blue-700 mb-2 flex items-center">
                              <i className="ri-chat-3-line mr-1"></i>
                              Comentarios Especiales:
                            </p>
                            <p className="text-blue-700 font-medium italic bg-white p-3 rounded border">
                              💬 "{item.comments}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <i className="ri-shopping-cart-line text-4xl mb-2"></i>
                      <p>No hay productos en este pedido</p>
                    </div>
                  )}
                </div>
              </div>

              {/* TOTAL FINAL */}
              <div className="border-t-2 border-gray-300 pt-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  {/* Desglose de totales */}
                  <div className="space-y-3 mb-4">
                    {(() => {
                      const savedSettings = localStorage.getItem('checkoutSettings');
                      let deliveryFee = 7;
                      let deliveryOutsideMessage = 'Entregas fuera de Sosnowiec 14zl';
                      
                      if (savedSettings) {
                        try {
                          const settings = JSON.parse(savedSettings);
                          deliveryFee = settings.deliveryFee || 7;
                          deliveryOutsideMessage = settings.deliveryOutsideMessage || 'Entregas fuera de Sosnowiec 14zl';
                        } catch (e) {
                          // Usar valores por defecto
                        }
                      }

                      const subtotal = selectedOrder.deliveryType === 'delivery' 
                        ? (selectedOrder.totalPrice || 0) - deliveryFee 
                        : (selectedOrder.totalPrice || 0);

                      return (
                        <>
                          <div className="flex justify-between items-center text-lg">
                            <span className="text-gray-700">Subtotal:</span>
                            <span className="font-semibold">{subtotal.toFixed(2)} zł</span>
                          </div>
                          
                          {selectedOrder.deliveryType === 'delivery' && (
                            <>
                              <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-700">Costo de Domicilio:</span>
                                <span className="font-semibold text-blue-600">+{deliveryFee.toFixed(2)} zł</span>
                              </div>
                              <div className="text-sm text-blue-600 italic text-right">
                                {deliveryOutsideMessage}
                              </div>
                            </>
                          )}
                          
                          <div className="border-t border-gray-300 pt-3">
                            <div className="flex justify-between items-center text-3xl font-bold">
                              <span className="text-gray-800">💰 Total:</span>
                              <span className="text-orange-600">{(selectedOrder.totalPrice || 0).toFixed(2)} zł</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
