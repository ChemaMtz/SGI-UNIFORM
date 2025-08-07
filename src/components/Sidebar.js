import React from 'react';
import { 
  MdDashboard,
  MdInventory,
  MdPeople,
  MdLogout,
  MdRemoveRedEye
} from 'react-icons/md';
import { 
  FaHardHat,
  FaShoePrints
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: MdDashboard, label: 'Dashboard', color: '#3b82f6' },
    { id: 'uniformes', icon: MdInventory, label: 'Uniformes', color: '#10b981' },
    { id: 'botas_dialectricas', icon: FaShoePrints, label: 'Botas Dieléctricas', color: '#8b5cf6' },
    { id: 'cascos', icon: FaHardHat, label: 'Cascos', color: '#f59e0b' },
    { id: 'googles', icon: MdRemoveRedEye, label: 'Googles', color: '#ef4444' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">SGI</div>
          <div className="logo-text">
            <h3>SGI - Hulux Telecomunicaciones</h3>
            <p>Sistema de Gestión de Inventarios</p>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <MdPeople size={20} />
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name || 'Juan Pérez'}</p>
          <p className="user-role">{user?.role || 'Administrador'}</p>
        </div>
        <button className="user-logout" onClick={onLogout} title="Cerrar Sesión">
          <MdLogout size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
              style={{
                '--item-color': item.color
              }}
            >
              <div className="nav-icon">
                <Icon size={20} />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-status">
          <div className="status-indicator online"></div>
          <span>Sistema Online</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
