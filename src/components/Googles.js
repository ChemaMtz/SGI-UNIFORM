// Importaciones de React y hooks necesarios
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Importación de iconos de Material Design para la interfaz
import { 
  MdAdd,           // Icono para agregar nuevos elementos
  MdEdit,          // Icono para editar elementos existentes
  MdDelete,        // Icono para eliminar elementos
  MdSearch,        // Icono para búsqueda
  MdWarning,       // Icono de advertencia para estados críticos
  MdCheckCircle,   // Icono de verificación para estados positivos
  MdRemoveRedEye,  // Icono para ver detalles
  MdChevronLeft,   // Icono para navegación izquierda
  MdChevronRight   // Icono para navegación derecha
} from 'react-icons/md';
// Servicio de Firebase para operaciones CRUD de Googles
import { googlesService } from '../firebase/services';
// Componente de notificaciones
import NotificationContainer, { useNotification } from './Notification';
// Estilos CSS específicos para componentes de inventario
import '../styles/inventory.css';

/**
 * Componente Googles - Gestión de Inventario de Lentes de Seguridad
 * 
 * Este componente maneja el inventario completo de lentes/googles de seguridad,
 * incluyendo operaciones CRUD, filtrado, búsqueda y ordenamiento.
 * 
 * Nomenclatura utilizada: GOG-XXX (donde XXX es un número secuencial)
 * 
 * Funcionalidades principales:
 * - Visualización de inventario en tabla ordenable
 * - Agregar, editar y eliminar elementos
 * - Búsqueda por múltiples campos
 * - Filtrado por estado
 * - Cálculo automático de stock total y estado
 * - Gestión de entradas y salidas de inventario
 */
