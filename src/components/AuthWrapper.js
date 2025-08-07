import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

/**
 * AuthWrapper Component
 * Maneja el estado de autenticación del sistema
 */
const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario ya está logueado
    const loggedIn = localStorage.getItem('inventario_logged_in') === 'true';
    setIsAuthenticated(loggedIn);
    setLoading(false);
  }, []);

  const handleLogin = (success) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('inventario_logged_in');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--color-bg)'
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default AuthWrapper;
