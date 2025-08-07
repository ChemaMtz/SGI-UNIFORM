/**
 * Configuración de Firebase para el Sistema de Inventario Universitario
 */

// Importación de funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración segura usando variables de entorno con fallbacks
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ,
  appId: process.env.REACT_APP_FIREBASE_APP_ID ,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID 
};

// Inicialización de la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Exportación de servicios configurados
export const db = getFirestore(app);
export const auth = getAuth(app);

// Exportación por defecto de la aplicación
export default app;
