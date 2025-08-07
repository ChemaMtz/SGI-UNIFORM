import React, { useState, useEffect, useRef } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdSearch,
  MdWarning,
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';
import { FaHardHat } from 'react-icons/fa';
import { cascosService } from '../firebase/services';
import '../styles/inventory.css';

/**
 * Cascos Component
 * Gestiona el inventario de Cascos de Seguridad
 * Nomenclatura: CAS-XXX (Cascos + número secuencial)
 */
const Cascos = () => {
  // Estados del componente
  const [cascos, setCascos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroColor, setFiltroColor] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  // Estado para navegación de tabla (scroll horizontal)
  const [tableScrollPos, setTableScrollPos] = useState(0);
  const [sortField, setSortField] = useState('codigo');
  const [sortDirection, setSortDirection] = useState('asc');

  // Referencia para el contenedor de la tabla
  const tableContainerRef = useRef(null);

  // Configuración del formulario con estructura CSV
  const [formData, setFormData] = useState({
    codigo: '',         // CAS-XXX
    nombre: '',         // Nombre del modelo/tipo
    color: '',          // Color del casco
    stockInicial: 0,    // Stock inicial registrado
    nuevosIngresos: 0,  // Nuevos ingresos al inventario
    salidas: 0,         // Salidas del inventario
    totalStock: 0,      // Stock total calculado
    estado: 'Disponible' // Estado actual
  });

  // Función para obtener el color hexadecimal según el nombre
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

  // Función para restablecer el formulario
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

  // Cargar datos desde Firebase
  useEffect(() => {
    loadCascos();
  }, []);

  const loadCascos = async () => {
    try {
      const data = await cascosService.getAll();
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
          totalStock: totalStock,
          estado: estado
        };
      });
      setCascos(processedData);
    } catch (error) {
      console.error('Error al cargar cascos:', error);
    } finally {
      setLoading(false);
    }
  };

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
        await cascosService.update(editingItem.id, dataToSave);
      } else {
        await cascosService.add(dataToSave);
      }
      
      await loadCascos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
      try {
        await cascosService.delete(id);
        await loadCascos();
      } catch (error) {
        console.error('Error al eliminar:', error);
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
  const filteredCascos = cascos.filter(item => {
    const matchesSearch = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesColor = !filtroColor || item.color === filtroColor;
    const matchesEstado = !filtroEstado || item.estado === filtroEstado;
    
    return matchesSearch && matchesColor && matchesEstado;
  }).sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Convertir a string para comparación consistente
    aValue = String(aValue || '').toLowerCase();
    bValue = String(bValue || '').toLowerCase();
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, undefined, { numeric: true });
    } else {
      return bValue.localeCompare(aValue, undefined, { numeric: true });
    }
  });

  // Obtener colores únicos para el filtro
  const coloresDisponibles = [...new Set(cascos.map(item => item.color))];

  return (
    <div className="inventory-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <FaHardHat className="page-icon" />
            <div>
              <h1>Cascos de Seguridad</h1>
              <p>Gestión de inventario CAS-XXX</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <MdAdd size={20} />
            Agregar Casco
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
            value={filtroColor} 
            onChange={(e) => setFiltroColor(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los colores</option>
            {coloresDisponibles.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
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
            ) : filteredCascos.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No hay registros</td>
              </tr>
            ) : (
              filteredCascos.map((item) => (
                <tr key={item.id}>
                  <td>{item.codigo}</td>
                  <td>{item.nombre}</td>
                  <td>
                    <div className="color-indicator">
                      <span 
                        className="color-circle" 
                        style={{ backgroundColor: getColorValue(item.color) }}
                      ></span>
                      {item.color}
                    </div>
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
                {editingItem ? 'Editar' : 'Agregar'} Casco de Seguridad
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
                  <label>Código CAS-XXX</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="CAS-001"
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
    </div>
  );
};

export default Cascos;
