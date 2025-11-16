
'use client';
import { useState, useEffect } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = () => {
    const savedFAQs = localStorage.getItem('faqs');
    if (savedFAQs) {
      try {
        setFaqs(JSON.parse(savedFAQs));
      } catch (e) {
        console.error('Error parsing FAQs:', e);
        setFaqs([]);
      }
    }
  };

  const saveFAQs = (newFAQs: FAQ[]) => {
    localStorage.setItem('faqs', JSON.stringify(newFAQs));
    setFaqs(newFAQs);
  };

  // Traducciones fijas en español
  const title = 'Gestión de Preguntas Frecuentes';
  const addFAQ = 'Agregar Pregunta';
  const editFAQ = 'Editar Pregunta';
  const question = 'Pregunta';
  const answer = 'Respuesta';
  const isActive = 'Activa';
  const save = 'Guardar';
  const cancel = 'Cancelar';
  const edit = 'Editar';
  const deleteText = 'Eliminar';
  const confirmDelete = '¿Estás seguro de que quieres eliminar esta pregunta?';
  const success = 'Pregunta guardada exitosamente';
  const deleteSuccess = 'Pregunta eliminada exitosamente';
  const noFAQs = 'No hay preguntas frecuentes disponibles';
  const questionPlaceholder = 'Escribe aquí la pregunta...';
  const answerPlaceholder = 'Escribe aquí la respuesta...';
  const status = 'Estado';
  const active = 'Activa';
  const inactive = 'Inactiva';
  const toggleStatus = 'Cambiar Estado';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    const faqData = {
      id: editingFAQ ? editingFAQ.id : Date.now().toString(),
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      isActive: formData.isActive
    };

    let newFAQs;
    if (editingFAQ) {
      newFAQs = faqs.map(f => 
        f.id === editingFAQ.id ? faqData : f
      );
    } else {
      newFAQs = [faqData, ...faqs];
    }

    saveFAQs(newFAQs);
    resetForm();
    alert(success);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(confirmDelete)) {
      const newFAQs = faqs.filter(f => f.id !== id);
      saveFAQs(newFAQs);
      alert(deleteSuccess);
    }
  };

  const toggleStatusFAQ = (id: string) => {
    const newFAQs = faqs.map(f => 
      f.id === id ? { ...f, isActive: !f.isActive } : f
    );
    saveFAQs(newFAQs);
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '', isActive: true });
    setEditingFAQ(null);
    setShowAddModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          {addFAQ}
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-question-line text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">{noFAQs}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${
                faq.isActive ? 'border-yellow-400' : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      faq.isActive 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                        : 'bg-gray-400'
                    }`}>
                      <i className="ri-question-line text-white text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-lg mb-1">{faq.question}</h4>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          faq.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {faq.isActive ? active : inactive}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative mb-4">
                    <i className="ri-double-quotes-l text-yellow-400 text-2xl absolute -top-2 -left-1"></i>
                    <p className="text-gray-600 leading-relaxed pl-6 pr-2">
                      {faq.answer}
                    </p>
                    <i className="ri-double-quotes-r text-yellow-400 text-2xl absolute -bottom-2 -right-1"></i>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => toggleStatusFAQ(faq.id)}
                    className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm ${
                      faq.isActive
                        ? 'bg-gray-500 hover:bg-gray-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    <i className={`ri-${faq.isActive ? 'eye-off' : 'eye'}-line mr-1`}></i>
                    {toggleStatus}
                  </button>
                  <button
                    onClick={() => handleEdit(faq)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                  >
                    <i className="ri-edit-line mr-1"></i>
                    {edit}
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>
                    {deleteText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar/editar FAQ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {editingFAQ ? editFAQ : addFAQ}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {question}
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={questionPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {answer}
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={answerPlaceholder}
                  maxLength={1000}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.answer.length}/1000 caracteres
                </p>
              </div>

              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{isActive}</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  {cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-save-line mr-2"></i>
                  {save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
