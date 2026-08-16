// Importación de todos los servicios de Firebase para acceso a las colecciones
import { 
  uniformesService,   // Servicio para gestión de uniformes
  botasService,       // Servicio para gestión de botas dieléctricas
  cascosService,      // Servicio para gestión de cascos
  googlesService      // Servicio para gestión de lentes/googles
} from '../firebase/services';

/**
 * Utilidad para Detección y Eliminación de Duplicados
 * 
 * Este módulo proporciona funciones para:
 * - Detectar registros duplicados en todas las colecciones
 * - Eliminar automáticamente los duplicados encontrados
 * - Generar reportes de limpieza
 * - Mostrar estadísticas de la base de datos
 * 
 * Criterio de duplicación: Se consideran duplicados los registros
 * que tienen el mismo código (ej: UNI-001, BOT-001, etc.)
 */

/**
 * Encuentra y elimina registros duplicados en todas las colecciones
 * 
 * Algoritmo:
 * 1. Recorre cada colección (uniformes, botas, cascos, googles)
 * 2. Utiliza un Map para tracking de códigos únicos
 * 3. Elimina automáticamente duplicados posteriores
 * 4. Mantiene el primer registro encontrado como "original"
 * 
 * @returns {Promise<Object>} Objeto con resultados detallados de la limpieza
 */
export const findAndRemoveDuplicates = async () => {
  // Estructura de resultados para cada colección
  const results = {
    uniformes: { found: [], removed: 0 },    // Resultados de uniformes
    botas: { found: [], removed: 0 },        // Resultados de botas dieléctricas
    cascos: { found: [], removed: 0 },       // Resultados de cascos
    googles: { found: [], removed: 0 }       // Resultados de googles/lentes
  };

  try {
    console.log('🔍 Iniciando búsqueda de duplicados en todas las colecciones...');

    // ============= LIMPIEZA DE UNIFORMES =============
    console.log('📦 Verificando duplicados en uniformes...');
    const uniformes = await uniformesService.getAll();
    const uniformesCodigos = new Map(); // Map para tracking de códigos únicos
    
    for (const uniforme of uniformes) {
      if (uniformesCodigos.has(uniforme.codigo)) {
        // Duplicado encontrado - registrar y eliminar
        results.uniformes.found.push({
          codigo: uniforme.codigo,
          duplicateId: uniforme.id,
          originalId: uniformesCodigos.get(uniforme.codigo)
        });
        
        // Eliminación del registro duplicado
        await uniformesService.delete(uniforme.id);
        results.uniformes.removed++;
        console.log(`❌ Eliminado uniforme duplicado: ${uniforme.codigo} (ID: ${uniforme.id})`);
      } else {
        // Primer registro con este código - marcar como original
        uniformesCodigos.set(uniforme.codigo, uniforme.id);
      }
    }

    // ============= LIMPIEZA DE BOTAS DIELÉCTRICAS =============
    console.log('👢 Verificando duplicados en botas dieléctricas...');
    const botas = await botasService.getAll();
    const botasCodigos = new Map();
    
    for (const bota of botas) {
      if (botasCodigos.has(bota.codigo)) {
        results.botas.found.push({
          codigo: bota.codigo,
          duplicateId: bota.id,
          originalId: botasCodigos.get(bota.codigo)
        });
        // Eliminar el duplicado
        await botasService.delete(bota.id);
        results.botas.removed++;
        console.log(`❌ Eliminada bota duplicada: ${bota.codigo} (ID: ${bota.id})`);
      } else {
        botasCodigos.set(bota.codigo, bota.id);
      }
    }

    // Verificar duplicados en cascos
    console.log('🪖 Verificando cascos...');
    const cascos = await cascosService.getAll();
    const cascosCodigos = new Map();
    
    for (const casco of cascos) {
      if (cascosCodigos.has(casco.codigo)) {
        results.cascos.found.push({
          codigo: casco.codigo,
          duplicateId: casco.id,
          originalId: cascosCodigos.get(casco.codigo)
        });
        // Eliminar el duplicado
        await cascosService.delete(casco.id);
        results.cascos.removed++;
        console.log(`❌ Eliminado casco duplicado: ${casco.codigo} (ID: ${casco.id})`);
      } else {
        cascosCodigos.set(casco.codigo, casco.id);
      }
    }

    // Verificar duplicados en googles
    console.log('🥽 Verificando googles...');
    const googles = await googlesService.getAll();
    const googlesCodigos = new Map();
    
    for (const google of googles) {
      if (googlesCodigos.has(google.codigo)) {
        results.googles.found.push({
          codigo: google.codigo,
          duplicateId: google.id,
          originalId: googlesCodigos.get(google.codigo)
        });
        // Eliminar el duplicado
        await googlesService.delete(google.id);
        results.googles.removed++;
        console.log(`❌ Eliminado google duplicado: ${google.codigo} (ID: ${google.id})`);
      } else {
        googlesCodigos.set(google.codigo, google.id);
      }
    }

    const totalRemoved = results.uniformes.removed + results.botas.removed + 
                        results.cascos.removed + results.googles.removed;

    console.log('📊 Resumen de duplicados eliminados:');
    console.log(`- Uniformes: ${results.uniformes.removed}`);
    console.log(`- Botas: ${results.botas.removed}`);
    console.log(`- Cascos: ${results.cascos.removed}`);
    console.log(`- Googles: ${results.googles.removed}`);
    console.log(`- Total eliminados: ${totalRemoved}`);

    if (totalRemoved === 0) {
      console.log('✅ No se encontraron duplicados');
    } else {
      console.log(`🧹 Se eliminaron ${totalRemoved} registros duplicados`);
    }

    return results;

  } catch (error) {
    console.error('❌ Error al buscar duplicados:', error);
    throw error;
  }
};

