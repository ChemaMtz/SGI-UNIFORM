import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdSearch,
  MdWarning,
  MdCheckCircle,
  MdInventory,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';
import { uniformesService } from '../firebase/services';
import NotificationContainer, { useNotification } from './Notification';
import '../styles/inventory.css';

/**
 * Uniformes Component
 * Gestiona el inventario de Uniformes
 * Nomenclaturas: PMC-XXX (Playeras Manga Corta), PML-XXX (Playeras Manga Larga), CAM-XXX (Camisas)
 */
const Uniformes = () => {
  // Estados del componente
  const [uniformes, setUniformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroTalla, setFiltroTalla] = useState('');
  const [filtroSexo, setFiltroSexo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  // Estado para navegación de tabla (scroll horizontal)
  const [tableScrollPos, setTableScrollPos] = useState(0);
  const [sortField, setSortField] = useState('codigo');
  const [sortDirection, setSortDirection] = useState('asc');

  // Referencia para el contenedor de la tabla
  const tableContainerRef = useRef(null);

  // Hook para manejar notificaciones
  const { notifications, showNotification, removeNotification } = useNotification();

  // Configuración del formulario con estructura CSV
  const [formData, setFormData] = useState({
    codigo: '',         // PMC-XXX, PML-XXX, CAM-XXX
    tipo: '',           // Tipo de uniforme
    color: '',          // Color del uniforme
    talla: '',          // Talla disponible
    sexo: '',           // Sexo (Hombre/Mujer)
    stockInicial: 0,    // Stock inicial registrado
    nuevosIngresos: 0,  // Nuevos ingresos al inventario
    salidas: 0,         // Salidas del inventario
    totalStock: 0,      // Stock total calculado
    estado: 'Disponible' // Estado actual
  });

  // Función para obtener el color hexadecimal según el nombre
  const getColorValue = (colorName) => {
    const colorMap = {
      'Naranja': '#ea580c',
      'Gris jasper': '#6b7280',
      'Gris Oxford': '#4b5563',
      'Negro': '#1f2937',
      'Azul y negro': '#1e40af',
      'Cafe-naranja': '#92400e',
      'Blanco': '#ffffff',
      'Rosa': '#ec4899',
      'Transparentes con naranja': '#fed7aa',
      'Verde blanco y rojo': '#16a34a',
      'Transparentes': '#f3f4f6',
      'Naranja y negro': '#ea580c',
      'Cafe obscuro': '#451a03',
      'Azul Navy': '#001f3f',
      'Azul Oxford': '#0d3b66',
      'Gris Jaspe': '#8d99ae',
      'Sport Grey': '#a8a8a8'
    };
    return colorMap[colorName] || '#6b7280';
  };

  // Función para mostrar el badge de estado
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

  // Función para obtener el badge de sexo
  const getSexoBadge = (sexo) => {
    return sexo === 'Mujer' ? 
      <span className="sexo-badge mujer">{sexo}</span> : 
      <span className="sexo-badge hombre">{sexo}</span>;
  };

  // Función para restablecer el formulario
  const resetForm = () => {
    setFormData({
      codigo: '',
      tipo: '',
      color: '',
      talla: '',
      sexo: '',
      stockInicial: 0,
      nuevosIngresos: 0,
      salidas: 0,
      totalStock: 0,
      estado: 'Disponible'
    });
    setEditingItem(null);
  };

  const loadUniformes = useCallback(async (showErrorNotification = false) => {
    try {
      const data = await uniformesService.getAll();
      // Procesar datos para calcular totalStock y actualizar estado basado en el stock
      const processedData = data.map(item => {
        const totalStock = (item.stockInicial || 0) + (item.nuevosIngresos || 0) - (item.salidas || 0);
        let estado = item.estado;
        
        // Actualizar estado basado en el stock total
        if (totalStock <= 0) {
          estado = 'Agotado';
        } else if (totalStock <= 10) {
          estado = 'Stock Bajo';
        } else if (item.estado === 'Agotado' && totalStock > 0) {
          estado = 'Disponible';
        }
        
        return {
          ...item,
          nuevosIngresos: item.nuevosIngresos || 0,
          salidas: item.salidas || 0,
          totalStock: totalStock,
          estado: estado
        };
      });
      setUniformes(processedData);
    } catch (error) {
      console.error('Error al cargar uniformes:', error);
      if (showErrorNotification) {
        showNotification(
          `❌ Error al cargar los uniformes: ${error.message}`,
          'error',
          4000
        );
      }
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Cargar datos desde Firebase
  useEffect(() => {
    loadUniformes();
  }, [loadUniformes]);

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

  /**
   * Verificar si necesita scroll al cargar o cambiar el tamaño
   */
  useEffect(() => {
    const checkScrollNeeded = () => {
      // Los botones ahora siempre están visibles
      if (tableContainerRef.current) {
        // Solo actualizamos la posición de scroll si es necesario
        const scrollPosition = tableContainerRef.current.scrollLeft;
        const maxScroll = tableContainerRef.current.scrollWidth - tableContainerRef.current.clientWidth;
        const scrollPercentage = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
        setTableScrollPos(scrollPercentage);
      }
    };

    checkScrollNeeded();
    window.addEventListener('resize', checkScrollNeeded);
    
    return () => window.removeEventListener('resize', checkScrollNeeded);
  }, [uniformes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calcular stock total
      const stockTotal = formData.stockInicial + formData.nuevosIngresos - formData.salidas;
      
      // Determinar estado basado en el stock total
      let estado;
      if (stockTotal <= 0) {
        estado = 'Agotado';
      } else if (stockTotal <= 10) {
        estado = 'Stock Bajo';
      } else {
        estado = 'Disponible';
      }
      
      const dataToSave = {
        ...formData,
        totalStock: stockTotal,
        estado: estado
      };

      if (editingItem) {
        await uniformesService.update(editingItem.id, dataToSave);
        showNotification(
          `✅ Uniforme "${formData.tipo}" (${formData.codigo}) actualizado exitosamente`,
          'success',
          4000
        );
      } else {
        await uniformesService.add(dataToSave);
        showNotification(
          `🎉 Nuevo uniforme "${formData.tipo}" (${formData.codigo}) agregado al inventario`,
          'success',
          4000
        );
      }
      
      await loadUniformes(true);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar:', error);
      showNotification(
        `❌ Error al ${editingItem ? 'actualizar' : 'guardar'} el uniforme: ${error.message}`,
        'error',
        5000
      );
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Encontrar el item a eliminar para mostrar información en la notificación
    const itemToDelete = uniformes.find(item => item.id === id);
    const itemName = itemToDelete ? `${itemToDelete.tipo} (${itemToDelete.codigo})` : 'el elemento';
    
    if (window.confirm(`¿Estás seguro de eliminar ${itemName}?`)) {
      try {
        await uniformesService.delete(id);
        await loadUniformes(true);
        showNotification(
          `🗑️ Uniforme "${itemName}" eliminado exitosamente`,
          'success',
          3000
        );
      } catch (error) {
        console.error('Error al eliminar:', error);
        showNotification(
          `❌ Error al eliminar el uniforme: ${error.message}`,
          'error',
          4000
        );
      }
    }
  };

  // Función para manejar el ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Función para obtener el icono de ordenamiento
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Filtrar datos
  const filteredUniformes = uniformes.filter(item => {
    const matchesSearch = item.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !filtroTipo || item.tipo === filtroTipo;
    const matchesTalla = !filtroTalla || item.talla === filtroTalla;
    const matchesSexo = !filtroSexo || item.sexo === filtroSexo;
    const matchesEstado = !filtroEstado || item.estado === filtroEstado;
    
    return matchesSearch && matchesTipo && matchesTalla && matchesSexo && matchesEstado;
  }).sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Manejar casos especiales
    if (sortField === 'totalStock') {
      aValue = a.totalStock || a.stockInicial || 0;
      bValue = b.totalStock || b.stockInicial || 0;
    }
    
    // Convertir a string para comparación consistente
    aValue = String(aValue || '').toLowerCase();
    bValue = String(bValue || '').toLowerCase();
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, undefined, { numeric: true });
    } else {
      return bValue.localeCompare(aValue, undefined, { numeric: true });
    }
  });

  // Obtener valores únicos para los filtros
  const tiposDisponibles = [...new Set(uniformes.map(item => item.tipo))];
  const tallasDisponibles = [...new Set(uniformes.map(item => item.talla))];

  return (
    <div className="inventory-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <MdInventory className="page-icon" />
            <div>
              <h1>Uniformes</h1>
              <p>Gestión de inventario PMC-XXX, PML-XXX, CAM-XXX</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <MdAdd size={20} />
            Agregar Uniforme
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
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los tipos</option>
            {tiposDisponibles.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>

          <select 
            value={filtroTalla} 
            onChange={(e) => setFiltroTalla(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las tallas</option>
            {tallasDisponibles.map(talla => (
              <option key={talla} value={talla}>{talla}</option>
            ))}
          </select>

          <select 
            value={filtroSexo} 
            onChange={(e) => setFiltroSexo(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
          </select>

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
                onClick={() => handleSort('tipo')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por tipo"
              >
                Tipo {getSortIcon('tipo')}
              </th>
              <th 
                onClick={() => handleSort('color')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por color"
              >
                Color {getSortIcon('color')}
              </th>
              <th 
                onClick={() => handleSort('talla')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por talla"
              >
                Talla {getSortIcon('talla')}
              </th>
              <th 
                onClick={() => handleSort('sexo')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por sexo"
              >
                Sexo {getSortIcon('sexo')}
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
                <td colSpan="11" className="text-center">Cargando...</td>
              </tr>
            ) : filteredUniformes.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center">No hay registros</td>
              </tr>
            ) : (
              filteredUniformes.map((item) => (
                <tr key={item.id}>
                  <td>{item.codigo}</td>
                  <td>{item.tipo}</td>
                  <td>
                    <div className="color-indicator">
                      <span 
                        className="color-circle" 
                        style={{ backgroundColor: getColorValue(item.color) }}
                      ></span>
                      {item.color}
                    </div>
                  </td>
                  <td>{item.talla}</td>
                  <td>{getSexoBadge(item.sexo)}</td>
                  <td>{item.stockInicial}</td>
                  <td>{item.nuevosIngresos || 0}</td>
                  <td>{item.salidas || 0}</td>
                  <td className={(item.totalStock || item.stockInicial) <= 10 ? 'stock-low' : ''}>
                    {item.totalStock || item.stockInicial}
                  </td>
                  <td>{getEstadoBadge(item.estado, item.totalStock || item.stockInicial)}</td>
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
                {editingItem ? 'Editar' : 'Agregar'} Uniforme
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
                  <label>Código (PMC/PML/CAM-XXX)</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="PMC-001, PML-001, CAM-001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Playera manga corta">Playera manga corta</option>
                    <option value="Playera manga larga">Playera manga larga</option>
                    <option value="Camisa">Camisa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar color</option>
                    <option value="Naranja">Naranja</option>
                    <option value="Gris jasper">Gris jasper</option>
                    <option value="Gris Oxford">Gris Oxford</option>
                    <option value="Negro">Negro</option>
                    <option value="Azul y negro">Azul y negro</option>
                    <option value="Cafe-naranja">Cafe-naranja</option>
                    <option value="Blanco">Blanco</option>
                    <option value="Rosa">Rosa</option>
                    <option value="Azul Navy">Azul Navy</option>
                    <option value="Azul Oxford">Azul Oxford</option>
                    <option value="Gris Jaspe">Gris Jaspe</option>
                    <option value="Sport Grey">Sport Grey</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Talla</label>
                  <select
                    value={formData.talla}
                    onChange={(e) => setFormData({...formData, talla: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar talla</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="Ch">Ch</option>
                    <option value="L">L</option>
                    <option value="GL">GL</option>
                    <option value="XL">XL</option>
                    <option value="2XL">2XL</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Sexo</label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar sexo</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
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

export default Uniformes;
