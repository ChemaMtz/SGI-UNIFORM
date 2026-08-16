import React, { useState } from 'react';
import { 
  MdInventory, 
  MdLogin, 
  MdVisibility, 
  MdVisibilityOff,
  MdSecurity 
} from 'react-icons/md';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/login.css';

/**
 * Componente Login
 * Página de inicio para acceso al sistema de inventario
 * Simplificado para un solo usuario con autenticación Firebase
 */
const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      console.log('Usuario logueado:', userCredential.user);
      onLogin(true);
      localStorage.setItem('inventario_logged_in', 'true');
      localStorage.setItem('inventario_user_email', userCredential.user.email);
      
    } catch (error) {
      console.error('Error de autenticación:', error);
      
      // Manejo de errores de Firebase
      let errorMessage = '';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada.';
          break;
        default:
          errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  return (
    <div className="login-container">
      {/* Fondo con patrón geométrico */}
      <div className="login-background"></div>
      
      <div className="login-content">
        {/* Lado izquierdo - Información del sistema */}
        <div className="login-info">
          <div className="system-branding">
            <div className="brand-icon">
              <MdInventory size={60} />
            </div>
            <h1>Sistema de Inventario</h1>
            <h2>Uniformes</h2>
            <p className="brand-description">
              Gestión inteligente de equipos de protección personal con 
              tecnología moderna y diseño responsivo.
            </p>
          </div>
          
          <div className="features-list">
            <div className="feature-item">
              <MdSecurity className="feature-icon" />
              <span>Control de acceso seguro</span>
            </div>
            <div className="feature-item">
              <MdInventory className="feature-icon" />
              <span>Gestión completa de inventario</span>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario de login */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-header">
              <h3>Iniciar Sesión</h3>
              <p>Accede al sistema de inventario</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu correo"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu contraseña"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className={`login-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    <MdLogin />
                    Acceder al Sistema
                  </>
                )}
              </button>

              <div className="login-help">
                <small>
                  🔐 <strong>Acceso del Sistema:</strong> 🔐 Correo: admin@example.com, Contraseña: Admin1234!
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
