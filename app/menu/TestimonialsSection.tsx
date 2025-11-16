
'use client';
import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const savedTestimonials = localStorage.getItem('testimonials');
    if (savedTestimonials) {
      try {
        setTestimonials(JSON.parse(savedTestimonials));
      } catch (e) {
        console.error('Error parsing testimonials:', e);
        // Datos de ejemplo si no hay testimonios guardados
        setTestimonials([
          {
            id: '1',
            name: 'María González',
            text: '¡Las mejores hamburguesas de Sosnowiec! El sabor es increíble y la atención excelente.',
            rating: 5,
            date: '2024-01-15'
          },
          {
            id: '2',
            name: 'Piotr Kowalski',
            text: 'Pedí un burrito y quedé sorprendido por la calidad. Definitivamente volveré.',
            rating: 5,
            date: '2024-01-10'
          },
          {
            id: '3',
            name: 'Anna Nowak',
            text: 'Los hot dogs están deliciosos y el servicio es muy rápido. Muy recomendado.',
            rating: 4,
            date: '2024-01-08'
          }
        ]);
      }
    } else {
      // Datos de ejemplo por defecto
      const defaultTestimonials = [
        {
          id: '1',
          name: 'María González',
          text: '¡Las mejores hamburguesas de Sosnowiec! El sabor es increíble y la atención excelente.',
          rating: 5,
          date: '2024-01-15'
        },
        {
          id: '2',
          name: 'Piotr Kowalski',
          text: 'Pedí un burrito y quedé sorprendido por la calidad. Definitivamente volveré.',
          rating: 5,
          date: '2024-01-10'
        },
        {
          id: '3',
          name: 'Anna Nowak',
          text: 'Los hot dogs están deliciosos y el servicio es muy rápido. Muy recomendado.',
          rating: 4,
          date: '2024-01-08'
        }
      ];
      setTestimonials(defaultTestimonials);
      localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
    }
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`ri-star-${index < rating ? 'fill' : 'line'} text-yellow-400 text-lg`}
      ></i>
    ));
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Testimonios de Clientes</h2>
          <p className="text-gray-600 text-lg">Lo que dicen nuestros clientes sobre nosotros</p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-400 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-user-line text-white text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <div className="flex items-center mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <i className="ri-double-quotes-l text-yellow-400 text-2xl absolute -top-2 -left-1"></i>
                <p className="text-gray-600 leading-relaxed pl-6 pr-2">
                  {testimonial.text}
                </p>
                <i className="ri-double-quotes-r text-yellow-400 text-2xl absolute -bottom-2 -right-1"></i>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-400">
                  {new Date(testimonial.date).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length > 6 && (
          <div className="text-center mt-12">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold transition-colors cursor-pointer whitespace-nowrap">
              Ver Más Testimonios
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
