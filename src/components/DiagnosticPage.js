import React, { useState, useEffect } from 'react';

const DiagnosticPage = () => {
  const [diagnostics, setDiagnostics] = useState({
    loading: true,
    environment: '',
    firebaseConfig: null,
    errors: []
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = {
        loading: false,
        environment: process.env.NODE_ENV || 'unknown',
        firebaseConfig: {
          hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
          hasAuthDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
          hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
          apiKeyPreview: process.env.REACT_APP_FIREBASE_API_KEY ? 
            process.env.REACT_APP_FIREBASE_API_KEY.substring(0, 20) + '...' : 'No disponible'
        },
        errors: []
      };

      // Test Firebase import
      try {
        const { auth } = await import('../firebase/config');
        results.firebaseImport = '✅ Firebase importado correctamente';
      } catch (error) {
        results.errors.push(`❌ Error importando Firebase: ${error.message}`);
      }

      setDiagnostics(results);
    };

    runDiagnostics();
  }, []);

  if (diagnostics.loading) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh'
      }}>
        <h1>🔍 Ejecutando Diagnósticos...</h1>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>🔍 Diagnóstico del Sistema</h1>
      
      <div style={{ backgroundColor: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>🌍 Entorno</h2>
        <p><strong>NODE_ENV:</strong> {diagnostics.environment}</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>🔥 Firebase Configuration</h2>
        <p><strong>API Key:</strong> {diagnostics.firebaseConfig?.hasApiKey ? '✅ Disponible' : '❌ Falta'}</p>
        <p><strong>Auth Domain:</strong> {diagnostics.firebaseConfig?.hasAuthDomain ? '✅ Disponible' : '❌ Falta'}</p>
        <p><strong>Project ID:</strong> {diagnostics.firebaseConfig?.hasProjectId ? '✅ Disponible' : '❌ Falta'}</p>
        <p><strong>API Key Preview:</strong> {diagnostics.firebaseConfig?.apiKeyPreview}</p>
        {diagnostics.firebaseImport && <p>{diagnostics.firebaseImport}</p>}
      </div>

      {diagnostics.errors.length > 0 && (
        <div style={{ backgroundColor: '#ffebee', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
          <h2>❌ Errores Detectados</h2>
          {diagnostics.errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px' }}>
        <h2>📋 Variables de Entorno</h2>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify({
            NODE_ENV: process.env.NODE_ENV,
            REACT_APP_ENV: process.env.REACT_APP_ENV,
            hasFirebaseVars: {
              apiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
              authDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
              projectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
            }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DiagnosticPage;
