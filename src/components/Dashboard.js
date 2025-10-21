// Importaciones de React y hooks
import React, { useState, useEffect } from 'react';

// Importación de iconos para la interfaz del dashboard
import { 
  MdInventory,    // Icono de inventario
  MdWarning,      // Icono de advertencia
  MdCheckCircle,  // Icono de verificación
  MdGpsFixed,     // Icono de precisión
  MdAccessTime,   // Icono de tiempo
  MdTrendingUp,   // Icono de tendencia al alza
  MdTrendingDown  // Icono de tendencia a la baja
} from 'react-icons/md';

import { 
  FaBoxes        // Icono de cajas/inventario
} from 'react-icons/fa';

// Servicios de Firebase y utilidades
import { dashboardService } from '../firebase/services';
import { findAndRemoveDuplicates, showDatabaseStats } from '../utils/removeDuplicates';

// Imagen de fondo
import backgroundImage from '../assets/images/Hulux.jpeg';

// Estilos específicos del dashboard
import './Dashboard.css';

/**
 * Componente Dashboard - Panel de Control Principal
 * 
 * Proporciona una vista general del sistema de inventario con:
 * - Estadísticas clave en tiempo real
 * - Métricas de rendimiento
 * - Actividad reciente
 * - Herramientas de administración (limpieza de duplicados)
 * 
 * Datos mostrados:
 * - Total de artículos en inventario
 * - Artículos en estado crítico
 * - Stock total disponible
 * - Exactitud del inventario
 * - Tiempo de respuesta del sistema
 */
