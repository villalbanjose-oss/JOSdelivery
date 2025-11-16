
'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function SalesReport() {
  const [orders, setOrders] = useState<any[]>([]);
  const [dateRangeState, setDateRangeState] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAllSalesData();
  }, []);

  const loadAllSalesData = () => {
    const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    const allOrders = [...currentOrders, ...salesHistory];
    
    const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex((o) => o.id === order.id || 
        (o.timestamp === order.timestamp && o.totalPrice === order.totalPrice))
    );
    
    setOrders(uniqueOrders);
  };

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
    return orderDate >= dateRangeState.start && orderDate <= dateRangeState.end;
  });

  // Función para obtener el nombre del producto de forma segura
  const getProductName = (product: any) => {
    if (typeof product.name === 'string') {
      return product.name;
    }
    if (typeof product.name === 'object' && product.name !== null) {
      return product.name.es || product.name.en || Object.values(product.name)[0] || 'Producto sin nombre';
    }
    return 'Producto sin nombre';
  };

  // Cálculos de estadísticas
  const totalSalesAmount = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValueAmount = totalOrdersCount > 0 ? totalSalesAmount / totalOrdersCount : 0;

  // Productos más vendidos
  const productSales: { [key: string]: { quantity: number; revenue: number } } = {};
  filteredOrders.forEach(order => {
    order.cart.forEach((item: any) => {
      const productName = getProductName(item);
      if (!productSales[productName]) {
        productSales[productName] = { quantity: 0, revenue: 0 };
      }
      productSales[productName].quantity += item.quantity;
      productSales[productName].revenue += item.totalPrice || (item.price * item.quantity);
    });
  });

  const topProductsList = Object.entries(productSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Ventas por fecha
  const salesByDateData: { [key: string]: number } = {};
  filteredOrders.forEach(order => {
    const date = new Date(order.timestamp).toLocaleDateString();
    salesByDateData[date] = (salesByDateData[date] || 0) + order.totalPrice;
  });

  const salesChartData = Object.entries(salesByDateData)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Pedidos por estado
  const ordersByStatusData: { [key: string]: number } = {};
  filteredOrders.forEach(order => {
    ordersByStatusData[order.status] = (ordersByStatusData[order.status] || 0) + 1;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const statusChartData = Object.entries(ordersByStatusData).map(([status, count]) => ({
    name: getStatusText(status),
    value: count
  }));

  // Métodos de pago
  const paymentMethodsData: { [key: string]: number } = {};
  filteredOrders.forEach(order => {
    paymentMethodsData[order.paymentMethod] = (paymentMethodsData[order.paymentMethod] || 0) + 1;
  });

  const paymentChartData = Object.entries(paymentMethodsData).map(([method, count]) => ({
    name: method === 'cash' ? 'Efectivo' : method === 'blik' ? 'Blik' : 'Tarjeta',
    value: count
  }));

  // Tipos de entrega
  const deliveryTypesData: { [key: string]: number } = {};
  filteredOrders.forEach(order => {
    deliveryTypesData[order.deliveryType] = (deliveryTypesData[order.deliveryType] || 0) + 1;
  });

  const deliveryChartData = Object.entries(deliveryTypesData).map(([type, count]) => ({
    name: type === 'pickup' ? 'Recoger en Punto' : 'Domicilio',
    value: count
  }));

  // Colores para gráficos
  const chartColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  const generatePDFContent = () => {
    const reportData = {
      title: 'Reporte de Ventas',
      dateRange: `Rango de Fechas: ${dateRangeState.start} - ${dateRangeState.end}`,
      totalSales: `Ventas Totales: ${totalSalesAmount.toFixed(2)} zł`,
      totalOrders: `Pedidos Totales: ${totalOrdersCount}`,
      avgOrderValue: `Valor Promedio por Pedido: ${avgOrderValueAmount.toFixed(2)} zł`,
      topProducts: topProductsList.map((product, index) => 
        `${index + 1}. ${product.name} - ${product.quantity} unidades - ${product.revenue.toFixed(2)} zł`
      ).join('\n'),
      salesByDate: salesChartData.map(item => 
        `${item.date}: ${item.total.toFixed(2)} zł`
      ).join('\n'),
      ordersByStatus: statusChartData.map(item => 
        `${item.name}: ${item.value} pedidos`
      ).join('\n'),
      paymentMethods: paymentChartData.map(item => 
        `${item.name}: ${item.value} pedidos`
      ).join('\n')
    };

    return `${reportData.title}
${reportData.dateRange}

RESUMEN EJECUTIVO
${reportData.totalSales}
${reportData.totalOrders}
${reportData.avgOrderValue}

PRODUCTOS MÁS VENDIDOS
${reportData.topProducts}

VENTAS POR FECHA
${reportData.salesByDate}

PEDIDOS POR ESTADO
${reportData.ordersByStatus}

MÉTODOS DE PAGO
${reportData.paymentMethods}

Reporte generado el: ${new Date().toLocaleString()}
Sistema JOS - Panel de Administración`;
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfContent = generatePDFContent();
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Ventas</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #E2B714; border-bottom: 2px solid #E2B714; padding-bottom: 10px; }
            h2 { color: #333; margin-top: 30px; }
            .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .date-range { color: #666; font-size: 14px; }
            .stats { display: flex; justify-content: space-between; margin: 20px 0; }
            .stat-item { text-align: center; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .products-list { margin: 20px 0; }
            .product-item { padding: 8px 0; border-bottom: 1px solid #eee; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Reporte de Ventas</h1>
          <div class="date-range">Rango de Fechas: ${dateRangeState.start} - ${dateRangeState.end}</div>
          
          <div class="summary">
            <h2>Resumen Ejecutivo</h2>
            <div class="stats">
              <div class="stat-item">
                <strong>${totalSalesAmount.toFixed(2)} zł</strong><br>
                <small>Ventas Totales</small>
              </div>
              <div class="stat-item">
                <strong>${totalOrdersCount}</strong><br>
                <small>Pedidos Totales</small>
              </div>
              <div class="stat-item">
                <strong>${avgOrderValueAmount.toFixed(2)} zł</strong><br>
                <small>Valor Promedio por Pedido</small>
              </div>
            </div>
          </div>

          <h2>Productos Más Vendidos</h2>
          <div class="products-list">
            ${topProductsList.map((product, index) => `
              <div class="product-item">
                <strong>${index + 1}. ${product.name}</strong><br>
                Cantidad: ${product.quantity} | Ingresos: ${product.revenue.toFixed(2)} zł
              </div>
            `).join('')}
          </div>

          <h2>Ventas por Fecha</h2>
          <div class="products-list">
            ${salesChartData.map(item => `
              <div class="product-item">
                ${item.date}: ${item.total.toFixed(2)} zł
              </div>
            `).join('')}
          </div>

          <h2>Pedidos por Estado</h2>
          <div class="products-list">
            ${statusChartData.map(item => `
              <div class="product-item">
                ${item.name}: ${item.value} pedidos
              </div>
            `).join('')}
          </div>

          <h2>Métodos de Pago</h2>
          <div class="products-list">
            ${paymentChartData.map(item => `
              <div class="product-item">
                ${item.name}: ${item.value} pedidos
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>Reporte generado el: ${new Date().toLocaleString()}</p>
            <p>Sistema JOS - Panel de Administración</p>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-ventas-${dateRangeState.start}-${dateRangeState.end}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      const pdfContent = generatePDFContent();
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-ventas-${dateRangeState.start}-${dateRangeState.end}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Reporte de Ventas</h2>
          <p className="text-sm text-green-600 mt-1">
            <i className="ri-database-line mr-2"></i>
            Datos Históricos Incluidos
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input
                type="date"
                value={dateRangeState.start}
                onChange={(e) => setDateRangeState({ ...dateRangeState, start: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input
                type="date"
                value={dateRangeState.end}
                onChange={(e) => setDateRangeState({ ...dateRangeState, end: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer flex items-center"
          >
            <i className="ri-download-line mr-2"></i>
            Descargar PDF
          </button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="text-3xl font-bold text-green-600">{totalSalesAmount.toFixed(2)} zł</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Totales</p>
              <p className="text-3xl font-bold text-blue-600">{totalOrdersCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-shopping-bag-line text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Promedio por Pedido</p>
              <p className="text-3xl font-bold text-purple-600">{avgOrderValueAmount.toFixed(2)} zł</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="ri-calculator-line text-2xl text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Ventas por fecha */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ventas por Fecha</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsList} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#45B7D1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pedidos por estado */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Pedidos por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Métodos de pago */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Métodos de Pago</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de productos más vendidos */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Productos Más Vendidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cantidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ingresos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProductsList.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.quantity}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{product.revenue.toFixed(2)} zł</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}