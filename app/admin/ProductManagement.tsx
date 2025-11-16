
'use client';
import { useState, useEffect } from 'react';
import { menuData } from '../../lib/menuData';
import ImageUploader from '../../components/ImageUploader';

export default function ProductManagement() {
  const [products, setProducts] = useState(menuData);
  const [categories, setCategories] = useState([
    { key: 'hamburguesas', name: 'Hamburguesas' },
    { key: 'hotdogs', name: 'Hot Dogs' },
    { key: 'burritos', name: 'Burritos' },
    { key: 'bebidas', name: 'Bebidas' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('hamburguesas');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExtrasManagement, setShowExtrasManagement] = useState(false);
  const [showCombosManagement, setShowCombosManagement] = useState(false);
  
  const [extraIngredientsByCategory, setExtraIngredientsByCategory] = useState<any>({
    hamburguesas: [
      { name: 'Queso extra', price: 2 },
      { name: 'Bacon', price: 3 },
      { name: 'Aguacate', price: 2.5 },
      { name: 'Cebolla caramelizada', price: 1.5 },
      { name: 'Jalapeños', price: 1 },
      { name: 'Tomate extra', price: 1 }
    ],
    hotdogs: [
      { name: 'Queso cheddar', price: 2 },
      { name: 'Chili con carne', price: 3 },
      { name: 'Cebolla frita', price: 1.5 },
      { name: 'Jalapeños', price: 1 },
      { name: 'Tocino', price: 2.5 }
    ],
    burritos: [
      { name: 'Guacamole', price: 3 },
      { name: 'Crema agria', price: 2 },
      { name: 'Queso extra', price: 2 },
      { name: 'Jalapeños', price: 1 },
      { name: 'Pico de gallo', price: 1.5 }
    ],
    bebidas: []
  });

  const [combosByProduct, setCombosByProduct] = useState<any>({});

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    ingredients: [],
    customizable: true,
    available: true,
    image: '',
    imageId: ''
  });

  // Función para obtener combos de un producto de forma segura
  const getProductCombos = (productId: number) => {
    try {
      const combos = combosByProduct[productId];
      return Array.isArray(combos) ? combos : [];
    } catch (error) {
      console.error('Error obteniendo combos del producto:', error);
      return [];
    }
  };

  // Función para obtener ingredientes extra de una categoría de forma segura
  const getCategoryExtraIngredients = (categoryKey: string) => {
    try {
      const ingredients = extraIngredientsByCategory[categoryKey];
      return Array.isArray(ingredients) ? ingredients : [];
    } catch (error) {
      console.error('Error obteniendo ingredientes extra de la categoría:', error);
      return [];
    }
  };

  useEffect(() => {
    const savedCategories = localStorage.getItem('menuCategories');
    if (savedCategories) {
      try {
        const loadedCategories = JSON.parse(savedCategories);
        setCategories(loadedCategories);
        
        if (!loadedCategories.some((cat: any) => cat.key === selectedCategory)) {
          setSelectedCategory(loadedCategories[0]?.key || 'hamburguesas');
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    }

    const savedProducts = localStorage.getItem('menuProducts');
    if (savedProducts) {
      try {
        const loadedProducts = JSON.parse(savedProducts);
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProducts(menuData);
      }
    }

    const savedExtrasByCategory = localStorage.getItem('extraIngredientsByCategory');
    if (savedExtrasByCategory) {
      try {
        const loadedExtras = JSON.parse(savedExtrasByCategory);
        // Validar que cada valor sea un array
        const validatedExtras: any = {};
        Object.keys(loadedExtras).forEach(categoryKey => {
          const ingredients = loadedExtras[categoryKey];
          validatedExtras[categoryKey] = Array.isArray(ingredients) ? ingredients : [];
        });
        setExtraIngredientsByCategory(validatedExtras);
      } catch (error) {
        console.error('Error cargando extras por categoría:', error);
      }
    }

    const savedCombosByProduct = localStorage.getItem('combosByProduct');
    if (savedCombosByProduct) {
      try {
        const loadedCombos = JSON.parse(savedCombosByProduct);
        // Validar que cada valor sea un array
        const validatedCombos: any = {};
        Object.keys(loadedCombos).forEach(productId => {
          const combos = loadedCombos[productId];
          validatedCombos[productId] = Array.isArray(combos) ? combos : [];
        });
        setCombosByProduct(validatedCombos);
      } catch (error) {
        console.error('Error cargando combos por producto:', error);
        setCombosByProduct({});
      }
    }
  }, []);

  const saveExtraIngredients = () => {
    // Validar que todos los valores sean arrays antes de guardar
    const validatedExtras: any = {};
    Object.keys(extraIngredientsByCategory).forEach(categoryKey => {
      const ingredients = extraIngredientsByCategory[categoryKey];
      validatedExtras[categoryKey] = Array.isArray(ingredients) ? ingredients : [];
    });
    localStorage.setItem('extraIngredientsByCategory', JSON.stringify(validatedExtras));
  };

  const saveCombos = () => {
    try {
      // Crear una copia completamente independiente del estado actual
      const currentCombos = JSON.parse(JSON.stringify(combosByProduct));
      
      // Validar que todos los valores sean arrays antes de guardar
      const validatedCombos: any = {};
      
      // Obtener todos los productos actuales para asegurar que solo guardemos combos de productos existentes
      const allProductIds = new Set<number>();
      Object.keys(products).forEach(categoryKey => {
        const categoryProducts = products[categoryKey as keyof typeof products] || [];
        categoryProducts.forEach((product: any) => {
          allProductIds.add(product.id);
        });
      });
      
      // Validar y limpiar combos por producto de forma individual
      Object.keys(currentCombos).forEach(productIdStr => {
        const productId = parseInt(productIdStr);
        
        // Solo incluir combos de productos que existen
        if (allProductIds.has(productId)) {
          const combos = currentCombos[productIdStr];
          
          if (Array.isArray(combos)) {
            // Validar cada combo individualmente para este producto específico
            const validCombos = combos.filter((combo: any) => {
              return combo && 
                     typeof combo.name === 'string' && 
                     combo.name.trim() !== '' &&
                     typeof combo.description === 'string' && 
                     combo.description.trim() !== '' &&
                     typeof combo.price === 'number' && 
                     combo.price > 0;
            }).map((combo: any) => ({
              name: combo.name.trim(),
              description: combo.description.trim(),
              price: parseFloat(combo.price.toFixed(2)),
              productId: productId // Agregar ID del producto para mayor seguridad
            }));
            
            // Solo guardar si hay combos válidos para este producto específico
            if (validCombos.length > 0) {
              validatedCombos[productIdStr] = validCombos;
            }
          }
        }
      });
      
      // Guardar en localStorage de forma atómica
      localStorage.setItem('combosByProduct', JSON.stringify(validatedCombos));
      
      // Actualizar el estado local con los datos validados de forma inmutable
      setCombosByProduct(prevState => {
        // Crear un nuevo objeto completamente independiente
        const newState = {};
        Object.keys(validatedCombos).forEach(productId => {
          newState[productId] = [...validatedCombos[productId]];
        });
        return newState;
      });
      
      // Mostrar mensaje de éxito detallado
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.innerHTML = `✅ Combos guardados exitosamente<br><small>Se guardaron combos para ${Object.keys(validatedCombos).length} productos</small>`;
      document.body.appendChild(successMessage);
      
      // Remover mensaje después de 4 segundos
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 4000);
      
      console.log('Combos guardados exitosamente por producto:', validatedCombos);
      
    } catch (error) {
      console.error('Error guardando combos:', error);
      
      // Mostrar mensaje de error
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.innerHTML = '❌ Error al guardar los cambios de combos<br><small>Por favor, intenta nuevamente</small>';
      document.body.appendChild(errorMessage);
      
      // Remover mensaje después de 4 segundos
      setTimeout(() => {
        if (document.body.contains(errorMessage)) {
          document.body.removeChild(errorMessage);
        }
      }, 4000);
    }
  };

  const addExtraIngredient = (category: string, name: string, price: number) => {
    if (!name.trim() || price <= 0) return;
    
    const updated = { ...extraIngredientsByCategory };
    
    if (!Array.isArray(updated[category])) {
      updated[category] = [];
    }
    
    if (!updated[category].some((item: any) => item.name === name.trim())) {
      updated[category] = [...updated[category], { name: name.trim(), price }];
      setExtraIngredientsByCategory(updated);
    }
  };

  const removeExtraIngredient = (category: string, index: number) => {
    const updated = { ...extraIngredientsByCategory };
    if (Array.isArray(updated[category])) {
      updated[category].splice(index, 1);
      setExtraIngredientsByCategory(updated);
    }
  };

  const updateExtraIngredient = (category: string, index: number, field: 'name' | 'price', value: string | number) => {
    const updated = { ...extraIngredientsByCategory };
    
    if (Array.isArray(updated[category]) && updated[category][index]) {
      if (field === 'name') {
        updated[category][index].name = value as string;
      } else {
        updated[category][index].price = parseFloat(value as string) || 0;
      }
      setExtraIngredientsByCategory(updated);
    }
  };

  const addCombo = (productId: number, name: string, description: string, price: number) => {
    if (!name.trim() || !description.trim() || price <= 0) {
      alert('Por favor, completa todos los campos del combo correctamente');
      return;
    }
    
    // Crear una copia completamente independiente del estado actual
    const updated = JSON.parse(JSON.stringify(combosByProduct));
    
    // Asegurar que sea un array para este producto específico
    if (!Array.isArray(updated[productId])) {
      updated[productId] = [];
    }
    
    // Verificar que no exista un combo con el mismo nombre SOLO para este producto específico
    const existingCombo = updated[productId].find((item: any) => 
      item.name && item.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    
    if (existingCombo) {
      alert(`Ya existe un combo llamado "${name}" para este producto específico`);
      return;
    }
    
    // Agregar el nuevo combo SOLO a este producto específico
    const newCombo = { 
      name: name.trim(), 
      description: description.trim(), 
      price: parseFloat(price.toFixed(2)),
      productId: productId // Identificador del producto para mayor seguridad
    };
    
    // Crear un nuevo array para este producto específico
    updated[productId] = [...updated[productId], newCombo];
    
    // Actualizar el estado de forma inmutable
    setCombosByProduct(prevState => {
      const newState = { ...prevState };
      newState[productId] = [...updated[productId]];
      return newState;
    });
    
    console.log(`Combo "${name}" agregado EXCLUSIVAMENTE al producto ${productId}:`, newCombo);
  };

  const removeCombo = (productId: number, index: number) => {
    // Crear una copia completamente independiente del estado actual
    const updated = JSON.parse(JSON.stringify(combosByProduct));
    
    if (Array.isArray(updated[productId]) && updated[productId][index]) {
      const removedCombo = updated[productId][index];
      
      // Crear un nuevo array sin el elemento eliminado
      updated[productId] = updated[productId].filter((_: any, idx: number) => idx !== index);
      
      // Si no quedan combos, eliminar la entrada del producto
      if (updated[productId].length === 0) {
        delete updated[productId];
      }
      
      // Actualizar el estado de forma inmutable
      setCombosByProduct(prevState => {
        const newState = { ...prevState };
        if (updated[productId] && updated[productId].length > 0) {
          newState[productId] = [...updated[productId]];
        } else {
          delete newState[productId];
        }
        return newState;
      });
      
      console.log(`Combo "${removedCombo.name}" eliminado EXCLUSIVAMENTE del producto ${productId}`);
    }
  };

  const updateCombo = (productId: number, index: number, field: 'name' | 'description' | 'price', value: string | number) => {
    // Crear una copia completamente independiente del estado actual
    const updated = JSON.parse(JSON.stringify(combosByProduct));
    
    if (Array.isArray(updated[productId]) && updated[productId][index]) {
      const oldValue = updated[productId][index][field];
      
      if (field === 'price') {
        const numericValue = parseFloat(value as string);
        if (isNaN(numericValue) || numericValue <= 0) {
          alert('El precio debe ser un número mayor a 0');
          return;
        }
        updated[productId][index][field] = parseFloat(numericValue.toFixed(2));
      } else {
        const stringValue = (value as string).trim();
        if (stringValue === '') {
          alert(`El campo ${field === 'name' ? 'nombre' : 'descripción'} no puede estar vacío`);
          return;
        }
        
        // Verificar duplicados de nombre SOLO para este producto específico
        if (field === 'name') {
          const duplicateIndex = updated[productId].findIndex((combo: any, idx: number) => 
            idx !== index && combo.name && combo.name.toLowerCase() === stringValue.toLowerCase()
          );
          
          if (duplicateIndex !== -1) {
            alert(`Ya existe un combo llamado "${stringValue}" para este producto específico`);
            return;
          }
        }
        
        updated[productId][index][field] = stringValue;
      }
      
      // Asegurar que el productId esté presente
      updated[productId][index].productId = productId;
      
      // Actualizar el estado de forma inmutable
      setCombosByProduct(prevState => {
        const newState = { ...prevState };
        newState[productId] = [...updated[productId]];
        return newState;
      });
      
      console.log(`Combo del producto ${productId} actualizado EXCLUSIVAMENTE - ${field}: ${oldValue} → ${updated[productId][index][field]}`);
    }
  };

  const deleteProduct = (categoryKey: string, productId: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const updatedProducts = { ...products };
      const categoryProducts = updatedProducts[categoryKey as keyof typeof updatedProducts];
      const filteredProducts = categoryProducts.filter(p => p.id !== productId);
      updatedProducts[categoryKey as keyof typeof updatedProducts] = filteredProducts;
      
      setProducts(updatedProducts);
      localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
      
      const updatedCombos = { ...combosByProduct };
      delete updatedCombos[productId];
      setCombosByProduct(updatedCombos);
      localStorage.setItem('combosByProduct', JSON.stringify(updatedCombos));
    }
  };

  const toggleProductAvailability = (categoryKey: string, productId: number) => {
    const updatedProducts = { ...products };
    const categoryProducts = updatedProducts[categoryKey as keyof typeof updatedProducts];
    const productIndex = categoryProducts.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
      categoryProducts[productIndex].available = !categoryProducts[productIndex].available;
      setProducts(updatedProducts);
      localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
    }
  };

  const moveProduct = (categoryKey: string, productId: number, direction: 'up' | 'down') => {
    const updatedProducts = { ...products };
    const categoryProducts = updatedProducts[categoryKey as keyof typeof updatedProducts];
    const productIndex = categoryProducts.findIndex(p => p.id === productId);
    
    if (productIndex === -1) return;
    
    const newIndex = direction === 'up' ? productIndex - 1 : productIndex + 1;
    
    if (newIndex < 0 || newIndex >= categoryProducts.length) return;
    
    const temp = categoryProducts[productIndex];
    categoryProducts[productIndex] = categoryProducts[newIndex];
    categoryProducts[newIndex] = temp;
    
    setProducts(updatedProducts);
    localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
  };

  const moveCategory = (categoryKey: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(cat => cat.key === categoryKey);
    
    if (categoryIndex === -1) return;
    
    const newIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
    
    if (newIndex < 0 || newIndex >= categories.length) return;
    
    const updatedCategories = [...categories];
    const temp = updatedCategories[categoryIndex];
    updatedCategories[categoryIndex] = updatedCategories[newIndex];
    updatedCategories[newIndex] = temp;
    
    setCategories(updatedCategories);
    localStorage.setItem('menuCategories', JSON.stringify(updatedCategories));
  };

  // Nueva función para agregar categoría
  const addNewCategory = () => {
    const categoryName = prompt('Ingresa el nombre de la nueva categoría:');
    if (!categoryName || !categoryName.trim()) return;
    
    const categoryKey = categoryName.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
    
    // Verificar que no exista ya
    if (categories.some(cat => cat.key === categoryKey)) {
      alert('Ya existe una categoría con ese nombre');
      return;
    }
    
    const newCategory = {
      key: categoryKey,
      name: categoryName.trim()
    };
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('menuCategories', JSON.stringify(updatedCategories));
    
    // Inicializar productos vacíos para la nueva categoría
    const updatedProducts = { ...products };
    updatedProducts[categoryKey as keyof typeof updatedProducts] = [];
    setProducts(updatedProducts);
    localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
    
    // Inicializar ingredientes extra vacíos para la nueva categoría
    const updatedExtras = { ...extraIngredientsByCategory };
    updatedExtras[categoryKey] = [];
    setExtraIngredientsByCategory(updatedExtras);
    localStorage.setItem('extraIngredientsByCategory', JSON.stringify(updatedExtras));
    
    alert(`Categoría "${categoryName}" agregada exitosamente`);
  };

  // Nueva función para eliminar categoría
  const deleteCategory = (categoryKey: string) => {
    if (categories.length <= 1) {
      alert('No puedes eliminar la última categoría');
      return;
    }
    
    const category = categories.find(cat => cat.key === categoryKey);
    if (!category) return;
    
    const categoryProducts = products[categoryKey as keyof typeof products] || [];
    
    if (categoryProducts.length > 0) {
      if (!confirm(`La categoría "${category.name}" tiene ${categoryProducts.length} productos. ¿Estás seguro de eliminarla? Todos los productos se perderán.`)) {
        return;
      }
    } else {
      if (!confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
        return;
      }
    }
    
    // Eliminar categoría
    const updatedCategories = categories.filter(cat => cat.key !== categoryKey);
    setCategories(updatedCategories);
    localStorage.setItem('menuCategories', JSON.stringify(updatedCategories));
    
    // Eliminar productos de la categoría
    const updatedProducts = { ...products };
    delete updatedProducts[categoryKey as keyof typeof updatedProducts];
    setProducts(updatedProducts);
    localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
    
    // Eliminar ingredientes extra de la categoría
    const updatedExtras = { ...extraIngredientsByCategory };
    delete updatedExtras[categoryKey];
    setExtraIngredientsByCategory(updatedExtras);
    localStorage.setItem('extraIngredientsByCategory', JSON.stringify(updatedExtras));
    
    // Eliminar combos de productos de la categoría
    const updatedCombos = { ...combosByProduct };
    categoryProducts.forEach((product: any) => {
      delete updatedCombos[product.id];
    });
    setCombosByProduct(updatedCombos);
    localStorage.setItem('combosByProduct', JSON.stringify(updatedCombos));
    
    // Cambiar a la primera categoría disponible
    if (selectedCategory === categoryKey) {
      setSelectedCategory(updatedCategories[0]?.key || '');
    }
    
    alert(`Categoría "${category.name}" eliminada exitosamente`);
  };

  // Nueva función para editar nombre de categoría
  const editCategoryName = (categoryKey: string) => {
    const category = categories.find(cat => cat.key === categoryKey);
    if (!category) return;
    
    const newName = prompt('Ingresa el nuevo nombre de la categoría:', category.name);
    if (!newName || !newName.trim() || newName.trim() === category.name) return;
    
    const updatedCategories = categories.map(cat => 
      cat.key === categoryKey 
        ? { ...cat, name: newName.trim() }
        : cat
    );
    
    setCategories(updatedCategories);
    localStorage.setItem('menuCategories', JSON.stringify(updatedCategories));
    
    alert(`Categoría renombrada a "${newName.trim()}" exitosamente`);
  };

  const saveProduct = (product: any, isNew: boolean = false) => {
    try {
      const updatedProducts = { ...products };
      
      if (!updatedProducts[selectedCategory as keyof typeof updatedProducts]) {
        updatedProducts[selectedCategory as keyof typeof updatedProducts] = [];
      }
      
      if (isNew) {
        if (!product.name || !product.price || product.price <= 0) {
          throw new Error('Todos los campos son requeridos');
        }

        const categoryProducts = updatedProducts[selectedCategory as keyof typeof updatedProducts];
        const newId = categoryProducts.length > 0 ? Math.max(...categoryProducts.map(p => p.id)) + 1 : 1;
        
        const productWithId = { 
          ...product, 
          id: newId,
          ingredients: Array.isArray(product.ingredients) ? product.ingredients : []
        };
        
        categoryProducts.push(productWithId);
        
      } else {
        const categoryProducts = updatedProducts[selectedCategory as keyof typeof updatedProducts];
        const productIndex = categoryProducts.findIndex(p => p.id === product.id);
        
        if (productIndex !== -1) {
          categoryProducts[productIndex] = {
            ...product,
            ingredients: Array.isArray(product.ingredients) ? product.ingredients : []
          };
        }
      }
      
      setProducts(updatedProducts);
      localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
      
      setEditingProduct(null);
      setShowAddForm(false);
      
      setNewProduct({
        name: '',
        price: 0,
        ingredients: [],
        customizable: true,
        available: true,
        image: '',
        imageId: ''
      });
      
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const addIngredient = (ingredient: string, isEditing: boolean = false) => {
    if (!ingredient.trim()) return;
    
    if (isEditing && editingProduct) {
      const updated = { ...editingProduct };
      if (!Array.isArray(updated.ingredients)) {
        updated.ingredients = [];
      }
      updated.ingredients = [...updated.ingredients, ingredient.trim()];
      setEditingProduct(updated);
    } else {
      const updated = { ...newProduct };
      if (!Array.isArray(updated.ingredients)) {
        updated.ingredients = [];
      }
      updated.ingredients = [...updated.ingredients, ingredient.trim()];
      setNewProduct(updated);
    }
  };

  const removeIngredient = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingProduct) {
      const updated = { ...editingProduct };
      if (Array.isArray(updated.ingredients)) {
        updated.ingredients.splice(index, 1);
        setEditingProduct(updated);
      }
    } else {
      const updated = { ...newProduct };
      if (Array.isArray(updated.ingredients)) {
        updated.ingredients.splice(index, 1);
        setNewProduct(updated);
      }
    }
  };

  const currentProducts = products[selectedCategory as keyof typeof products] || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Productos</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowExtrasManagement(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-add-circle-line mr-2"></i>
            Gestionar Extras
          </button>
          <button
            onClick={() => setShowCombosManagement(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-gift-line mr-2"></i>
            Gestionar Combos
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-add-line mr-2"></i>
            Agregar Producto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Gestión de Categorías</h3>
          <button
            onClick={addNewCategory}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer flex items-center"
          >
            <i className="ri-add-line mr-2"></i>
            Agregar Categoría
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {categories.map((category, index) => (
            <div key={category.key} className="flex items-center bg-gray-50 rounded-lg p-3">
              <span className="font-medium text-gray-700 mr-3">
                {category.name}
              </span>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => moveCategory(category.key, 'up')}
                  disabled={index === 0}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
                    index === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  }`}
                  title="Subir"
                >
                  <i className="ri-arrow-up-line"></i>
                </button>
                <button
                  onClick={() => moveCategory(category.key, 'down')}
                  disabled={index === categories.length - 1}
                  className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
                    index === categories.length - 1 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  }`}
                  title="Bajar"
                >
                  <i className="ri-arrow-down-line"></i>
                </button>
                <button
                  onClick={() => editCategoryName(category.key)}
                  className="w-6 h-6 flex items-center justify-center rounded text-xs bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer transition-colors"
                  title="Editar nombre"
                >
                  <i className="ri-edit-line"></i>
                </button>
                {categories.length > 1 && (
                  <button
                    onClick={() => deleteCategory(category.key)}
                    className="w-6 h-6 flex items-center justify-center rounded text-xs bg-red-500 text-white hover:bg-red-600 cursor-pointer transition-colors"
                    title="Eliminar categoría"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === category.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product, index) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img 
              src={product.image || 'https://readdy.ai/api/search-image?query=delicious%20food%20item%20on%20white%20background%2C%20minimalist%20style%2C%20high%20quality%20product%20photography&width=400&height=300&seq=default-product&orientation=landscape'} 
              alt={product.name}
              className="w-full h-48 object-cover object-top"
            />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800 flex-1">
                  {product.name}
                </h3>
                
                <div className="flex flex-col ml-2">
                  <button
                    onClick={() => moveProduct(selectedCategory, product.id, 'up')}
                    disabled={index === 0}
                    className={`w-6 h-6 flex items-center justify-center rounded text-xs mb-1 transition-colors ${
                      index === 0 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                    }`}
                    title="Subir"
                  >
                    <i className="ri-arrow-up-line"></i>
                  </button>
                  <button
                    onClick={() => moveProduct(selectedCategory, product.id, 'down')}
                    disabled={index === currentProducts.length - 1}
                    className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
                      index === currentProducts.length - 1 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                    }`}
                    title="Bajar"
                  >
                    <i className="ri-arrow-down-line"></i>
                  </button>
                </div>
              </div>
              
              <p className="text-2xl font-bold text-blue-600 mb-4">{product.price} zł</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.available ? 'Disponible' : 'Agotado'}
                </span>
                
                {product.customizable && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Personalizable
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Editar
                </button>
                
                <button
                  onClick={() => toggleProductAvailability(selectedCategory, product.id)}
                  className={`flex-1 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    product.available 
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {product.available ? 'Agotar' : 'Disponible'}
                </button>

                <button
                  onClick={() => deleteProduct(selectedCategory, product.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Gestión de Combos */}
      {showCombosManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Gestión de Combos</h3>
                <button 
                  onClick={() => setShowCombosManagement(false)}
                  className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <p className="text-gray-600 mb-6">Configura los combos específicos para cada producto</p>

              {currentProducts.map((product) => (
                <div key={product.id} className="mb-8 border-b pb-6 last:border-b-0">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Combos para {product.name}
                  </h4>
                  
                  <div className="border rounded-lg p-4">
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {getProductCombos(product.id).map((combo: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <input
                              type="text"
                              value={combo.name}
                              onChange={(e) => updateCombo(product.id, index, 'name', e.target.value)}
                              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm mr-2"
                              placeholder="Nombre del Combo"
                            />
                            <button
                              onClick={() => removeCombo(product.id, index)}
                              className="text-red-600 hover:text-red-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                          <div className="mb-2">
                            <textarea
                              value={combo.description}
                              onChange={(e) => updateCombo(product.id, index, 'description', e.target.value)}
                              className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Descripción del Combo"
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Precio del Combo:</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={combo.price}
                              onChange={(e) => updateCombo(product.id, index, 'price', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-sm text-gray-600 ml-1">zł</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <h6 className="font-medium mb-2 text-sm">Agregar Combo</h6>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Nombre del nuevo combo"
                          id={`new-combo-name-${product.id}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <textarea
                          placeholder="Descripción del nuevo combo"
                          id={`new-combo-description-${product.id}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          rows={2}
                        />
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="8.00"
                            id={`new-combo-price-${product.id}`}
                            className="w-24 px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                          <span className="flex items-center text-sm text-gray-600">zł</span>
                          <button
                            onClick={() => {
                              const nameInput = document.getElementById(`new-combo-name-${product.id}`) as HTMLInputElement;
                              const descriptionInput = document.getElementById(`new-combo-description-${product.id}`) as HTMLTextAreaElement;
                              const priceInput = document.getElementById(`new-combo-price-${product.id}`) as HTMLInputElement;
                              
                              const name = nameInput?.value.trim();
                              const description = descriptionInput?.value.trim();
                              const price = parseFloat(priceInput?.value) || 0;
                              
                              if (name && description && price > 0) {
                                addCombo(product.id, name, description, price);
                                nameInput.value = '';
                                descriptionInput.value = '';
                                priceInput.value = '';
                              }
                            }}
                            className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors cursor-pointer"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex space-x-4 pt-6 border-t mt-6">
                <button
                  onClick={() => {
                    saveCombos();
                    setShowCombosManagement(false);
                  }}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Guardar Cambios de Combos
                </button>
                <button
                  onClick={() => setShowCombosManagement(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestión de Extras */}
      {showExtrasManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Gestión de Productos Extras</h3>
                <button 
                  onClick={() => setShowExtrasManagement(false)}
                  className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <p className="text-gray-600 mb-6">Configura los ingredientes extras específicos para cada categoría</p>

              {categories.map((category) => (
                <div key={category.key} className="mb-8 border-b pb-6 last:border-b-0">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Extras para {category.name}
                  </h4>
                  
                  <div className="border rounded-lg p-4">
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {getCategoryExtraIngredients(category.key).map((ingredient: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <input
                              type="text"
                              value={ingredient.name}
                              onChange={(e) => updateExtraIngredient(category.key, index, 'name', e.target.value)}
                              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm mr-2"
                              placeholder="Nombre del Ingrediente"
                            />
                            <button
                              onClick={() => removeExtraIngredient(category.key, index)}
                              className="text-red-600 hover:text-red-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Precio del Ingrediente:</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={ingredient.price}
                              onChange={(e) => updateExtraIngredient(category.key, index, 'price', e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-sm text-gray-600 ml-1">zł</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <h6 className="font-medium mb-2 text-sm">Agregar Ingrediente Extra</h6>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="Nombre del nuevo ingrediente"
                          id={`new-ingredient-name-${category.key}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="2.00"
                          id={`new-ingredient-price-${category.key}`}
                          className="w-24 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <span className="flex items-center text-sm text-gray-600">zł</span>
                        <button
                          onClick={() => {
                            const nameInput = document.getElementById(`new-ingredient-name-${category.key}`) as HTMLInputElement;
                            const priceInput = document.getElementById(`new-ingredient-price-${category.key}`) as HTMLInputElement;
                            
                            const name = nameInput?.value.trim();
                            const price = parseFloat(priceInput?.value) || 0;
                            
                            if (name && price > 0) {
                              addExtraIngredient(category.key, name, price);
                              nameInput.value = '';
                              priceInput.value = '';
                            }
                          }}
                          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex space-x-4 pt-6 border-t mt-6">
                <button
                  onClick={() => {
                    saveExtraIngredients();
                    setShowExtrasManagement(false);
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Guardar Cambios de Extras
                </button>
                <button
                  onClick={() => setShowExtrasManagement(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar/Editar Producto */}
      {(showAddForm || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
                </h3>
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setShowAddForm(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                saveProduct(editingProduct || newProduct, !editingProduct);
              }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Imagen del Producto</label>
                    <ImageUploader
                      category={`product-${selectedCategory}`}
                      currentImageUrl={editingProduct ? editingProduct.image : newProduct.image}
                      onImageUploaded={(imageUrl, imageId) => {
                        if (editingProduct) {
                          setEditingProduct({
                            ...editingProduct,
                            image: imageUrl,
                            imageId: imageId
                          });
                        } else {
                          setNewProduct({
                            ...newProduct,
                            image: imageUrl,
                            imageId: imageId
                          });
                        }
                      }}
                      onImageDeleted={() => {
                        if (editingProduct) {
                          setEditingProduct({
                            ...editingProduct,
                            image: '',
                            imageId: ''
                          });
                        } else {
                          setNewProduct({
                            ...newProduct,
                            image: '',
                            imageId: ''
                          });
                        }
                      }}
                      maxWidth={400}
                      maxHeight={300}
                      label="Subir Imagen del Producto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct ? editingProduct.name : newProduct.name}
                      onChange={(e) => {
                        if (editingProduct) {
                          setEditingProduct({
                            ...editingProduct,
                            name: e.target.value
                          });
                        } else {
                          setNewProduct({
                            ...newProduct,
                            name: e.target.value
                          });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio (zł)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={editingProduct ? editingProduct.price : newProduct.price}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value) || 0;
                        if (editingProduct) {
                          setEditingProduct({ ...editingProduct, price });
                        } else {
                          setNewProduct({ ...newProduct, price });
                        }
                      }}
                      className="w-full px-4 py-2 border border-Gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Ingredientes</label>
                    <div className="border rounded-lg p-4">
                      <div className="space-y-2 mb-2">
                        {(editingProduct 
                          ? (Array.isArray(editingProduct.ingredients) ? editingProduct.ingredients : [])
                          : (Array.isArray(newProduct.ingredients) ? newProduct.ingredients : [])
                        ).map((ingredient: string, index: number) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                            <span>{ingredient}</span>
                            <button
                              type="button"
                              onClick={() => removeIngredient(index, !!editingProduct)}
                              className="text-red-600 hover:text-red-800 w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Agregar Ingrediente"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = e.currentTarget.value.trim();
                              if (value) {
                                addIngredient(value, !!editingProduct);
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct ? editingProduct.customizable : newProduct.customizable}
                        onChange={(e) => {
                          if (editingProduct) {
                            setEditingProduct({ ...editingProduct, customizable: e.target.checked });
                          } else {
                            setNewProduct({ ...newProduct, customizable: e.target.checked });
                          }
                        }}
                        className="mr-2"
                      />
                      Personalizable
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct ? editingProduct.available : newProduct.available}
                        onChange={(e) => {
                          if (editingProduct) {
                            setEditingProduct({ ...editingProduct, available: e.target.checked });
                          } else {
                            setNewProduct({ ...newProduct, available: e.target.checked });
                          }
                        }}
                        className="mr-2"
                      />
                      Disponible
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-6 border-t">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setShowAddForm(false);
                      }}
                      className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
