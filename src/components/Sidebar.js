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
import logoHulux from '../assets/images/LOGO NEGATIVO X AZUL.png';

const Sidebar = ({ activeSection, setActiveSection, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: MdDashboard, label: 'Dashboard', color: '#94EDF2' },
    { id: 'uniformes', icon: MdInventory, label: 'Uniformes', color: '#CDDB00' },
    { id: 'botas_dialectricas', icon: FaShoePrints, label: 'Botas Dieléctricas', color: '#FF5E00' },
    { id: 'cascos', icon: FaHardHat, label: 'Cascos', color: '#94EDF2' },
    { id: 'googles', icon: MdRemoveRedEye, label: 'Goggles', color: '#70003F' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src={logoHulux} alt="Hulux Logo" className="logo-image" />
          <div className="logo-text">
            <h3>Sistema de Gestión</h3>
            <p>Inventarios</p>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <MdPeople size={20} />
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name || 'Admin'}</p>
          <p className="user-role">{user?.role || 'Usuario del Sistema'}</p>
        </div>
        <button className="user-logout" onClick={onLogout} title="Cerrar Sesión">
          <MdLogout size={18} />
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
