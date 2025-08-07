/**
 * Configuración de Firebase para el Sistema de Inventario Universitario
 */

// Importación de funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración segura usando variables de entorno con fallbacks
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA5S4hHybf-5hZR9zrezT1DR6anPsIIsbw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "inventario-bf8a2.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "inventario-bf8a2",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "inventario-bf8a2.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "473600818810",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:473600818810:web:4cfe39f9643f14f9d1c5c3",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-RZVKMCMYFB"
};

// Inicialización de la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Exportación de servicios configurados
export const db = getFirestore(app);
export const auth = getAuth(app);

// Exportación por defecto de la aplicación
export default app;
