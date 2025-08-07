import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Captura los detalles del error
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('🚨 Error Boundary capturó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffebee',
          fontFamily: 'Arial, sans-serif',
          padding: '20px'
        }}>
          <h1 style={{ color: '#c62828', marginBottom: '20px' }}>
            🚨 Error en la Aplicación
          </h1>
          
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3>Error Detectado:</h3>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '14px',
              color: '#d32f2f'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
            
            <h3>Información del Error:</h3>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px',
              maxHeight: '300px'
            }}>
              {this.state.errorInfo.componentStack}
            </pre>
            
            <div style={{ marginTop: '20px' }}>
              <h3>Variables de Entorno:</h3>
              <pre style={{
                backgroundColor: '#e8f5e8',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {JSON.stringify({
                  NODE_ENV: process.env.NODE_ENV,
                  hasFirebaseKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
                  timestamp: new Date().toISOString()
                }, null, 2)}
              </pre>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔄 Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
