// Importaciones de Firestore para operaciones CRUD
import { 
  collection,    // Para referenciar colecciones
  addDoc,        // Para agregar documentos
  getDocs,       // Para obtener documentos
  doc,           // Para referenciar documentos específicos
  updateDoc,     // Para actualizar documentos
  deleteDoc,     // Para eliminar documentos
  query,         // Para crear consultas
  where          // Para filtros en consultas
} from 'firebase/firestore';

// Configuración de la base de datos
import { db } from './config';

// ============= SERVICIOS PARA UNIFORMES =============

/**
 * Servicio para gestionar el inventario de uniformes
 * Proporciona operaciones CRUD completas y métrica de inventario
 */
export const uniformesService = {
  
  /**
   * Obtiene todos los uniformes de la base de datos
   * @returns {Promise<Array>} Lista de uniformes con sus IDs
   */
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'uniformes'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener uniformes:', error);
      throw error;
    }
  },

  /**
   * Agrega un nuevo uniforme al inventario
   * @param {Object} uniforme - Datos del uniforme a agregar
   * @returns {Promise<string>} ID del documento creado
   */
  add: async (uniforme) => {
    try {
      const docRef = await addDoc(collection(db, 'uniformes'), {
        ...uniforme,
        fechaCreacion: new Date(),
        stockTotal: uniforme.entrada || 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar uniforme:', error);
      throw error;
    }
  },

  /**
   * Actualiza un uniforme existente
   * @param {string} id - ID del uniforme a actualizar
   * @param {Object} uniforme - Nuevos datos del uniforme
   */
  update: async (id, uniforme) => {
    try {
      const docRef = doc(db, 'uniformes', id);
      await updateDoc(docRef, {
        ...uniforme,
        fechaModificacion: new Date()
      });
    } catch (error) {
      console.error('Error al actualizar uniforme:', error);
      throw error;
    }
  },

  // Eliminar uniforme
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'uniformes', id));
    } catch (error) {
      console.error('Error al eliminar uniforme:', error);
      throw error;
    }
  },

  // Filtrar por criterios
  filter: async (filters) => {
    try {
      let q = collection(db, 'uniformes');
      
      if (filters.color) {
        q = query(q, where('color', '==', filters.color));
      }
      if (filters.talla) {
        q = query(q, where('talla', '==', filters.talla));
      }
      if (filters.sexo) {
        q = query(q, where('sexo', '==', filters.sexo));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al filtrar uniformes:', error);
      throw error;
    }
  }
};

// Servicios para Botas Dieléctricas
export const botasService = {
  // Obtener todas las botas
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'botas_dialectricas'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener botas:', error);
      throw error;
    }
  },

  // Agregar nueva bota
  add: async (bota) => {
    try {
      const docRef = await addDoc(collection(db, 'botas_dialectricas'), {
        ...bota,
        fechaCreacion: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar bota:', error);
      throw error;
    }
  },

  // Actualizar bota
  update: async (id, bota) => {
    try {
      const docRef = doc(db, 'botas_dialectricas', id);
      await updateDoc(docRef, {
        ...bota,
        fechaModificacion: new Date()
      });
    } catch (error) {
      console.error('Error al actualizar bota:', error);
      throw error;
    }
  },

  // Eliminar bota
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'botas_dialectricas', id));
    } catch (error) {
      console.error('Error al eliminar bota:', error);
      throw error;
    }
  }
};

// Servicios para Cascos
export const cascosService = {
  // Obtener todos los cascos
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cascos'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener cascos:', error);
      throw error;
    }
  },

  // Agregar nuevo casco
  add: async (casco) => {
    try {
      const docRef = await addDoc(collection(db, 'cascos'), {
        ...casco,
        fechaCreacion: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar casco:', error);
      throw error;
    }
  },

  // Actualizar casco
  update: async (id, casco) => {
    try {
      const docRef = doc(db, 'cascos', id);
      await updateDoc(docRef, {
        ...casco,
        fechaModificacion: new Date()
      });
    } catch (error) {
      console.error('Error al actualizar casco:', error);
      throw error;
    }
  },

  // Eliminar casco
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'cascos', id));
    } catch (error) {
      console.error('Error al eliminar casco:', error);
      throw error;
    }
  }
};

// Servicios para Googles
export const googlesService = {
  // Obtener todos los googles
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'googles'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener googles:', error);
      throw error;
    }
  },

  // Agregar nuevo google
  add: async (google) => {
    try {
      const docRef = await addDoc(collection(db, 'googles'), {
        ...google,
        fechaCreacion: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar google:', error);
      throw error;
    }
  },

  // Actualizar google
  update: async (id, google) => {
    try {
      const docRef = doc(db, 'googles', id);
      await updateDoc(docRef, {
        ...google,
        fechaModificacion: new Date()
      });
    } catch (error) {
      console.error('Error al actualizar google:', error);
      throw error;
    }
  },

  // Eliminar google
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'googles', id));
    } catch (error) {
      console.error('Error al eliminar google:', error);
      throw error;
    }
  }
};

