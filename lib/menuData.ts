export const cleanMultiLanguageData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const convertToString = (value: any): string => {
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null) {
        return value.es || value.en || value.pl || value.uk || Object.values(value)[0] || '';
      }
      return String(value || '');
    };

    const convertIngredients = (ingredients: any): string[] => {
      if (Array.isArray(ingredients)) {
        return ingredients.map(ingredient => convertToString(ingredient));
      }
      return [];
    };

    const menuProducts = localStorage.getItem('menuProducts');
    if (menuProducts) {
      try {
        const products = JSON.parse(menuProducts);
        let hasChanges = false;

        Object.keys(products).forEach(category => {
          if (Array.isArray(products[category])) {
            products[category] = products[category].map((product: any) => {
              const cleanProduct = { ...product };
              
              if (typeof product.name === 'object') {
                cleanProduct.name = convertToString(product.name);
                hasChanges = true;
              }
              
              if (product.ingredients && !Array.isArray(product.ingredients)) {
                cleanProduct.ingredients = convertIngredients(product.ingredients);
                hasChanges = true;
              } else if (Array.isArray(product.ingredients)) {
                const cleanIngredients = product.ingredients.map((ing: any) => convertToString(ing));
                if (JSON.stringify(cleanIngredients) !== JSON.stringify(product.ingredients)) {
                  cleanProduct.ingredients = cleanIngredients;
                  hasChanges = true;
                }
              }
              
              return cleanProduct;
            });
          }
        });

        if (hasChanges) {
          localStorage.setItem('menuProducts', JSON.stringify(products));
        }
      } catch (e) {
        console.error('Error cleaning menu products:', e);
      }
    }

    const menuCategories = localStorage.getItem('menuCategories');
    if (menuCategories) {
      try {
        const categories = JSON.parse(menuCategories);
        let hasChanges = false;

        const cleanCategories = categories.map((category: any) => {
          const cleanCategory = { ...category };
          
          if (typeof category.name === 'object') {
            cleanCategory.name = convertToString(category.name);
            hasChanges = true;
          }
          
          return cleanCategory;
        });

        if (hasChanges) {
          localStorage.setItem('menuCategories', JSON.stringify(cleanCategories));
        }
      } catch (e) {
        console.error('Error cleaning menu categories:', e);
      }
    }

    const testimonials = localStorage.getItem('testimonials');
    if (testimonials) {
      try {
        const testimonialsData = JSON.parse(testimonials);
        let hasChanges = false;

        const cleanTestimonials = testimonialsData.map((testimonial: any) => {
          const cleanTestimonial = { ...testimonial };
          
          if (typeof testimonial.name === 'object') {
            cleanTestimonial.name = convertToString(testimonial.name);
            hasChanges = true;
          }
          
          if (typeof testimonial.text === 'object') {
            cleanTestimonial.text = convertToString(testimonial.text);
            hasChanges = true;
          }
          
          return cleanTestimonial;
        });

        if (hasChanges) {
          localStorage.setItem('testimonials', JSON.stringify(cleanTestimonials));
        }
      } catch (e) {
        console.error('Error cleaning testimonials:', e);
      }
    }

    const faqs = localStorage.getItem('faqs');
    if (faqs) {
      try {
        const faqsData = JSON.parse(faqs);
        let hasChanges = false;

        const cleanFaqs = faqsData.map((faq: any) => {
          const cleanFaq = { ...faq };
          
          if (typeof faq.question === 'object') {
            cleanFaq.question = convertToString(faq.question);
            hasChanges = true;
          }
          
          if (typeof faq.answer === 'object') {
            cleanFaq.answer = convertToString(faq.answer);
            hasChanges = true;
          }
          
          return cleanFaq;
        });

        if (hasChanges) {
          localStorage.setItem('faqs', JSON.stringify(cleanFaqs));
        }
      } catch (e) {
        console.error('Error cleaning FAQs:', e);
      }
    }

    const comboSettings = localStorage.getItem('comboSettings');
    if (comboSettings) {
      try {
        const combos = JSON.parse(comboSettings);
        let hasChanges = false;

        if (combos.productCombos && Array.isArray(combos.productCombos)) {
          combos.productCombos = combos.productCombos.map((combo: any) => {
            const cleanCombo = { ...combo };
            
            if (typeof combo.name === 'object') {
              cleanCombo.name = convertToString(combo.name);
              hasChanges = true;
            }
            
            if (typeof combo.description === 'object') {
              cleanCombo.description = convertToString(combo.description);
              hasChanges = true;
            }
            
            return cleanCombo;
          });
        }

        if (hasChanges) {
          localStorage.setItem('comboSettings', JSON.stringify(combos));
        }
      } catch (e) {
        console.error('Error cleaning combo settings:', e);
      }
    }

    const orders = localStorage.getItem('orders');
    if (orders) {
      try {
        const ordersData = JSON.parse(orders);
        let hasChanges = false;

        const cleanOrders = ordersData.map((order: any) => {
          const cleanOrder = { ...order };
          
          if (order.cart && Array.isArray(order.cart)) {
            cleanOrder.cart = order.cart.map((item: any) => {
              const cleanItem = { ...item };
              
              if (typeof item.name === 'object') {
                cleanItem.name = convertToString(item.name);
                hasChanges = true;
              }
              
              if (item.ingredients && !Array.isArray(item.ingredients)) {
                cleanItem.ingredients = convertIngredients(item.ingredients);
                hasChanges = true;
              }
              
              return cleanItem;
            });
          }
          
          return cleanOrder;
        });

        if (hasChanges) {
          localStorage.setItem('orders', JSON.stringify(cleanOrders));
        }
      } catch (e) {
        console.error('Error cleaning orders:', e);
      }
    }
  } catch (error) {
    console.error('Error durante la limpieza de datos multiidioma:', error);
  }
};

