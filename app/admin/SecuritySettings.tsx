
'use client';
import { useState, useEffect } from 'react';

export default function SecuritySettings() {
  const [users, setUsers] = useState<any[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    permissions: {
      products: true,
      orders: true,
      sales: true,
      settings: true,
      security: false,
      cashRegister: false
    }
  });
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const savedUsers = localStorage.getItem('adminUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Usuario por defecto
      const defaultUsers = [{
        id: 1,
        username: 'admin',
        password: 'admin123',
        permissions: {
          products: true,
          orders: true,
          sales: true,
          settings: true,
          security: true,
          cashRegister: true
        }
      }];
      setUsers(defaultUsers);
      localStorage.setItem('adminUsers', JSON.stringify(defaultUsers));
    }
  }, []);

  // Traducciones fijas en español
  const securitySettings = 'Configuración de Seguridad';
  const changePassword = 'Cambiar Contraseña';
  const userManagement = 'Gestión de Usuarios';
  const addUser = 'Agregar Usuario';
  const currentPassword = 'Contraseña Actual';
  const newPassword = 'Nueva Contraseña';
  const confirmPassword = 'Confirmar Contraseña';
  const username = 'Usuario';
  const permissions = 'Permisos';
  const products = 'Productos';
  const orders = 'Pedidos';
  const sales = 'Ventas';
  const settings = 'Configuración';
  const security = 'Seguridad';
  const cashRegister = 'Cierre de Caja';
  const save = 'Guardar';
  const cancel = 'Cancelar';
  const deleteText = 'Eliminar';
  const edit = 'Editar';
  const passwordsNotMatch = 'Las contraseñas no coinciden';
  const userExists = 'El usuario ya existe';
  const passwordChanged = 'Contraseña cambiada exitosamente';
  const userAdded = 'Usuario agregado exitosamente';
  const userDeleted = 'Usuario eliminado';
  const currentPasswordIncorrect = 'Contraseña actual incorrecta';
  const fillAllFields = 'Complete todos los campos';

  const handleChangePassword = () => {
    setError('');
    setSuccess('');

    if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {
      setError(fillAllFields);
      return;
    }

    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setError(passwordsNotMatch);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentAdminUser') || '{}');
    if (currentUser.password !== passwordChange.currentPassword) {
      setError(currentPasswordIncorrect);
      return;
    }

    // Actualizar contraseña
    const updatedUsers = users.map(user => 
      user.username === currentUser.username 
        ? { ...user, password: passwordChange.newPassword }
        : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('currentAdminUser', JSON.stringify({ ...currentUser, password: passwordChange.newPassword }));
    
    setSuccess(passwordChanged);
    setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
  };

  const handleAddUser = () => {
    setError('');
    setSuccess('');

    if (!newUser.username || !newUser.password || !newUser.confirmPassword) {
      setError(fillAllFields);
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setError(passwordsNotMatch);
      return;
    }

    if (users.some(user => user.username === newUser.username)) {
      setError(userExists);
      return;
    }

    const userToAdd = {
      id: Date.now(),
      username: newUser.username,
      password: newUser.password,
      permissions: newUser.permissions
    };

    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    
    setSuccess(userAdded);
    setNewUser({
      username: '',
      password: '',
      confirmPassword: '',
      permissions: {
        products: true,
        orders: true,
        sales: true,
        settings: true,
        security: false,
        cashRegister: false
      }
    });
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId: number) => {
    if (users.length <= 1) return;
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
    setSuccess(userDeleted);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{securitySettings}</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="space-y-8">
        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{changePassword}</h3>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-key-line mr-2"></i>
              {changePassword}
            </button>
          </div>

          {showChangePassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentPassword}
                </label>
                <input
                  type="password"
                  value={passwordChange.currentPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {newPassword}
                </label>
                <input
                  type="password"
                  value={passwordChange.newPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {confirmPassword}
                </label>
                <input
                  type="password"
                  value={passwordChange.confirmPassword}
                  onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleChangePassword}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {save}
                </button>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError('');
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {cancel}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gestión de Usuarios */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{userManagement}</h3>
            <button
              onClick={() => setShowAddUser(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-user-add-line mr-2"></i>
              {addUser}
            </button>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-800">
                    Usuario: <span className="font-normal">{user.username}</span>
                  </h4>
                  {users.length > 1 && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
                  <div className={`px-2 py-1 rounded ${user.permissions.products ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {products}
                  </div>
                  <div className={`px-2 py-1 rounded ${user.permissions.orders ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {orders}
                  </div>
                  <div className={`px-2 py-1 rounded ${user.permissions.sales ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {sales}
                  </div>
                  <div className={`px-2 py-1 rounded ${user.permissions.settings ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {settings}
                  </div>
                  <div className={`px-2 py-1 rounded ${user.permissions.security ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {security}
                  </div>
                  <div className={`px-2 py-1 rounded ${user.permissions.cashRegister ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {cashRegister}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Agregar Usuario */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{addUser}</h3>
              <button 
                onClick={() => setShowAddUser(false)}
                className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {username}
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {newPassword}
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {confirmPassword}
                </label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  {permissions}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.products}
                      onChange={(e) => setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, products: e.target.checked }
                      })}
                      className="mr-3"
                    />
                    {products}
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.orders}
                      onChange={(e) => setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, orders: e.target.checked }
                      })}
                      className="mr-3"
                    />
                    {orders}
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.sales}
                      onChange={(e) => setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, sales: e.target.checked }
                      })}
                      className="mr-3"
                    />
                    {sales}
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.settings}
                      onChange={(e) => setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, settings: e.target.checked }
                      })}
                      className="mr-3"
                    />
                    {settings}
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.security}
                      onChange={(e) => setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, security: e.target.checked }
                      })}
                      className="mr-3"
                    />
                    {security}
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newUser.permissions.cashRegister}
                      onChange={(e) => setNewUser({
                        ...newUser,
                        permissions: { ...newUser.permissions, cashRegister: e.target.checked }
                      })}
                      className="mr-3"
                    />
                    {cashRegister}
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {addUser}
                </button>
                <button
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
