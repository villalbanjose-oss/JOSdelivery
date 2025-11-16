
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple - en producción usar autenticación real
    const savedUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const defaultUser = { username: 'admin', password: 'admin123' };
    const allUsers = savedUsers.length > 0 ? savedUsers : [defaultUser];
    
    const validUser = allUsers.find((user: any) => 
      user.username === credentials.username && user.password === credentials.password
    );
    
    if (validUser) {
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('currentAdminUser', JSON.stringify(validUser));
      router.push('/admin');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de recuperación de contraseña
    setResetMessage('Se ha enviado un enlace de recuperación a tu correo electrónico');
    setShowForgotPassword(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <div className="w-full h-full rounded-full border-4 border-gray-800 flex items-center justify-center" 
                 style={{ background: 'linear-gradient(135deg, #E2B714 0%, #F4D03F 50%, #E2B714 100%)' }}>
              <i className="ri-fire-line text-2xl text-gray-800"></i>
            </div>
          </div>
          <h1 className="font-['Pacifico'] text-3xl text-orange-600">JOS</h1>
          <p className="text-gray-600 mt-2">Panel de Administración</p>
        </div>

        {!showForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {resetMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {resetMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-login-box-line mr-2"></i>
              Iniciar Sesión
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-orange-600 hover:text-orange-800 text-sm cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Recuperar Contraseña
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Enviar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Acceso solo para administradores autorizados</p>
        </div>
      </div>
    </div>
  );
}
