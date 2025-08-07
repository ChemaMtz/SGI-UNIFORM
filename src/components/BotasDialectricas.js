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
import { FaShoePrints } from 'react-icons/fa';
import { botasService } from '../firebase/services';
import '../styles/inventory.css';

/**
 * BotasDialectricas Component
 * Gestiona el inventario de Botas Dieléctricas
 * Nomenclatura: BDI-XXX (Botas Dieléctricas + número secuencial)
 */
const BotasDialectricas = () => {
  // Estados del componente
  const [botas, setBotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTalla, setFiltroTalla] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  // Estado para navegación de tabla (scroll horizontal)
  const [tableScrollPos, setTableScrollPos] = useState(0);
  const [sortField, setSortField] = useState('codigo');
  const [sortDirection, setSortDirection] = useState('asc');

  // Referencia para el contenedor de la tabla
  const tableContainerRef = useRef(null);

  // Configuración del formulario con estructura CSV
  const [formData, setFormData] = useState({
    codigo: '',         // BDI-XXX
    nombre: '',         // Nombre del modelo/tipo
    color: '',          // Color de las botas
    talla: '',          // Talla disponible
    stockInicial: 0,    // Stock inicial registrado
    nuevosIngresos: 0,  // Nuevos ingresos al inventario
    salidas: 0,         // Salidas del inventario
    totalStock: 0,      // Stock total calculado
    estado: 'Disponible' // Estado actual
  });

  // Función para obtener el color hexadecimal según el nombre
  const getColorValue = (colorName) => {
    const colorMap = {
      'Azul y negro': '#1e40af',
      'Naranja y negro': '#ea580c',
      'Café obscuro': '#451a03'
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
      talla: '',
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
    loadBotas();
  }, []);

  const loadBotas = async () => {
    try {
      const data = await botasService.getAll();
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
      setBotas(processedData);
    } catch (error) {
      console.error('Error al cargar botas:', error);
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
        await botasService.update(editingItem.id, dataToSave);
      } else {
        await botasService.add(dataToSave);
      }
      
      await loadBotas();
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
        await botasService.delete(id);
        await loadBotas();
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
  const filteredBotas = botas.filter(item => {
    const matchesSearch = item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTalla = !filtroTalla || item.talla === filtroTalla;
    const matchesEstado = !filtroEstado || item.estado === filtroEstado;
    
    return matchesSearch && matchesTalla && matchesEstado;
  }).sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Manejar casos especiales para tallas numéricas
    if (sortField === 'talla') {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    }
    
    // Convertir a string para comparación consistente (excepto números)
    if (typeof aValue !== 'number') {
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return typeof aValue === 'number' ? aValue - bValue : aValue.localeCompare(bValue, undefined, { numeric: true });
    } else {
      return typeof aValue === 'number' ? bValue - aValue : bValue.localeCompare(aValue, undefined, { numeric: true });
    }
  });

  // Obtener tallas únicas para el filtro
  const tallasDisponibles = [...new Set(botas.map(item => item.talla))].sort();

  return (
    <div className="inventory-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <FaShoePrints className="page-icon" />
            <div>
              <h1>Botas Dieléctricas</h1>
              <p>Gestión de inventario BDI-XXX</p>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <MdAdd size={20} />
            Agregar Botas
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
            value={filtroTalla} 
            onChange={(e) => setFiltroTalla(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las tallas</option>
            {tallasDisponibles.map(talla => (
              <option key={talla} value={talla}>Talla {talla}</option>
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
                onClick={() => handleSort('talla')} 
                style={{ cursor: 'pointer' }}
                title="Ordenar por talla"
              >
                Talla {getSortIcon('talla')}
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
                <td colSpan="10" className="text-center">Cargando...</td>
              </tr>
            ) : filteredBotas.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">No hay registros</td>
              </tr>
            ) : (
              filteredBotas.map((item) => (
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
                  <td>{item.talla}</td>
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
                {editingItem ? 'Editar' : 'Agregar'} Botas Dieléctricas
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
                  <label>Código BDI-XXX</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="BDI-001"
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
                    <option value="Azul y negro">Azul y negro</option>
                    <option value="Naranja y negro">Naranja y negro</option>
                    <option value="Café obscuro">Café obscuro</option>
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
                    {[...Array(15)].map((_, i) => {
                      const talla = (24 + i).toString();
                      return <option key={talla} value={talla}>{talla}</option>;
                    })}
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

export default BotasDialectricas;
