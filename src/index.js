import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SimpleTest from './components/SimpleTest';
import ErrorBoundary from './components/ErrorBoundary';

// Detectar si estamos en producción y hay problemas
const isProduction = process.env.NODE_ENV === 'production';
const showSimpleTest = isProduction && !process.env.REACT_APP_FIREBASE_API_KEY;

console.log('🔍 Estado actual:', {
  isProduction,
  showSimpleTest,
  hasFirebaseKey: !!process.env.REACT_APP_FIREBASE_API_KEY
});

const root = ReactDOM.createRoot(document.getElementById('root'));

if (showSimpleTest) {
  // En producción sin variables de Firebase, mostrar página de prueba
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <SimpleTest />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  // Funcionamiento normal
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