export const menuData = {
  hamburguesas: [
    {
      id: 1,
      name: 'JOS Clásica',
      price: 25,
      image: 'https://readdy.ai/api/search-image?query=Classic%20beef%20hamburger%20with%20lettuce%2C%20tomato%2C%20cheese%2C%20pickle%20on%20sesame%20bun%2C%20clean%20white%20background%2C%20professional%20food%20photography%2C%20appetizing%20presentation&width=400&height=300&seq=burger1&orientation=landscape',
      ingredients: ['Carne de res', 'Lechuga', 'Tomate', 'Queso', 'Pepinillo', 'Pan de sésamo'],
      customizable: true,
      available: true,
      category: 'hamburguesas'
    },
    {
      id: 2,
      name: 'Doble Queso',
      price: 32,
      image: 'https://readdy.ai/api/search-image?query=Double%20cheeseburger%20with%20two%20beef%20patties%2C%20melted%20cheese%2C%20lettuce%2C%20onion%20on%20toasted%20bun%2C%20clean%20white%20background%2C%20professional%20food%20photography%20style&width=400&height=300&seq=burger2&orientation=landscape',
      ingredients: ['Doble carne', 'Doble queso', 'Lechuga', 'Cebolla', 'Salsa especial'],
      customizable: true,
      available: true,
      category: 'hamburguesas'
    },
    {
      id: 3,
      name: 'BBQ Bacon',
      price: 35,
      image: 'https://readdy.ai/api/search-image?query=BBQ%20bacon%20burger%20with%20crispy%20bacon%2C%20beef%20patty%2C%20BBQ%20sauce%2C%20onion%20rings%2C%20cheese%20on%20brioche%20bun%2C%20clean%20white%20background%2C%20professional%20food%20photography&width=400&height=300&seq=burger3&orientation=landscape',
      ingredients: ['Carne de res', 'Bacon crujiente', 'Salsa BBQ', 'Aros de cebolla', 'Queso'],
      customizable: true,
      available: true,
      category: 'hamburguesas'
    }
  ],
  hotdogs: [
    {
      id: 11,
      name: 'Hot Dog Clásico',
      price: 18,
      image: 'https://readdy.ai/api/search-image?query=Classic%20hot%20dog%20with%20grilled%20sausage%2C%20mustard%2C%20ketchup%2C%20onions%20in%20soft%20bun%2C%20clean%20white%20background%2C%20professional%20food%20photography%20style&width=400&height=300&seq=hotdog1&orientation=landscape',
      ingredients: ['Salchicha a la parrilla', 'Mostaza', 'Kétchup', 'Cebolla'],
      customizable: true,
      available: true,
      category: 'hotdogs'
    },
    {
      id: 12,
      name: 'Hot Dog Chicago',
      price: 22,
      image: 'https://readdy.ai/api/search-image?query=Chicago%20style%20hot%20dog%20with%20all%20beef%20sausage%2C%20yellow%20mustard%2C%20chopped%20onions%2C%20bright%20green%20relish%2C%20tomato%20wedges%2C%20pickle%20spear%2C%20sport%20peppers%2C%20celery%20salt%2C%20clean%20white%20background&width=400&height=300&seq=hotdog2&orientation=landscape',
      ingredients: ['Salchicha de res', 'Mostaza', 'Cebolla', 'Pepinillos', 'Tomate', 'Pimientos'],
      customizable: true,
      available: true,
      category: 'hotdogs'
    }
  ],
  burritos: [
    {
      id: 21,
      name: 'Burrito de Pollo',
      price: 28,
      image: 'https://readdy.ai/api/search-image?query=Chicken%20burrito%20wrap%20filled%20with%20grilled%20chicken%2C%20rice%2C%20beans%2C%20cheese%2C%20lettuce%2C%20salsa%2C%20wrapped%20in%20flour%20tortilla%2C%20clean%20white%20background%2C%20professional%20food%20photography&width=400&height=300&seq=burrito1&orientation=landscape',
      ingredients: ['Pollo a la parrilla', 'Arroz', 'Frijoles', 'Queso', 'Lechuga', 'Salsa'],
      customizable: true,
      available: true,
      category: 'burritos'
    },
    {
      id: 22,
      name: 'Burrito de Carne',
      price: 30,
      image: 'https://readdy.ai/api/search-image?query=Beef%20burrito%20with%20seasoned%20ground%20beef%2C%20mexican%20rice%2C%20black%20beans%2C%20cheese%2C%20sour%20cream%2C%20guacamole%2C%20wrapped%20in%20large%20flour%20tortilla%2C%20clean%20white%20background&width=400&height=300&seq=burrito2&orientation=landscape',
      ingredients: ['Carne molida sazonada', 'Arroz mexicano', 'Frijoles negros', 'Queso', 'Crema agria'],
      customizable: true,
      available: true,
      category: 'burritos'
    }
  ],
  bebidas: [
    {
      id: 31,
      name: 'Agua 300ml',
      price: 5,
      image: 'https://readdy.ai/api/search-image?query=Clear%20plastic%20water%20bottle%20300ml%20with%20blue%20cap%20and%20label%2C%20clean%20white%20background%2C%20professional%20product%20photography%20style&width=400&height=300&seq=water&orientation=landscape',
      ingredients: ['Agua purificada'],
      customizable: false,
      available: true,
      category: 'bebidas'
    },
    {
      id: 32,
      name: 'Coca Cola 330ml',
      price: 8,
      image: 'https://readdy.ai/api/search-image?query=Coca%20Cola%20aluminum%20can%20330ml%20with%20classic%20red%20label%20and%20branding%2C%20clean%20white%20background%2C%20professional%20product%20photography&width=400&height=300&seq=cocacola&orientation=landscape',
      ingredients: ['Bebida carbonatada'],
      customizable: false,
      available: true,
      category: 'bebidas'
    },
    {
      id: 33,
      name: 'Pepsi 330ml',
      price: 8,
      image: 'https://readdy.ai/api/search-image?query=Pepsi%20aluminum%20can%20330ml%20with%20blue%20label%20and%20logo%20design%2C%20clean%20white%20background%2C%20professional%20product%20photography%20style&width=400&height=300&seq=pepsi&orientation=landscape',
      ingredients: ['Bebida carbonatada'],
      customizable: false,
      available: true,
      category: 'bebidas'
    }
  ]
};