const Dashboard = ({ setActiveSection }) => {
  // ============= ESTADOS DEL COMPONENTE =============
  
  // Estado principal de estadísticas del dashboard
  const [stats, setStats] = useState({
    totalArticulos: 0,        // Total de productos en el inventario
    articulosCriticos: 0,     // Productos con stock bajo o agotado
    articulosAgotados: 0,     // Productos completamente sin stock
    stockTotal: 0,            // Suma total de todas las unidades
    ordenesPendientes: 0,     // Órdenes en proceso (futuro)
    ordenesCompletadas: 0,    // Órdenes completadas (futuro)
    exactitudInventario: 0,   // Porcentaje de exactitud del inventario
    tiempoRespuesta: 0        // Tiempo promedio de respuesta en ms
  });
  
  // Lista de actividades recientes del sistema
  const [activities, setActivities] = useState([]);
  
  // Estados de control de interfaz
  const [loading, setLoading] = useState(true);              // Estado de carga inicial
  const [cleaningDuplicates, setCleaningDuplicates] = useState(false); // Estado de limpieza
  const [showingStats, setShowingStats] = useState(false);   // Estado de mostrar estadísticas

  // ============= EFECTOS Y CARGA DE DATOS =============
  
  // Carga las estadísticas al montar el componente
  useEffect(() => {
    loadStats();
  }, []);

  /**
   * Carga las estadísticas y actividades recientes desde Firebase
   * Realiza llamadas paralelas para optimizar la carga
   */
  const loadStats = async () => {
    try {
      // Llamadas paralelas para mejor rendimiento
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivity()
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDuplicates = async () => {
    if (window.confirm('¿Estás seguro de eliminar todos los registros duplicados? Esta acción no se puede deshacer.')) {
      setCleaningDuplicates(true);
      try {
        const results = await findAndRemoveDuplicates();
        alert(`Duplicados eliminados:\n- Uniformes: ${results.uniformes.removed}\n- Botas: ${results.botas.removed}\n- Cascos: ${results.cascos.removed}\n- Googles: ${results.googles.removed}`);
        await loadStats(); // Recargar estadísticas
      } catch (error) {
        alert('Error al eliminar duplicados: ' + error.message);
      } finally {
        setCleaningDuplicates(false);
      }
    }
  };

  const handleShowStats = async () => {
    setShowingStats(true);
    try {
      const stats = await showDatabaseStats();
      alert(`Estadísticas de BD:\n- Uniformes: ${stats.counts.uniformes} registros (${stats.uniqueCodes.uniformes} únicos)\n- Botas: ${stats.counts.botas} registros (${stats.uniqueCodes.botas} únicos)\n- Cascos: ${stats.counts.cascos} registros (${stats.uniqueCodes.cascos} únicos)\n- Googles: ${stats.counts.googles} registros (${stats.uniqueCodes.googles} únicos)\n- Total: ${stats.counts.total} registros`);
    } catch (error) {
      alert('Error al obtener estadísticas: ' + error.message);
    } finally {
      setShowingStats(false);
    }
  };

  // Funciones de navegación a secciones específicas
  const navigateToUniformes = () => {
    if (setActiveSection) {
      setActiveSection('uniformes');
    }
  };

  const navigateToBotas = () => {
    if (setActiveSection) {
      setActiveSection('botas_dialectricas');
    }
  };

  const navigateToCascos = () => {
    if (setActiveSection) {
      setActiveSection('cascos');
    }
  };

  const navigateToGoogles = () => {
    if (setActiveSection) {
      setActiveSection('googles');
    }
  };

  const StatCard = ({ icon: Icon, title, value, percentage, trend, color = 'blue' }) => {
    const getUnit = (title) => {
      if (title.includes('Tiempo')) return 'seg';
      if (title.includes('Exactitud') || title.includes('%')) return '%';
      if (title.includes('Stock Total')) return 'unidades';
      return 'items';
    };

    return (
      <div className={`stat-card stat-card-${color}`}>
        <div className="stat-header">
          <Icon className="stat-icon" size={28} />
          <div className="stat-percentage">
            {trend === 'up' ? <MdTrendingUp size={18} /> : <MdTrendingDown size={18} />}
            {percentage}%
          </div>
        </div>
        <div className="stat-content">
          <h3 className="stat-title">{title}</h3>
          <p className="stat-value">{value}</p>
          <span className="stat-unit">{getUnit(title)}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard - Almacén Hulux</h1>
          <p>Resumen ejecutivo del sistema de gestión de inventarios</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={MdInventory}
          title="Total de Artículos"
          value={stats.totalArticulos}
          percentage="5.2"
          trend="up"
          color="blue"
        />
        <StatCard
          icon={MdWarning}
          title="Stock Crítico"
          value={stats.articulosCriticos}
          percentage="12.3"
          trend={stats.articulosCriticos > 10 ? "up" : "down"}
          color="orange"
        />
        <StatCard
          icon={FaBoxes}
          title="Stock Total"
          value={stats.stockTotal}
          percentage="8.1"
          trend="up"
          color="purple"
        />
        <StatCard
          icon={MdCheckCircle}
          title="Artículos Disponibles"
          value={stats.totalArticulos - stats.articulosAgotados}
          percentage="15.7"
          trend="up"
          color="green"
        />
        <StatCard
          icon={MdGpsFixed}
          title="Exactitud del Inventario"
          value={stats.exactitudInventario}
          percentage="2.3"
          trend={stats.exactitudInventario >= 90 ? "up" : "down"}
          color="teal"
        />
        <StatCard
          icon={MdAccessTime}
          title="Tiempo de Respuesta"
          value={stats.tiempoRespuesta}
          percentage="18.5"
          trend="down"
          color="indigo"
        />
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <div className="section-header">
            <h2>Actividad Reciente</h2>
          </div>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'warning' ? <MdWarning size={20} /> : <FaBoxes size={20} />}
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <div className="activity-icon">
                  <FaBoxes size={20} />
                </div>
                <div className="activity-content">
                  <p>Sistema funcionando correctamente</p>
                  <span>Sin alertas recientes</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Acciones Rápidas</h2>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={navigateToUniformes}>
              <MdInventory size={28} />
              <span>Gestionar Uniformes</span>
            </button>
            <button className="quick-action-btn" onClick={navigateToBotas}>
              <FaBoxes size={28} />
              <span>Botas Dieléctricas</span>
            </button>
            <button className="quick-action-btn" onClick={navigateToCascos}>
              <MdGpsFixed size={28} />
              <span>Control de Cascos</span>
            </button>
            <button className="quick-action-btn" onClick={navigateToGoogles}>
              <MdCheckCircle size={28} />
              <span>Lentes de Seguridad</span>
            </button>
            <button 
              className="quick-action-btn secondary" 
              onClick={handleShowStats}
              disabled={showingStats}
            >
              <MdTrendingUp size={28} />
              <span>{showingStats ? 'Consultando...' : 'Estadísticas BD'}</span>
            </button>
            <button 
              className="quick-action-btn danger" 
              onClick={handleRemoveDuplicates}
              disabled={cleaningDuplicates}
            >
              <MdWarning size={28} />
              <span>{cleaningDuplicates ? 'Limpiando...' : 'Limpiar Duplicados'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