// Servicios para Dashboard y estadísticas
export const dashboardService = {
  // Obtener estadísticas generales
  getStats: async () => {
    try {
      const [uniformes, botas, cascos, googles] = await Promise.all([
        uniformesService.getAll(),
        botasService.getAll(),
        cascosService.getAll(),
        googlesService.getAll()
      ]);

      // Calcular stock total para cada categoría
      const uniformesConStock = uniformes.map(item => ({
        ...item,
        stockCalculado: (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0)
      }));
      
      const botasConStock = botas.map(item => ({
        ...item,
        stockCalculado: (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0)
      }));
      
      const cascosConStock = cascos.map(item => ({
        ...item,
        stockCalculado: (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0)
      }));
      
      const googlesConStock = googles.map(item => ({
        ...item,
        stockCalculado: (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0)
      }));

      // Contar artículos
      const totalArticulos = uniformes.length + botas.length + cascos.length + googles.length;
      
      // Contar artículos críticos (stock <= 10)
      const articulosCriticos = [
        ...uniformesConStock.filter(item => item.stockCalculado <= 10),
        ...botasConStock.filter(item => item.stockCalculado <= 10),
        ...cascosConStock.filter(item => item.stockCalculado <= 10),
        ...googlesConStock.filter(item => item.stockCalculado <= 10)
      ].length;

      // Contar artículos agotados
      const articulosAgotados = [
        ...uniformesConStock.filter(item => item.stockCalculado <= 0),
        ...botasConStock.filter(item => item.stockCalculado <= 0),
        ...cascosConStock.filter(item => item.stockCalculado <= 0),
        ...googlesConStock.filter(item => item.stockCalculado <= 0)
      ].length;

      // Calcular stock total del almacén
      const stockTotal = [
        ...uniformesConStock,
        ...botasConStock,
        ...cascosConStock,
        ...googlesConStock
      ].reduce((sum, item) => sum + item.stockCalculado, 0);

      // Calcular exactitud del inventario (artículos con stock > 0)
      const articulosDisponibles = totalArticulos - articulosAgotados;
      const exactitudInventario = totalArticulos > 0 
        ? Math.round((articulosDisponibles / totalArticulos) * 100)
        : 100;

      return {
        totalArticulos,
        articulosCriticos,
        articulosAgotados,
        stockTotal,
        exactitudInventario,
        tiempoRespuesta: 1.8, // Simulado
        ordenesPendientes: articulosCriticos, // Usar críticos como pendientes
        ordenesCompletadas: articulosDisponibles // Usar disponibles como completadas
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Obtener actividad reciente basada en datos reales
  getRecentActivity: async () => {
    try {
      const [uniformes, botas, cascos, googles] = await Promise.all([
        uniformesService.getAll(),
        botasService.getAll(),
        cascosService.getAll(),
        googlesService.getAll()
      ]);

      const activities = [];
      
      // Verificar stock bajo en cada categoría
      const uniformesBajos = uniformes.filter(item => {
        const stock = (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0);
        return stock <= 10 && stock > 0;
      });
      
      if (uniformesBajos.length > 0) {
        activities.push({
          type: 'warning',
          message: `${uniformesBajos.length} uniformes con stock bajo`,
          time: 'Detectado ahora'
        });
      }

      const botasBajas = botas.filter(item => {
        const stock = (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0);
        return stock <= 10 && stock > 0;
      });
      
      if (botasBajas.length > 0) {
        activities.push({
          type: 'warning',
          message: `${botasBajas.length} botas dieléctricas con stock bajo`,
          time: 'Detectado ahora'
        });
      }

      const cascosBajos = cascos.filter(item => {
        const stock = (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0);
        return stock <= 10 && stock > 0;
      });
      
      if (cascosBajos.length > 0) {
        activities.push({
          type: 'warning',
          message: `${cascosBajos.length} cascos con stock bajo`,
          time: 'Detectado ahora'
        });
      }

      const googlesBajos = googles.filter(item => {
        const stock = (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0);
        return stock <= 10 && stock > 0;
      });
      
      if (googlesBajos.length > 0) {
        activities.push({
          type: 'warning',
          message: `${googlesBajos.length} lentes de seguridad con stock bajo`,
          time: 'Detectado ahora'
        });
      }

      // Agregar actividad de inventario actualizado
      activities.push({
        type: 'info',
        message: `Inventario actualizado - ${uniformes.length + botas.length + cascos.length + googles.length} artículos totales`,
        time: 'Hace 1 minuto'
      });

      return activities.slice(0, 5); // Máximo 5 actividades
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      return [];
    }
  }
};
