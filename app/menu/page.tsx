
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuIntro from './MenuIntro';
import MenuContent from './MenuContent';
import MenuHeader from './MenuHeader';
import PromotionBanner from './PromotionBanner';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import Footer from '../../components/Footer';
import FloatingCart from '../../components/FloatingCart';
import CheckoutForm from './CheckoutForm';

function MenuPageContent() {
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [menuUnlocked, setMenuUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [orderNotification, setOrderNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    setMounted(true);
    
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          const validatedCart = parsedCart.map((item: any) => ({
            ...item,
            cartId: item.cartId || Date.now() + Math.random()
          }));
          setCartItems(validatedCart);
        } else {
          setCartItems([]);
          localStorage.removeItem('cartItems');
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }

    // Verificar parámetro checkout
    const checkoutParam = searchParams?.get('checkout');
    if (checkoutParam === 'true') {
      setShowCheckout(true);
      setMenuUnlocked(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (mounted && Array.isArray(cartItems)) {
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cartItems, mounted]);

  const showOrderNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setOrderNotification({ show: true, message, type });
    setTimeout(() => {
      setOrderNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddToCart = (item: any) => {
    const uniqueCartId = Date.now() + Math.random();
    
    const existingItemIndex = cartItems.findIndex(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.extras || []) === JSON.stringify(item.extras || []) &&
      JSON.stringify(cartItem.removedIngredients || []) === JSON.stringify(item.removedIngredients || []) &&
      JSON.stringify(cartItem.selectedCombo || null) === JSON.stringify(item.selectedCombo || null) &&
      (cartItem.comments || '') === (item.comments || '')
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += item.quantity || 1;
      updatedCart[existingItemIndex].totalPrice = updatedCart[existingItemIndex].quantity * 
        (updatedCart[existingItemIndex].price + 
         (updatedCart[existingItemIndex].extras?.length || 0) * 2 + 
         (updatedCart[existingItemIndex].selectedCombo?.price || 0));
      setCartItems(updatedCart);
    } else {
      const newItem = {
        ...item,
        cartId: uniqueCartId,
        quantity: item.quantity || 1,
        totalPrice: (item.quantity || 1) * (item.price + (item.extras?.length || 0) * 2 + (item.selectedCombo?.price || 0))
      };
      setCartItems([...cartItems, newItem]);
    }
    
    showOrderNotification('Producto agregado al carrito');
  };

  const handleRemoveFromCart = (cartId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const handleUpdateCartItem = (cartId: number, updates: any) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.cartId === cartId) {
        const updatedItem = { ...item, ...updates };
        if (updates.quantity !== undefined) {
          updatedItem.totalPrice = updates.quantity * 
            (item.price + (item.extras?.length || 0) * 2 + (item.selectedCombo?.price || 0));
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleClearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleOrderNowClick = () => {
    setMenuUnlocked(true);
    setTimeout(() => {
      const menuElement = document.getElementById('menu-categories');
      if (menuElement) {
        menuElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleShowCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToMenu = () => {
    setShowCheckout(false);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/menu');
    }
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setShowCheckout(false);
    try {
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
    showOrderNotification('¡Pedido realizado con éxito!', 'success');
    
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/menu');
      }
    }, 3000);
  };

  const getTotalPrice = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 mb-4"></div>
          <div className="h-96 bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-white">
        <MenuHeader 
          cartItems={cartItems}
          onShowCart={() => setShowCart(true)}
        />
        <CheckoutForm
          cart={cartItems}
          totalPrice={getTotalPrice()}
          onBack={handleBackToMenu}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateCartItem={handleUpdateCartItem}
          onClearCart={handleClearCart}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MenuHeader 
        cartItems={cartItems}
        onShowCart={() => setShowCart(true)}
      />
      
      {!menuUnlocked && <MenuIntro onOrderNowClick={handleOrderNowClick} />}
      
      {menuUnlocked && (
        <>
          <div id="menu-categories">
            <MenuContent 
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateCartItem={handleUpdateCartItem}
              showCart={showCart}
              onShowCart={setShowCart}
              onClearCart={handleClearCart}
            />
          </div>
          
          <PromotionBanner />
          <TestimonialsSection />
          <FAQSection />
          <Footer />
        </>
      )}

      <FloatingCart
        cartItems={cartItems}
        onShowCart={() => setShowCart(true)}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateCartItem={handleUpdateCartItem}
        onClearCart={handleClearCart}
        onShowCheckout={handleShowCheckout}
      />

      {orderNotification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          orderNotification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <i className={`${orderNotification.type === 'success' ? 'ri-check-line' : 'ri-error-warning-line'} mr-2`}></i>
            {orderNotification.message}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    }>
      <MenuPageContent />
    </Suspense>
  );
}
