
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import SalesReport from './SalesReport';
import BusinessSettings from './BusinessSettings';
import SecuritySettings from './SecuritySettings';
import TestimonialsManagement from './TestimonialsManagement';
import FAQManagement from './FAQManagement';
import CashRegisterManagement from './CashRegisterManagement';
import BannerManagement from './BannerManagement';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('products');
  const [userPermissions, setUserPermissions] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentAdminUser') || '{}');
    const defaultPermissions = {
      products: true,
      orders: true,
      sales: true,
      settings: true,
      security: true,
      cashRegister: true,
      testimonials: true,
      faqs: true,
      banners: true
    };
    
    // Asegurar que siempre tenga todos los permisos por defecto
    const finalPermissions = { ...defaultPermissions, ...(currentUser.permissions || {}) };
    setUserPermissions(finalPermissions);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('currentAdminUser');
    router.push('/admin/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'sales':
        return <SalesReport />;
      case 'testimonials':
        return <TestimonialsManagement />;
      case 'faqs':
        return <FAQManagement />;
      case 'banners':
        return <BannerManagement />;
      case 'settings':
        return <BusinessSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'cashRegister':
        return <CashRegisterManagement />;
      default:
        return <ProductManagement />;
    }
  };

  const availableTabs = [
    { key: 'products', label: 'Productos', icon: 'ri-shopping-bag-line', permission: 'products' },
    { key: 'orders', label: 'Pedidos', icon: 'ri-file-list-line', permission: 'orders' },
    { key: 'cashRegister', label: 'Cierre de Caja', icon: 'ri-cash-line', permission: 'cashRegister' },
    { key: 'sales', label: 'Ventas', icon: 'ri-bar-chart-line', permission: 'sales' },
    { key: 'testimonials', label: 'Testimonios', icon: 'ri-chat-quote-line', permission: 'testimonials' },
    { key: 'faqs', label: 'Preguntas Frecuentes', icon: 'ri-question-line', permission: 'faqs' },
    { key: 'banners', label: 'Gestión de Banners', icon: 'ri-image-edit-line', permission: 'banners' },
    { key: 'settings', label: 'Configuración', icon: 'ri-settings-line', permission: 'settings' },
    { key: 'security', label: 'Seguridad', icon: 'ri-shield-user-line', permission: 'security' }
  ].filter(tab => userPermissions[tab.permission] === true);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl min-h-[80vh]">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 mr-4">
                  <div className="w-full h-full rounded-full border-4 border-gray-800 flex items-center justify-center" 
                       style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
                    <i className="ri-fire-line text-2xl text-gray-800"></i>
                  </div>
                </div>
                <div>
                  <h1 className="font-['Pacifico'] text-3xl text-orange-600">JOS</h1>
                  <p className="text-gray-600">Panel de Administración</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-logout-box-line mr-2"></i>
                Cerrar Sesión
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 border-b">
              {availableTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
