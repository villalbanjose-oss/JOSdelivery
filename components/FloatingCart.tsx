
'use client';
import { useState, useEffect } from 'react';

interface CartItem {
  cartId: number;
  id: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: string[];
  selectedCombo?: any;
  comments?: string;
  totalPrice: number;
  categoryKey?: string;
  extras?: string[];
  removedIngredients?: string[];
  extrasPrice?: number;
  comboPrice?: number;
}

interface FloatingCartProps {
  cartItems: CartItem[];
  onShowCart: () => void;
  onRemoveFromCart: (cartId: number) => void;
  onUpdateCartItem: (cartId: number, updates: any) => void;
  onClearCart: () => void;
  onShowCheckout?: () => void;
}

export default function FloatingCart({
  cartItems,
  onShowCart,
  onRemoveFromCart,
  onUpdateCartItem,
  onClearCart,
  onShowCheckout,
}: FloatingCartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    if (cartItems.length === 0) {
      return;
    }
    
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      if (onShowCheckout) {
        onShowCheckout();
      } else {
        setTimeout(() => {
          window.location.href = '/menu?checkout=true';
        }, 100);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      alert('Error al procesar el carrito. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleCartClick}
        className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors cursor-pointer relative"
      >
        <i className="ri-shopping-cart-line text-2xl"></i>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}