const Googles = () => {
  // ============= ESTADOS DEL COMPONENTE =============
  
  // Estado principal - Lista de todos los googles
  const [googles, setGoogles] = useState([]);
  
  // Estado de carga para mostrar indicadores de loading
  const [loading, setLoading] = useState(true);
  
  // Control del modal para agregar/editar elementos
  const [showModal, setShowModal] = useState(false);
  
  // Elemento actualmente en edición (null para nuevos elementos)
  const [editingItem, setEditingItem] = useState(null);
  
  // Término de búsqueda para filtrar elementos
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para navegación de tabla (scroll horizontal)
  const [tableScrollPos, setTableScrollPos] = useState(0);
  
  // Filtro por estado (Disponible, Agotado, Stock Bajo)
  const [filtroEstado, setFiltroEstado] = useState('');
  
  // Campo por el cual ordenar la tabla
  const [sortField, setSortField] = useState('codigo');
  
  // Dirección del ordenamiento (asc/desc)
  const [sortDirection, setSortDirection] = useState('asc');

  // Referencia para el contenedor de la tabla
  const tableContainerRef = useRef(null);

  // Hook para manejar notificaciones
  const { notifications, showNotification, removeNotification } = useNotification();

  // ============= CONFIGURACIÓN DEL FORMULARIO =============
  
  // Estructura de datos para formularios - coincide con esquema de base de datos
  const [formData, setFormData] = useState({
    codigo: '',         // Código único: GOG-XXX
    nombre: '',         // Nombre/modelo del producto
    color: '',          // Color del lente/frame
    stockInicial: 0,    // Stock inicial al registrar el producto
    nuevosIngresos: 0,  // Cantidad de nuevas unidades ingresadas
    salidas: 0,         // Cantidad de unidades que han salido del inventario
    totalStock: 0,      // Stock total calculado automáticamente
    estado: 'Disponible' // Estado actual del producto
  });

  // ============= FUNCIONES DE UTILIDAD =============
  
  /**
   * Genera el badge visual para mostrar el estado del producto
   * @param {string} estado - Estado actual del producto
   * @param {number} stock - Cantidad actual en stock
   * @returns {JSX.Element} Badge con icono y color según el estado
   */
  const getEstadoBadge = (estado, stock) => {
    switch (estado) {
      case 'Disponible':
        return <span className="badge badge-success"><MdCheckCircle size={14} /> {estado}</span>;
      case 'Agotado':
        return <span className="badge badge-danger"><MdWarning size={14} /> {estado}</span>;
      case 'Stock Bajo':
        return <span className="badge badge-warning"><MdWarning size={14} /> {estado}</span>;
      case 'En Mantenimiento':
        return <span className="badge badge-warning">🔧 {estado}</span>;
      default:
        return <span className="badge badge-secondary">{estado}</span>;
    }
  };

  /**
   * Mapea nombres de colores a valores hexadecimales
   * @param {string} colorName - Nombre del color en español
   * @returns {string} Código hexadecimal del color
   */
  const getColorValue = (colorName) => {
    const colorMap = {
      'Blanco': '#ffffff',
      'Amarillo': '#fbbf24', 
      'Rojo': '#dc2626',
      'Azul': '#2563eb',
      'Verde': '#16a34a',
      'Negro': '#1f2937',
      'Naranja': '#ea580c'
    };
    return colorMap[colorName] || '#6b7280'; // Color gris por defecto
  };

  /**
   * Restablece el formulario a su estado inicial
   * Limpia todos los campos y resetea el elemento en edición
   */
  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      color: '',
      stockInicial: 0,
      nuevosIngresos: 0,
      salidas: 0,
      totalStock: 0,
      estado: 'Disponible'
    });
    setEditingItem(null);
  };

  // ============= EFECTOS Y CARGA DE DATOS =============
  
  // Efecto para cargar datos al montar el componente
  /**
   * Carga todos los googles desde Firebase y procesa los datos
   * Calcula automáticamente el stock total y actualiza estados según disponibilidad
   */
  const loadGoogles = useCallback(async (showErrorNotification = false) => {
    try {
      const data = await googlesService.getAll();
      
      // Procesamiento de datos para cálculos automáticos
      const processedData = data.map(item => {
        // Cálculo del stock total: inicial + ingresos - salidas
        const totalStock = (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0);
        let estado = item.estado;
        
        // Lógica automática de actualización de estado basada en stock
        if (totalStock <= 0) {
          estado = 'Agotado';
        } else if (totalStock <= 10) {
          estado = 'Stock Bajo';
        } else if (item.estado === 'Agotado' && totalStock > 0) {
          estado = 'Disponible';
        }
        
        return {
          ...item,
          totalStock: totalStock,
          estado: estado
        };
      });
      
      setGoogles(processedData);
    } catch (error) {
      console.error('Error al cargar googles:', error);
      if (showErrorNotification) {
        showNotification(
          `❌ Error al cargar los googles de protección: ${error.message}`,
          'error',
          4000
        );
      }
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadGoogles();
  }, [loadGoogles]);

  /**
   * Maneja el scroll horizontal de la tabla para actualizar indicadores
   */
  const handleTableScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const maxScroll = e.target.scrollWidth - e.target.clientWidth;
    const scrollPercentage = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
    setTableScrollPos(scrollPercentage);
  };

  /**
   * Función para hacer scroll hacia la izquierda
   */
  const scrollLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Función para hacer scroll hacia la derecha
   */
  const scrollRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  // ============= MANEJO DE FORMULARIOS =============
  
  /**
   * Maneja el envío del formulario para crear/editar elementos
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Cálculo automático del stock total
      const stockTotal = formData.stockInicial + formData.nuevosIngresos - formData.salidas;
      
      // Determinación automática del estado basado en stock
      let estado;
      if (stockTotal <= 0) {
        estado = 'Agotado';
      } else if (stockTotal <= 10) {
        estado = 'Stock Bajo';
      } else {
        estado = 'Disponible';
      }
      
      // Preparación de datos para guardar
      const dataToSave = {
        ...formData,
        totalStock: stockTotal,
        estado: estado
      };

      if (editingItem) {
        // Actualización de elemento existente
        await googlesService.update(editingItem.id, dataToSave);
        showNotification(
          `✅ Google de protección "${formData.nombre}" (${formData.codigo}) actualizado exitosamente`,
          'success',
          4000
        );
      } else {
        // Creación de nuevo elemento
        await googlesService.add(dataToSave);
        showNotification(
          `🥽 Nuevo google de protección "${formData.nombre}" (${formData.codigo}) agregado al inventario`,
          'success',
          4000
        );
      }
      
      // Recarga de datos y cierre del modal
      await loadGoogles(true);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar:', error);
      showNotification(
        `❌ Error al ${editingItem ? 'actualizar' : 'guardar'} el google de protección: ${error.message}`,
        'error',
        5000
      );
    }
  };

  /**
   * Prepara un elemento para edición
   * @param {Object} item - Elemento a editar
   */
  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowModal(true);
  };

  /**
   * Elimina un elemento del inventario con confirmación
   * @param {string} id - ID del elemento a eliminar
   */
  const handleDelete = async (id) => {
    // Encontrar el item a eliminar para mostrar información en la notificación
    const itemToDelete = googles.find(item => item.id === id);
    const itemName = itemToDelete ? `${itemToDelete.nombre} (${itemToDelete.codigo})` : 'el elemento';
    
    if (window.confirm(`¿Estás seguro de eliminar ${itemName}?`)) {
      try {
        await googlesService.delete(id);
        await loadGoogles(true);
        showNotification(
          `🗑️ Google de protección "${itemName}" eliminado exitosamente`,
          'success',
          3000
        );
      } catch (error) {
        console.error('Error al eliminar:', error);
        showNotification(
          `❌ Error al eliminar el google de protección: ${error.message}`,
          'error',
          4000
        );
      }
    }
  };

  // ============= FUNCIONES DE ORDENAMIENTO =============
  
  /**
   * Maneja el ordenamiento de la tabla por columna
   * @param {string} field - Campo por el cual ordenar
   */
  const handleSort = (field) => {
    if (sortField === field) {
      // Si ya está ordenado por este campo, cambia la dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nuevo campo de ordenamiento
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /**
   * Obtiene el icono de ordenamiento para mostrar en las columnas
   * @param {string} field - Campo de la columna
   * @returns {string} Icono correspondiente al estado de ordenamiento
   */
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️'; // Icono neutral para campos no ordenados
    return sortDirection === 'asc' ? '↑' : '↓'; // Icono según dirección de ordenamiento
  };

  // ============= FILTRADO Y ORDENAMIENTO DE DATOS =============
  
  /**
   * Aplica filtros de búsqueda y estado, luego ordena los resultados
   * Lógica de filtrado:
   * - Búsqueda: coincidencia parcial en nombre y código
   * - Estado: filtro exacto por estado seleccionado
   * - Ordenamiento: alfanumérico con soporte para números
   */
  const filteredGoogles = googles.filter(item => {
    // Filtro de búsqueda por texto (nombre o código)
    const matchesSearch = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por estado seleccionado
    const matchesEstado = !filtroEstado || item.estado === filtroEstado;
    
    return matchesSearch && matchesEstado;
  }).sort((a, b) => {
    // Obtención de valores para ordenamiento
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Normalización para comparación consistente
    aValue = String(aValue || '').toLowerCase();
    bValue = String(bValue || '').toLowerCase();
    
    // Aplicación de dirección de ordenamiento
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, undefined, { numeric: true });
    } else {
      return bValue.localeCompare(aValue, undefined, { numeric: true });
    }
  });

  // ============= RENDER DEL COMPONENTE =============
  
  return (
    <div className="inventory-container">{/* Contenedor principal del componente */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <MdRemoveRedEye className="page-icon" />
            <div>
              <h1>Lentes de Seguridad</h1>
              <p>Gestión de inventario GOG-XXX</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <MdAdd size={20} />
            Agregar Lentes
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Stock Bajo">Stock Bajo</option>
            <option value="Agotado">Agotado</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="table-wrapper">
        {/* Botones de navegación horizontal - siempre visibles */}
        <div className="table-scroll-buttons">
          <button 
            className="scroll-button scroll-left"
            onClick={scrollLeft}
            title="Scroll izquierda"
          >
            <MdChevronLeft size={20} />
          </button>
          <button 
            className="scroll-button scroll-right"
            onClick={scrollRight}
            title="Scroll derecha"
          >
            <MdChevronRight size={20} />
          </button>
        </div>
        
        {/* Mini navegación de tabla para móviles */}
        <div className="table-navigation hide-desktop">
          <div className="nav-indicator">
            <span className="nav-dots">
              <span className={`dot ${tableScrollPos < 25 ? 'active' : ''}`}></span>
              <span className={`dot ${tableScrollPos >= 25 && tableScrollPos < 50 ? 'active' : ''}`}></span>
              <span className={`dot ${tableScrollPos >= 50 && tableScrollPos < 75 ? 'active' : ''}`}></span>
              <span className={`dot ${tableScrollPos >= 75 ? 'active' : ''}`}></span>
            </span>
            <small>Desliza horizontalmente para navegar</small>
          </div>
        </div>
        
        <div 
          className="table-container" 
          onScroll={handleTableScroll}
          ref={tableContainerRef}
        >
          {/* Indicador de scroll para móviles */}
          <div className="table-scroll-hint hide-desktop">
            <span>👈 Desliza para ver más columnas 👉</span>
          </div>
          <div className="inventory-table">
            <table>
              <thead>
                <tr>
                  <th 
                    onClick={() => handleSort('codigo')} 
                    style={{ cursor: 'pointer' }}
                    title="Ordenar por código"
                  >
                    Código {getSortIcon('codigo')}
                  </th>
              <th 
                onClick={() => handleSort('nombre')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por nombre"
              >
                Nombre {getSortIcon('nombre')}
              </th>
              <th 
                onClick={() => handleSort('color')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por color"
              >
                Color {getSortIcon('color')}
              </th>
              <th 
                onClick={() => handleSort('stockInicial')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por stock inicial"
              >
                Stock Inicial {getSortIcon('stockInicial')}
              </th>
              <th 
                onClick={() => handleSort('nuevosIngresos')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por nuevos ingresos"
              >
                Nuevos Ingresos {getSortIcon('nuevosIngresos')}
              </th>
              <th 
                onClick={() => handleSort('salidas')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por salidas"
              >
                Salidas {getSortIcon('salidas')}
              </th>
              <th 
                onClick={() => handleSort('totalStock')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por stock total"
              >
                Stock Total {getSortIcon('totalStock')}
              </th>
              <th 
                onClick={() => handleSort('estado')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por estado"
              >
                Estado {getSortIcon('estado')}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">Cargando...</td>
              </tr>
            ) : filteredGoogles.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No hay registros</td>
              </tr>
            ) : (
              filteredGoogles.map((item) => (
                <tr key={item.id}>
                  <td>{item.codigo}</td>
                  <td>{item.nombre}</td>
                  <td>
                    <span className="color-badge">
                      <span 
                        className="color-dot" 
                        style={{ backgroundColor: getColorValue(item.color) }}
                      ></span>
                      {item.color}
                    </span>
                  </td>
                  <td>{item.stockInicial}</td>
                  <td>{item.nuevosIngresos}</td>
                  <td>{item.salidas}</td>
                  <td className={item.totalStock <= 10 ? 'stock-low' : ''}>
                    {item.totalStock}
                  </td>
                  <td>{getEstadoBadge(item.estado, item.totalStock)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-edit" 
                        onClick={() => handleEdit(item)}
                      >
                        <MdEdit size={16} />
                      </button>
                      <button 
                        className="btn-action btn-delete" 
                        onClick={() => handleDelete(item.id)}
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingItem ? 'Editar' : 'Agregar'} Lentes de Seguridad
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Código GOG-XXX</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="GOG-001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nombre/Modelo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Nombre del modelo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar color</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Amarillo">Amarillo</option>
                    <option value="Rojo">Rojo</option>
                    <option value="Azul">Azul</option>
                    <option value="Verde">Verde</option>
                    <option value="Negro">Negro</option>
                    <option value="Naranja">Naranja</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Stock Inicial</label>
                  <input
                    type="number"
                    value={formData.stockInicial}
                    onChange={(e) => setFormData({...formData, stockInicial: parseInt(e.target.value) || 0})}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nuevos Ingresos</label>
                  <input
                    type="number"
                    value={formData.nuevosIngresos}
                    onChange={(e) => setFormData({...formData, nuevosIngresos: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Salidas</label>
                  <input
                    type="number"
                    value={formData.salidas}
                    onChange={(e) => setFormData({...formData, salidas: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    required
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Stock Bajo">Stock Bajo</option>
                    <option value="Agotado">Agotado</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenedor de notificaciones */}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default Googles;
