
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface MenuCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  menuStyleSettings: any;
}

export default function MenuCategories({ selectedCategory, onCategoryChange, menuStyleSettings }: MenuCategoriesProps) {
  const [categories, setCategories] = useState([
    { key: 'hamburguesas', name: 'Hamburguesas' },
    { key: 'salchipapa', name: 'Salchipapa' },
    { key: 'burritos', name: 'Burritos' },
    { key: 'emparedado', name: 'Emparedado' },
    { key: 'asados', name: 'Asados' },
    { key: 'papas-locas', name: 'Papas Locas' },
    { key: 'bebidas', name: 'Bebidas' }
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar categorías optimizado
  useEffect(() => {
    if (isLoaded) return;

    const loadCategories = () => {
      try {
        const savedCategories = localStorage.getItem('menuCategories');
        if (savedCategories) {
          const loadedCategories = JSON.parse(savedCategories);
          if (Array.isArray(loadedCategories) && loadedCategories.length > 0) {
            setCategories(loadedCategories.map(cat => ({
              key: cat.key,
              name: typeof cat.names === 'string' ? cat.names : cat.name || cat.key
            })));
          }
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadCategories();
  }, [isLoaded]);

  // Handler optimizado para cambio de categoría
  const handleCategoryClick = useCallback((categoryKey: string) => {
    onCategoryChange(categoryKey);
    
    // Desplazamiento suave hacia los productos
    setTimeout(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }, [onCategoryChange]);

  // Handler optimizado para hover de botones
  const handleButtonHover = useCallback((e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean, categoryKey: string) => {
    if (selectedCategory !== categoryKey) {
      e.currentTarget.style.backgroundColor = isEnter 
        ? menuStyleSettings.categoryButtonHoverColor 
        : menuStyleSettings.categoryButtonInactiveColor;
    }
  }, [selectedCategory, menuStyleSettings.categoryButtonHoverColor, menuStyleSettings.categoryButtonInactiveColor]);

  // Nombre de categoría seleccionada memoizado
  const selectedCategoryName = useMemo(() => {
    return categories.find(cat => cat.key === selectedCategory)?.name || 'Hamburguesas';
  }, [categories, selectedCategory]);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: menuStyleSettings.sectionTitleColor }}
          >
            Nuestro Delicioso Menú
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: menuStyleSettings.sectionDescriptionColor }}
          >
            Explora nuestras categorías y descubre los sabores únicos que tenemos para ti
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.key;
            
            return (
              <button
                key={category.key}
                onClick={() => handleCategoryClick(category.key)}
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md transform hover:scale-105"
                style={{
                  backgroundColor: isSelected 
                    ? menuStyleSettings.categoryButtonActiveColor 
                    : menuStyleSettings.categoryButtonInactiveColor,
                  color: isSelected 
                    ? menuStyleSettings.categoryButtonActiveTextColor 
                    : menuStyleSettings.categoryButtonInactiveTextColor,
                }}
                onMouseEnter={(e) => handleButtonHover(e, true, category.key)}
                onMouseLeave={(e) => handleButtonHover(e, false, category.key)}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Indicador visual de categoría seleccionada */}
        <div className="text-center mt-6">
          <div 
            className="inline-flex items-center rounded-full px-6 py-3 shadow-md"
            style={{ backgroundColor: menuStyleSettings.productCardBackgroundColor }}
          >
            <i 
              className="ri-restaurant-line mr-2"
              style={{ color: menuStyleSettings.categoryButtonActiveColor }}
            ></i>
            <span 
              className="font-medium"
              style={{ color: menuStyleSettings.productTitleColor }}
            >
              Categoría seleccionada: {selectedCategoryName}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
