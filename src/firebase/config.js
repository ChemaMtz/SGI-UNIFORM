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

// 🔒 Configuración segura usando variables de entorno
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validación de configuración (opcional pero recomendado)
const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingConfig = requiredConfig.filter(key => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  console.error('⚠️ Faltan variables de entorno de Firebase:', missingConfig);
  console.error('🔧 Asegúrate de tener un archivo .env con las configuraciones necesarias');
}

// Inicialización de la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Exportación de servicios configurados
export const db = getFirestore(app);     // Instancia de Firestore para operaciones de base de datos
export const auth = getAuth(app);        // Instancia de Auth para autenticación de usuarios

// Exportación por defecto de la aplicación
export default app;
