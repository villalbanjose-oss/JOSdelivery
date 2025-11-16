
'use client';
import { useState, useEffect } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  useEffect(() => {
    const savedFAQs = localStorage.getItem('faqs');
    if (savedFAQs) {
      try {
        const parsedFAQs = JSON.parse(savedFAQs);
        setFaqs(parsedFAQs.filter((faq: FAQ) => faq.isActive));
      } catch (e) {
        console.error('Error parsing FAQs:', e);
        setFaqs(getDefaultFAQs());
      }
    } else {
      setFaqs(getDefaultFAQs());
    }
  }, []);

  const getDefaultFAQs = (): FAQ[] => {
    return [
      {
        id: '1',
        question: '¿Cuáles son los horarios de entrega?',
        answer: 'Realizamos entregas de lunes a domingo de 11:00 AM a 11:00 PM. Los pedidos realizados después de las 10:30 PM se entregarán al día siguiente.',
        isActive: true
      },
      {
        id: '2',
        question: '¿Hacen entregas a domicilio?',
        answer: 'Sí, realizamos entregas a domicilio en toda la ciudad de Sosnowiec y alrededores. El costo de envío varía según la distancia.',
        isActive: true
      },
      {
        id: '3',
        question: '¿Puedo personalizar mi pedido?',
        answer: 'Por supuesto. Puedes agregar o quitar ingredientes de cualquier producto. También puedes dejar comentarios especiales al realizar tu pedido.',
        isActive: true
      },
      {
        id: '4',
        question: '¿Qué métodos de pago aceptan?',
        answer: 'Aceptamos efectivo, tarjetas de crédito/débito, transferencias bancarias y pagos móviles. También puedes pagar en línea al realizar tu pedido.',
        isActive: true
      },
      {
        id: '5',
        question: '¿Tienen opciones vegetarianas?',
        answer: 'Sí, tenemos varias opciones vegetarianas incluyendo hamburguesas de vegetales, ensaladas frescas y acompañamientos sin carne.',
        isActive: true
      }
    ];
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  // Manejo de navegación por teclado
  const handleKeyDown = (event: React.KeyboardEvent, faqId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFAQ(faqId);
    }
  };

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section 
      className="bg-black py-16"
      aria-labelledby="faq-title"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            id="faq-title"
            className="text-high-contrast-white font-['Pacifico'] text-4xl md:text-5xl mb-4"
          >
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4" role="region" aria-label="Lista de preguntas frecuentes">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className="accordion-accessible bg-gray-900 border-2 border-yellow-400/30 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  onKeyDown={(e) => handleKeyDown(e, faq.id)}
                  className="accordion-header w-full text-left px-6 py-5 bg-gray-900 hover:bg-gray-800 transition-all duration-300 cursor-pointer border-none"
                  aria-expanded={expandedFAQ === faq.id}
                  aria-controls={`faq-content-${faq.id}`}
                  aria-label={`${faq.question}. ${expandedFAQ === faq.id ? 'Contraer respuesta' : 'Expandir respuesta'}`}
                  tabIndex={0}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-high-contrast-white text-lg md:text-xl font-semibold pr-4 leading-relaxed">
                      {faq.question}
                    </h3>
                    <div className="icon-accessible w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <i 
                        className={`ri-${expandedFAQ === faq.id ? 'subtract' : 'add'}-line text-2xl text-yellow-400 transition-transform duration-300 ${
                          expandedFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                </button>
                
                <div
                  id={`faq-content-${faq.id}`}
                  className={`accordion-content overflow-hidden transition-all duration-300 ${
                    expandedFAQ === faq.id 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                  role="region"
                  aria-labelledby={`faq-button-${faq.id}`}
                >
                  <div className="px-6 py-5 bg-gray-800 border-t border-yellow-400/20">
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Llamada a la acción */}
          <div className="text-center mt-12 p-8 bg-gray-900 rounded-2xl border-2 border-yellow-400/30">
            <h3 className="text-high-contrast-white text-xl md:text-2xl font-semibold mb-4">
              ¿No encuentras la respuesta que buscas?
            </h3>
            <button
              className="btn-accessible bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
              aria-label="Abrir información de contacto"
              tabIndex={0}
            >
              <i className="ri-phone-line mr-3 text-xl" aria-hidden="true"></i>
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
