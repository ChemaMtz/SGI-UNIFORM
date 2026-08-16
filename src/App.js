// Importaciones de React y hooks
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

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
 * de inventario usando React Router con HashRouter.
 * 
 * Características principales:
 * - Sistema de autenticación simple
 * - Sistema de navegación por rutas (HashRouter)
 * - Gestión de usuario
 * - Estructura modular para diferentes tipos de inventario
 */
function App() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Hooks de React Router
  const navigate = useNavigate();
  const location = useLocation();
  
  // Usuario - ahora se obtiene de Firebase
  const [user, setUser] = useState({
    name: 'Usuario',
    role: 'Usuario del Sistema'
  });

  // Verificar autenticación con Firebase al cargar la aplicación
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Usuario autenticado
          setIsAuthenticated(true);
          setUser({
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
            role: 'Usuario del Sistema',
            email: firebaseUser.email
          });
          localStorage.setItem('inventario_logged_in', 'true');
        } else {
          // Usuario no autenticado
          setIsAuthenticated(false);
          setUser({ name: 'Usuario', role: 'Usuario del Sistema' });
          localStorage.removeItem('inventario_logged_in');
        }
        setLoading(false);
      });

      // Cleanup subscription
      return () => unsubscribe();
    } catch (error) {
      console.error('Error inicializando Firebase:', error);
      setLoading(false);
    }
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
      navigate('/'); // Navegar al dashboard después del logout
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

  // Obtener la sección activa basada en la ruta actual
  const getActiveSection = () => {
    const pathname = location.pathname;
    if (pathname === '/uniformes') return 'uniformes';
    if (pathname === '/botas-dialectricas') return 'botas_dialectricas';
    if (pathname === '/cascos') return 'cascos';
    if (pathname === '/googles') return 'googles';
    return 'dashboard';
  };

  // Función para navegar entre secciones
  const navigateToSection = (section) => {
    switch (section) {
      case 'uniformes':
        navigate('/uniformes');
        break;
      case 'botas_dialectricas':
        navigate('/botas-dialectricas');
        break;
      case 'cascos':
        navigate('/cascos');
        break;
      case 'googles':
        navigate('/googles');
        break;
      default:
        navigate('/');
        break;
    }
  };

  // Renderizado principal con sidebar y rutas
  return (
    <div className="app">
      {/* Barra lateral con navegación */}
      <Sidebar 
        activeSection={getActiveSection()} 
        setActiveSection={navigateToSection} 
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Área de contenido principal con rutas */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard setActiveSection={navigateToSection} />} />
          <Route path="/uniformes" element={<Uniformes />} />
          <Route path="/botas-dialectricas" element={<BotasDialectricas />} />
          <Route path="/cascos" element={<Cascos />} />
          <Route path="/googles" element={<Googles />} />
          {/* Redireccionar rutas no encontradas al dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
