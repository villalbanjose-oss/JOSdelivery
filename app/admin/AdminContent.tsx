'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ProductManagement = dynamic(() => import('./ProductManagement'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

const OrderManagement = dynamic(() => import('./OrderManagement'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

const SalesReport = dynamic(() => import('./SalesReport'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

const BannerManagement = dynamic(() => import('./BannerManagement'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

const TestimonialsManagement = dynamic(() => import('./TestimonialsManagement'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

const FAQManagement = dynamic(() => import('./FAQManagement'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

const BusinessSettings = dynamic(() => import('./BusinessSettings'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

const CashRegisterManagement = dynamic(() => import('./CashRegisterManagement'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

const SecuritySettings = dynamic(() => import('./SecuritySettings'), {
  loading: () => <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div></div>,
  ssr: false
});

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState('products');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminLoggedIn');
      window.location.href = '/admin/login';
    }
  };

  const sections = [
    { id: 'products', name: 'Productos', icon: 'ri-shopping-bag-line' },
    { id: 'orders', name: 'Pedidos', icon: 'ri-file-list-line' },
    { id: 'sales', name: 'Ventas', icon: 'ri-line-chart-line' },
    { id: 'banners', name: 'Banners', icon: 'ri-image-line' },
    { id: 'testimonials', name: 'Testimonios', icon: 'ri-chat-quote-line' },
    { id: 'faqs', name: 'FAQs', icon: 'ri-question-line' },
    { id: 'business', name: 'Configuración', icon: 'ri-settings-3-line' },
    { id: 'cash', name: 'Caja', icon: 'ri-money-dollar-circle-line' },
    { id: 'security', name: 'Seguridad', icon: 'ri-shield-line' }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Panel de Control</h2>
            <nav className="space-y-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center whitespace-nowrap cursor-pointer ${
                    activeSection === section.id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center mr-3">
                    <i className={`${section.icon} text-lg`}></i>
                  </div>
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center mt-4 whitespace-nowrap cursor-pointer"
              >
                <div className="w-5 h-5 flex items-center justify-center mr-3">
                  <i className="ri-logout-box-line text-lg"></i>
                </div>
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'products' && <ProductManagement />}
            {activeSection === 'orders' && <OrderManagement />}
            {activeSection === 'sales' && <SalesReport />}
            {activeSection === 'banners' && <BannerManagement />}
            {activeSection === 'testimonials' && <TestimonialsManagement />}
            {activeSection === 'faqs' && <FAQManagement />}
            {activeSection === 'business' && <BusinessSettings />}
            {activeSection === 'cash' && <CashRegisterManagement />}
            {activeSection === 'security' && <SecuritySettings />}
          </div>
        </main>
      </div>
    </div>
  );
}
