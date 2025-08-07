/**
 * Configuración de Firebase para el Sistema de Inventario Universitario
 * 
 * Este archivo contiene la configuración e inicialización de Firebase,
 * incluyendo Firestore (base de datos) y Authentication (autenticación).
 * 
 * 🔒 SEGURIDAD: Las credenciales están protegidas usando variables de entorno
 */

// Importación de funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";        // Inicialización de la app
import { getFirestore } from "firebase/firestore";   // Base de datos Firestore
import { getAuth } from "firebase/auth";             // Servicio de autenticación

// Debug: Mostrar variables de entorno en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('� Debug Firebase Config:', {
    hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
    hasAuthDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
    nodeEnv: process.env.NODE_ENV
  });
}

// �🔒 Configuración segura usando variables de entorno con fallbacks
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA5S4hHybf-5hZR9zrezT1DR6anPsIIsbw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "inventario-bf8a2.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "inventario-bf8a2",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "inventario-bf8a2.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "473600818810",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:473600818810:web:4cfe39f9643f14f9d1c5c3",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-RZVKMCMYFB"
};

console.log('🔥 Firebase Config Status:', {
  apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Falta',
  authDomain: firebaseConfig.authDomain ? '✅ Configurado' : '❌ Falta',
  projectId: firebaseConfig.projectId ? '✅ Configurado' : '❌ Falta'
});

// Validación de configuración (opcional pero recomendado)
const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingConfig = requiredConfig.filter(key => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  console.error('⚠️ Faltan variables de entorno de Firebase:', missingConfig);
  console.error('🔧 Asegúrate de tener las variables de entorno configuradas correctamente');
  console.error('🌍 Variables actuales:', {
    apiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: !!process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: !!process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: !!process.env.REACT_APP_FIREBASE_APP_ID
  });
}

// Inicialización de la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Exportación de servicios configurados
export const db = getFirestore(app);     // Instancia de Firestore para operaciones de base de datos
export const auth = getAuth(app);        // Instancia de Auth para autenticación de usuarios

// Exportación por defecto de la aplicación
export default app;
