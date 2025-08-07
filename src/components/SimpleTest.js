import React from 'react';
import VercelDiagnostic from './VercelDiagnostic';

const SimpleTest = () => {
  const [showDiagnostic, setShowDiagnostic] = React.useState(false);
  
  if (showDiagnostic) {
    return <VercelDiagnostic />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          ✅ React Funcionando!
        </h1>
        
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          Esta es una página de prueba para verificar que React está funcionando en Vercel.
        </p>
        
        <div style={{
          backgroundColor: '#f0f8ff',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Información del Entorno:</h3>
          <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'undefined'}</p>
          <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
          <p><strong>URL actual:</strong> {window.location.href}</p>
          <p><strong>Variables REACT_APP_*:</strong> {
            Object.keys(process.env)
              .filter(key => key.startsWith('REACT_APP'))
              .length
          } encontradas</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔄 Recargar
          </button>
          
          <button
            onClick={() => setShowDiagnostic(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔍 Diagnóstico
          </button>
          
          <button
            onClick={() => {
              console.log('� Información de debug:', {
                env: process.env,
                location: window.location,
                timestamp: new Date().toISOString()
              });
              alert('Información enviada a la consola');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            � Console Log
          </button>
        </div>
        
        <p style={{ 
          fontSize: '14px', 
          color: '#999', 
          marginTop: '20px' 
        }}>
          Si ves esta página, React está funcionando correctamente en Vercel.
          <br />
          El problema puede estar en las variables de entorno de Firebase.
        </p>
      </div>
    </div>
  );
};

export default SimpleTest;
