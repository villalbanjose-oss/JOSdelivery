
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface ProductCustomizationProps {
  product: any;
  onClose: () => void;
  onAddToCart: (product: any) => void;
  categoryKey: string;
}

export default function ProductCustomization({
  product,
  onClose,
  onAddToCart,
  categoryKey,
}: ProductCustomizationProps) {
  const [customizations, setCustomizations] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState('');
  const [extraIngredients, setExtraIngredients] = useState<any[]>([]);
  const [productCombos, setProductCombos] = useState<any[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos optimizado
  useEffect(() => {
    if (isLoaded) return;

    const loadData = () => {
      try {
        // Cargar ingredientes extras
        const savedExtrasByCategory = localStorage.getItem('extraIngredientsByCategory');
        if (savedExtrasByCategory) {
          const loadedExtras = JSON.parse(savedExtrasByCategory);
          if (loadedExtras[categoryKey] && Array.isArray(loadedExtras[categoryKey])) {
            setExtraIngredients(loadedExtras[categoryKey]);
          }
        }

        // Cargar combos del producto específico
        const savedCombosByProduct = localStorage.getItem('combosByProduct');
        if (savedCombosByProduct) {
          const loadedCombos = JSON.parse(savedCombosByProduct);
          if (loadedCombos[product?.id] && Array.isArray(loadedCombos[product?.id])) {
            setProductCombos(loadedCombos[product?.id]);
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [isLoaded, categoryKey, product?.id]);

  // Handler optimizado para personalización
  const handleCustomization = useCallback((ingredient: string, price: number, type: 'add' | 'remove') => {
    const key = `${type}-${ingredient}-${price}`;
    setCustomizations((prev) => {
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      }
      return [...prev, key];
    });
  }, []);

  // Handler optimizado para selección de combo
  const handleComboSelection = useCallback((combo: any) => {
    setSelectedCombo((prev: any) => {
      if (prev && prev.name === combo.name) {
        return null;
      }
      return combo;
    });
  }, []);

  // Cálculos memoizados - CORREGIDO para usar precios reales
  const customizationPrice = useMemo(() => {
    let total = 0;
    customizations.forEach((item) => {
      if (item.startsWith('add-')) {
        // Extraer el precio real del string de personalización
        const parts = item.split('-');
        const priceStr = parts[parts.length - 1];
        const price = parseFloat(priceStr);
        if (!isNaN(price)) {
          total += price;
        }
      }
    });
    return total;
  }, [customizations]);

  const comboPrice = useMemo(() => (selectedCombo ? selectedCombo.price : 0), [selectedCombo]);

  const totalPrice = useMemo(() => (product.price + customizationPrice + comboPrice) * quantity, [product.price, customizationPrice, comboPrice, quantity]);

  // Funciones memoizadas para obtener datos del producto
  const productName = useMemo(() => {
    try {
      if (typeof product.name === 'string') {
        return product.name;
      }
      if (typeof product.name === 'object' && product.name !== null) {
        return product.name.es || product.name[Object.keys(product.name)[0]] || 'Producto';
      }
      return 'Producto';
    } catch (error) {
      console.error('Error getting product name:', error);
      return 'Producto';
    }
  }, [product.name]);

  const productIngredients = useMemo(() => {
    try {
      if (Array.isArray(product.ingredients)) {
        return product.ingredients.filter((ingredient) => typeof ingredient === 'string');
      }
      if (typeof product.ingredients === 'object' && product.ingredients !== null) {
        const ingredients = product.ingredients.es || product.ingredients[Object.keys(product.ingredients)[0]];
        return Array.isArray(ingredients) ? ingredients.filter((i) => typeof i === 'string') : [];
      }
      return [];
    } catch (error) {
      console.error('Error getting product ingredients:', error);
      return [];
    }
  }, [product.ingredients]);

  // Handlers optimizados para cantidad
  const decreaseQuantity = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const increaseQuantity = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  // Handler optimizado para agregar al carrito - CORREGIDO para incluir precios reales
  const handleAddToCart = useCallback(() => {
    // Procesar personalizaciones para extraer ingredientes extras y precios
    const processedExtras: string[] = [];
    const processedRemovedIngredients: string[] = [];
    let extrasPrice = 0;

    customizations.forEach((item) => {
      if (item.startsWith('add-')) {
        const parts = item.split('-');
        const price = parseFloat(parts[parts.length - 1]);
        const ingredientName = parts.slice(1, -1).join('-');
        processedExtras.push(`${ingredientName} (+${price.toFixed(2)} zł)`);
        extrasPrice += price;
      } else if (item.startsWith('remove-')) {
        const parts = item.split('-');
        const ingredientName = parts.slice(1, -1).join('-');
        processedRemovedIngredients.push(ingredientName);
      }
    });

    const customizedProduct = {
      ...product,
      customizations,
      quantity,
      comments,
      selectedCombo,
      totalPrice,
      name: productName,
      categoryKey,
      extras: processedExtras,
      removedIngredients: processedRemovedIngredients,
      extrasPrice: extrasPrice,
      comboPrice: selectedCombo ? selectedCombo.price : 0
    };
    
    onAddToCart(customizedProduct);
    onClose();
  }, [product, customizations, quantity, comments, selectedCombo, totalPrice, productName, categoryKey, onAddToCart, onClose]);

  // Mostrar combos solo si están configurados
  const showCombos = useMemo(() => Array.isArray(productCombos) && productCombos.length > 0, [productCombos]);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando opciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{productName}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          <img
            src={
              product.image ||
              'https://readdy.ai/api/search-image?query=delicious%20food%20item%20on%20white%20background%2C%20minimalist%20style%2C%20high%20quality%20product%20photography&width=400&height=300&seq=default-product&orientation=landscape'
            }
            alt={productName}
            className="w-full h-48 object-cover object-top rounded-lg mb-6"
            loading="lazy"
          />

          <p className="text-gray-600 mb-4">
            <strong>Ingredientes:</strong> {productIngredients.join(', ')}
          </p>

          {/* Sección de Combos */}
          {showCombos && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Combos Disponibles</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="combo"
                    value=""
                    checked={selectedCombo === null}
                    onChange={() => setSelectedCombo(null)}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <span className="font-medium">Sin Combo</span>
                    <p className="text-sm text-gray-600">Solo el producto principal</p>
                  </div>
                  <span className="text-sm font-medium">+0.00 zł</span>
                </label>

                {productCombos.map((combo: any, index: number) => (
                  <label
                    key={`specific-${index}`}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-yellow-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="combo"
                      value={combo.name || ''}
                      checked={selectedCombo !== null && selectedCombo.name === combo.name}
                      onChange={() => handleComboSelection(combo)}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{combo.name || ''}</span>
                      <p className="text-sm text-gray-600">{combo.description || ''}</p>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">
                      +{(combo.price || 0).toFixed(2)} zł
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Ingredientes Extra - CORREGIDO para mostrar precios reales */}
          {product.customizable && extraIngredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Ingredientes Extra</h3>
              <div className="grid grid-cols-2 gap-2">
                {extraIngredients.map((ingredient: any, index: number) => {
                  const ingredientName = ingredient.name || '';
                  const ingredientPrice = parseFloat(ingredient.price) || 0;
                  const isChecked = customizations.includes(`add-${ingredientName}-${ingredientPrice}`);
                  
                  return (
                    <label
                      key={index}
                      className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-orange-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCustomization(ingredientName, ingredientPrice, 'add')}
                        className="rounded"
                      />
                      <span className="text-sm">
                        {ingredientName} (+{ingredientPrice.toFixed(2)} zł)
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quitar Ingredientes */}
          {product.customizable && productIngredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Quitar Ingredientes</h3>
              <div className="grid grid-cols-2 gap-2">
                {productIngredients.map((ingredient: string, index: number) => {
                  const isChecked = customizations.includes(`remove-${ingredient}-0`);
                  
                  return (
                    <label
                      key={index}
                      className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCustomization(ingredient, 0, 'remove')}
                        className="rounded"
                      />
                      <span className="text-sm">Sin {ingredient}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comentarios */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Comentarios Adicionales</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Escribe aquí cualquier comentario especial sobre el producto..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">{comments.length}/500 caracteres</div>
          </div>

          {/* Cantidad */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">Cantidad</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={decreaseQuantity}
                className="w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-subtract-line"></i>
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="w-10 h-10 bg-orange-500 text-white rounded-full hover:bg-orange-600 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-add-line"></i>
              </button>
            </div>
          </div>

          {/* Resumen de precios - CORREGIDO para mostrar precios reales */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Producto base:</span>
                <span>{product.price.toFixed(2)} zł</span>
              </div>

              {customizationPrice > 0 && (
                <div className="flex justify-between">
                  <span>Ingredientes extra:</span>
                  <span>+{customizationPrice.toFixed(2)} zł</span>
                </div>
              )}

              {selectedCombo && (
                <div className="flex justify-between">
                  <span>Combo ({selectedCombo.name}):</span>
                  <span>+{comboPrice.toFixed(2)} zł</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Cantidad:</span>
                <span>x{quantity}</span>
              </div>

              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Subtotal:</span>
                <span>{totalPrice.toFixed(2)} zł</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-2xl font-bold text-orange-600">Total: {totalPrice.toFixed(2)} zł</div>
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
