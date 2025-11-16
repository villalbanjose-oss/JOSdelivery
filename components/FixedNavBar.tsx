
'use client';
import { useState } from 'react';

interface FixedNavBarProps {
  cartItems: any[];
  onShowCart: () => void;
}

export default function FixedNavBar({ 
  cartItems = [],
  onShowCart
}: FixedNavBarProps) {
  const [activeButton, setActiveButton] = useState('menu');

  const cartCount = cartItems.length;

  const handleButtonClick = (buttonType: string, callback?: () => void) => {
    setActiveButton(buttonType);
    if (callback) callback();
  };

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <a 
        href="#main-content" 
        className="skip-link"
        onFocus={(e) => e.target.style.top = '6px'}
        onBlur={(e) => e.target.style.top = '-40px'}
      >
        Saltar al contenido principal
      </a>

      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg border-b border-gray-800"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="container mx-auto px-4">
          <div className="hidden sm:flex justify-center items-center py-3">
            <div className="flex space-x-1 bg-gray-900 rounded-full p-1" role="tablist">
              <button
                onClick={() => handleButtonClick('menu', () => scrollToSection('menu-categories'))}
                onKeyDown={(e) => handleKeyDown(e, () => handleButtonClick('menu', () => scrollToSection('menu-categories')))}
                className={`btn-accessible nav-accessible flex items-center px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeButton === 'menu'
                    ? 'bg-yellow-400 text-black font-semibold shadow-lg'
                    : 'text-white hover:bg-gray-800 hover:shadow-md'
                }`}
                role="tab"
                aria-selected={activeButton === 'menu'}
                aria-label="Ir al menú principal"
                tabIndex={0}
              >
                <div className="icon-accessible w-6 h-6 flex items-center justify-center mr-3">
                  <i className="ri-home-line text-lg" aria-hidden="true"></i>
                </div>
                <span className="text-base font-semibold">Menú</span>
              </button>

              <button
                onClick={() => handleButtonClick('cart', onShowCart)}
                onKeyDown={(e) => handleKeyDown(e, () => handleButtonClick('cart', onShowCart))}
                className={`btn-accessible nav-accessible flex items-center px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer relative ${
                  activeButton === 'cart'
                    ? 'bg-yellow-400 text-black font-semibold shadow-lg'
                    : 'text-white hover:bg-gray-800 hover:shadow-md'
                }`}
                role="tab"
                aria-selected={activeButton === 'cart'}
                aria-label={`Ver carrito de compras. ${cartCount} artículos en el carrito`}
                tabIndex={0}
              >
                <div className="icon-accessible w-6 h-6 flex items-center justify-center mr-3 relative">
                  <i className="ri-shopping-cart-line text-lg" aria-hidden="true"></i>
                  {cartCount > 0 && (
                    <span 
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white"
                      aria-label={`${cartCount} artículos`}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-base font-semibold">Carrito</span>
              </button>

              <button
                onClick={() => handleButtonClick('contact', () => scrollToSection('footer'))}
                onKeyDown={(e) => handleKeyDown(e, () => handleButtonClick('contact', () => scrollToSection('footer')))}
                className={`btn-accessible nav-accessible flex items-center px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  activeButton === 'contact'
                    ? 'bg-yellow-400 text-black font-semibold shadow-lg'
                    : 'text-white hover:bg-gray-800 hover:shadow-md'
                }`}
                role="tab"
                aria-selected={activeButton === 'contact'}
                aria-label="Abrir información de contacto"
                tabIndex={0}
              >
                <div className="icon-accessible w-6 h-6 flex items-center justify-center mr-3">
                  <i className="ri-phone-line text-lg" aria-hidden="true"></i>
                </div>
                <span className="text-base font-semibold">Contacto</span>
              </button>
            </div>
          </div>

          <div className="sm:hidden py-2">
            <div className="flex justify-around items-center bg-gray-900/90 rounded-lg mx-1 p-1" role="tablist">
              <button
                onClick={() => handleButtonClick('menu', () => scrollToSection('menu-categories'))}
                onKeyDown={(e) => handleKeyDown(e, () => handleButtonClick('menu', () => scrollToSection('menu-categories')))}
                className={`btn-accessible flex flex-col items-center py-3 px-3 rounded-md transition-all duration-300 cursor-pointer min-w-[60px] ${
                  activeButton === 'menu'
                    ? 'bg-yellow-400/30 text-yellow-400 shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                role="tab"
                aria-selected={activeButton === 'menu'}
                aria-label="Ir al menú principal"
                tabIndex={0}
              >
                <div className="icon-accessible w-6 h-6 flex items-center justify-center mb-1">
                  <i className="ri-home-line text-base" aria-hidden="true"></i>
                </div>
                <span className="text-xs font-semibold">Menú</span>
              </button>

              <button
                onClick={() => handleButtonClick('cart', onShowCart)}
                onKeyDown={(e) => handleKeyDown(e, () => handleButtonClick('cart', onShowCart))}
                className={`btn-accessible flex flex-col items-center py-3 px-3 rounded-md transition-all duration-300 cursor-pointer relative min-w-[60px] ${
                  activeButton === 'cart'
                    ? 'bg-yellow-400/30 text-yellow-400 shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                role="tab"
                aria-selected={activeButton === 'cart'}
                aria-label={`Ver carrito de compras. ${cartCount} artículos en el carrito`}
                tabIndex={0}
              >
                <div className="icon-accessible w-6 h-6 flex items-center justify-center mb-1 relative">
                  <i className="ri-shopping-cart-line text-base" aria-hidden="true"></i>
                  {cartCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-xs leading-none border border-white"
                      aria-label={`${cartCount} artículos`}
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold">Carrito</span>
              </button>

              <button
                onClick={() => handleButtonClick('contact', () => scrollToSection('footer'))}
                onKeyDown={(e) => handleKeyDown(e, () => handleButtonClick('contact', () => scrollToSection('footer')))}
                className={`btn-accessible flex flex-col items-center py-3 px-3 rounded-md transition-all duration-300 cursor-pointer min-w-[60px] ${
                  activeButton === 'contact'
                    ? 'bg-yellow-400/30 text-yellow-400 shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                role="tab"
                aria-selected={activeButton === 'contact'}
                aria-label="Abrir información de contacto"
                tabIndex={0}
              >
                <div className="icon-accessible w-6 h-6 flex items-center justify-center mb-1">
                  <i className="ri-phone-line text-base" aria-hidden="true"></i>
                </div>
                <span className="text-xs font-semibold">Contacto</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
