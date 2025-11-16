
'use client';
import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    text: '',
    rating: 5
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = () => {
    const savedTestimonials = localStorage.getItem('testimonials');
    if (savedTestimonials) {
      try {
        setTestimonials(JSON.parse(savedTestimonials));
      } catch (e) {
        console.error('Error parsing testimonials:', e);
        setTestimonials([]);
      }
    }
  };

  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    localStorage.setItem('testimonials', JSON.stringify(newTestimonials));
    setTestimonials(newTestimonials);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.text.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    const testimonialData = {
      id: editingTestimonial ? editingTestimonial.id : Date.now().toString(),
      name: formData.name.trim(),
      text: formData.text.trim(),
      rating: formData.rating,
      date: editingTestimonial ? editingTestimonial.date : new Date().toISOString().split('T')[0]
    };

    let newTestimonials;
    if (editingTestimonial) {
      newTestimonials = testimonials.map(t => 
        t.id === editingTestimonial.id ? testimonialData : t
      );
    } else {
      newTestimonials = [testimonialData, ...testimonials];
    }

    saveTestimonials(newTestimonials);
    resetForm();
    alert('Testimonio guardado exitosamente');
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      text: testimonial.text,
      rating: testimonial.rating
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este testimonio?')) {
      const newTestimonials = testimonials.filter(t => t.id !== id);
      saveTestimonials(newTestimonials);
      alert('Testimonio eliminado exitosamente');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', text: '', rating: 5 });
    setEditingTestimonial(null);
    setShowAddModal(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`ri-star-${index < rating ? 'fill' : 'line'} text-yellow-400 text-sm`}
      ></i>
    ));
  };

  const renderRatingSelector = () => {
    return (
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className={`text-2xl cursor-pointer transition-colors ${
              star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <i className={`ri-star-${star <= formData.rating ? 'fill' : 'line'}`}></i>
          </button>
        ))}
        <span className="text-sm text-gray-600 ml-2">
          {formData.rating} estrellas
        </span>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Testimonios</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Agregar Testimonio
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-chat-quote-line text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">No hay testimonios disponibles</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-400"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                      <i className="ri-user-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{testimonial.name}</h4>
                      <div className="flex items-center mt-1">
                        {renderStars(testimonial.rating)}
                        <span className="text-sm text-gray-500 ml-2">
                          ({testimonial.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative mb-4">
                    <i className="ri-double-quotes-l text-yellow-400 text-2xl absolute -top-2 -left-1"></i>
                    <p className="text-gray-600 leading-relaxed pl-6 pr-2">
                      {testimonial.text}
                    </p>
                    <i className="ri-double-quotes-r text-yellow-400 text-2xl absolute -bottom-2 -right-1"></i>
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    Fecha: {new Date(testimonial.date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-edit-line mr-1"></i>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar testimonio */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {editingTestimonial ? 'Editar Testimonio' : 'Agregar Testimonio'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nombre completo del cliente"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Testimonio
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Escribe aquí el testimonio del cliente..."
                  maxLength={500}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.text.length}/500 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                {renderRatingSelector()}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-save-line mr-2"></i>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}