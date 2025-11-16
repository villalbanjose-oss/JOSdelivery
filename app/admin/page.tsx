
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const AdminContent = dynamic(() => import('./AdminContent'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" 
         style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="w-full h-full rounded-full border-4 border-gray-800 flex items-center justify-center animate-spin" 
               style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
            <i className="ri-fire-line text-2xl text-gray-800" aria-hidden="true"></i>
          </div>
        </div>
        <p className="text-gray-800 font-medium">Cargando panel de administración...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem('selectedLanguage', 'es');
    
    const checkAuth = () => {
      try {
        const adminLoggedIn = localStorage.getItem('adminLoggedIn');
        if (adminLoggedIn === 'true') {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleMenuClick = () => {
    router.push('/menu');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMenuClick();
    }
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full rounded-full border-4 border-gray-800 flex items-center justify-center animate-spin" 
                 style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
              <i className="ri-fire-line text-2xl text-gray-800" aria-hidden="true"></i>
            </div>
          </div>
          <p className="text-gray-800 font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <a 
        href="#main-admin-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-orange-500 text-white px-4 py-2 rounded z-50"
      >
        Saltar al contenido principal del panel de administración
      </a>

      <nav 
        className="bg-black text-white p-4 shadow-lg"
        role="navigation"
        aria-label="Navegación del panel de administración"
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3">
              <div className="w-full h-full rounded-full border-2 border-yellow-400 flex items-center justify-center" 
                   style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
                <i className="ri-fire-line text-lg text-black" aria-hidden="true"></i>
              </div>
            </div>
            <h1 className="font-['Pacifico'] text-2xl text-yellow-400">JOS Admin</h1>
          </div>
          
          <button
            onClick={handleMenuClick}
            onKeyDown={handleKeyDown}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 hover:shadow-lg transition-all duration-300 cursor-pointer whitespace-nowrap"
            aria-label="Ir al menú principal del restaurante"
            tabIndex={0}
          >
            <div className="flex items-center">
              <div className="w-5 h-5 flex items-center justify-center mr-2">
                <i className="ri-home-line text-lg" aria-hidden="true"></i>
              </div>
              <span className="text-sm">Menú</span>
            </div>
          </button>
        </div>
      </nav>

      <main 
        id="main-admin-content"
        role="main"
        aria-label="Panel de administración principal"
      >
        <AdminContent />
      </main>
    </div>
  );
}
