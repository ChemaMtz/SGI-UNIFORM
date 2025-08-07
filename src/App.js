// Importaciones de React y hooks
import React, { useState, useEffect } from 'react';

// Importación de componentes de la aplicación
import Login from './components/Login';              // Página de inicio de sesión
import Sidebar from './components/Sidebar';         // Barra lateral de navegación
import Dashboard from './components/Dashboard';     // Panel principal con estadísticas
import Uniformes from './components/Uniformes';     // Gestión de uniformes
import BotasDialectricas from './components/BotasDialectricas'; // Gestión de botas dieléctricas
import Cascos from './components/Cascos';           // Gestión de cascos
import Googles from './components/Googles';         // Gestión de lentes de seguridad

// Firebase
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Estilos globales de la aplicación
import './App.css';

/**
 * Componente principal de la aplicación
 * 
 * Maneja la autenticación y navegación entre diferentes secciones del sistema 
 * de inventario y renderiza el contenido correspondiente según la sección activa.
 * 
 * Características principales:
 * - Sistema de autenticación simple
 * - Sistema de navegación por pestañas
 * - Gestión de usuario
 * - Estructura modular para diferentes tipos de inventario
 */
function App() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Estado para controlar qué sección está activa
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Usuario - ahora se obtiene de Firebase
  const [user, setUser] = useState({
    name: 'Usuario',
    role: 'Usuario del Sistema'
  });

  // Verificar autenticación con Firebase al cargar la aplicación
  useEffect(() => {
    console.log('🔥 Iniciando Firebase Auth...');
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('🔐 Estado de autenticación:', firebaseUser ? 'Autenticado' : 'No autenticado');
      
      if (firebaseUser) {
        // Usuario autenticado
        setCurrentUser(firebaseUser);
        setIsAuthenticated(true);
        setUser({
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
          role: 'Usuario del Sistema',
          email: firebaseUser.email
        });
        localStorage.setItem('inventario_logged_in', 'true');
      } else {
        // Usuario no autenticado
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUser({ name: 'Usuario', role: 'Usuario del Sistema' });
        localStorage.removeItem('inventario_logged_in');
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Manejar login exitoso
  const handleLogin = (success) => {
    // Firebase ya maneja el estado a través del listener
    // Este método se mantiene para compatibilidad
    if (success) {
      setIsAuthenticated(true);
    }
  };

  // Manejar logout con Firebase
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveSection('dashboard'); // Resetear a dashboard
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Cargando sistema...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar página de login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  /**
   * Renderiza el contenido principal según la sección activa
   * @returns {JSX.Element} Componente correspondiente a la sección seleccionada
   */
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard setActiveSection={setActiveSection} />;
      case 'uniformes':
        return <Uniformes />;
      case 'botas_dialectricas':
        return <BotasDialectricas />;
      case 'cascos':
        return <Cascos />;
      case 'googles':
        return <Googles />;
      default:
        return <Dashboard setActiveSection={setActiveSection} />; // Fallback al dashboard
    }
  };

  // Renderizado principal con sidebar y contenido dinámico
  return (
    <div className="app">
      {/* Barra lateral con navegación */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Área de contenido principal */}
      <div className="app-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
