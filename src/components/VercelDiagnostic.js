import React, { useState, useEffect } from 'react';

function VercelDiagnostic() {
  const [diagnostics, setDiagnostics] = useState({
    timestamp: new Date().toISOString(),
    platform: null,
    environment: null,
    errors: []
  });

  useEffect(() => {
    try {
      const runDiagnostics = () => {
        const results = {
          timestamp: new Date().toISOString(),
          platform: 'vercel-detected',
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            hasReactAppPrefix: Object.keys(process.env).filter(key => key.startsWith('REACT_APP')).length > 0,
            allEnvKeys: Object.keys(process.env).filter(key => key.includes('FIREBASE') || key.includes('REACT')),
            userAgent: navigator.userAgent,
            location: window.location.href,
            origin: window.location.origin
          },
          firebase: {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Existe' : '❌ Falta',
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✅ Existe' : '❌ Falta',
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ Existe' : '❌ Falta'
          },
          errors: []
        };

        // Test Firebase import
        try {
          // Intentar importar Firebase config
          import('../firebase/config').then(() => {
            console.log('✅ Firebase config se importó correctamente');
          }).catch(error => {
            results.errors.push(`Firebase import error: ${error.message}`);
          });
        } catch (error) {
          results.errors.push(`Firebase import sync error: ${error.message}`);
        }

        setDiagnostics(results);
      };

      runDiagnostics();
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        errors: [...prev.errors, `Diagnostic error: ${error.message}`]
      }));
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px'
        }}>
          🔍 Diagnóstico Vercel
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <h3>⏰ Timestamp</h3>
          <p style={{
            backgroundColor: '#f0f8ff',
            padding: '10px',
            borderRadius: '5px',
            fontFamily: 'monospace'
          }}>
            {diagnostics.timestamp}
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>🌐 Entorno</h3>
          <pre style={{
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '5px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(diagnostics.environment, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>🔥 Firebase Variables</h3>
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '15px',
            borderRadius: '5px'
          }}>
            {Object.entries(diagnostics.firebase).map(([key, value]) => (
              <p key={key} style={{ margin: '5px 0' }}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        </div>

        {diagnostics.errors.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3>🚨 Errores Detectados</h3>
            <ul style={{
              backgroundColor: '#ffe6e6',
              padding: '15px',
              borderRadius: '5px',
              color: '#cc0000'
            }}>
              {diagnostics.errors.map((error, index) => (
                <li key={index} style={{ margin: '5px 0' }}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              margin: '5px'
            }}
          >
            🔄 Recargar
          </button>
          
          <button
            onClick={() => {
              const data = JSON.stringify(diagnostics, null, 2);
              navigator.clipboard.writeText(data).then(() => {
                alert('Diagnóstico copiado al portapapeles');
              });
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              margin: '5px'
            }}
          >
            📋 Copiar Diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
}

export default VercelDiagnostic;