/**
 * Función para mostrar estadísticas de la base de datos
 */
export const showDatabaseStats = async () => {
  try {
    console.log('📊 Obteniendo estadísticas de la base de datos...');
    
    const uniformes = await uniformesService.getAll();
    const botas = await botasService.getAll();
    const cascos = await cascosService.getAll();
    const googles = await googlesService.getAll();

    console.log('📈 Estadísticas actuales:');
    console.log(`- Uniformes: ${uniformes.length} registros`);
    console.log(`- Botas: ${botas.length} registros`);
    console.log(`- Cascos: ${cascos.length} registros`);
    console.log(`- Googles: ${googles.length} registros`);
    console.log(`- Total: ${uniformes.length + botas.length + cascos.length + googles.length} registros`);

    // Mostrar códigos únicos
    const uniformesCodigos = [...new Set(uniformes.map(u => u.codigo))];
    const botasCodigos = [...new Set(botas.map(b => b.codigo))];
    const cascosCodigos = [...new Set(cascos.map(c => c.codigo))];
    const googlesCodigos = [...new Set(googles.map(g => g.codigo))];

    console.log('🔍 Códigos únicos:');
    console.log(`- Uniformes: ${uniformesCodigos.length} códigos únicos`);
    console.log(`- Botas: ${botasCodigos.length} códigos únicos`);
    console.log(`- Cascos: ${cascosCodigos.length} códigos únicos`);
    console.log(`- Googles: ${googlesCodigos.length} códigos únicos`);

    return {
      counts: {
        uniformes: uniformes.length,
        botas: botas.length,
        cascos: cascos.length,
        googles: googles.length,
        total: uniformes.length + botas.length + cascos.length + googles.length
      },
      uniqueCodes: {
        uniformes: uniformesCodigos.length,
        botas: botasCodigos.length,
        cascos: cascosCodigos.length,
        googles: googlesCodigos.length
      }
    };

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    throw error;
  }
};
