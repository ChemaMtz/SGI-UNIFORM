import React, { useState } from 'react';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';
import './Notification.css';

/**
 * Hook personalizado para manejar notificaciones
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remover la notificación después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return {
    notifications,
    showNotification,
    removeNotification
  };
};

/**
 * Componente de Notificación Individual
 */
const NotificationItem = ({ notification, onRemove }) => {
  const { id, message, type } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <MdCheckCircle />;
      case 'error':
        return <MdError />;
      case 'warning':
        return <MdWarning />;
      default:
        return <MdInfo />;
    }
  };

  const getClassName = () => {
    return `notification notification-${type}`;
  };

  return (
    <div className={getClassName()}>
      <div className="notification-icon">
        {getIcon()}
      </div>
      <div className="notification-content">
        <p className="notification-message">{message}</p>
      </div>
      <button 
        className="notification-close"
        onClick={() => onRemove(id)}
        aria-label="Cerrar notificación"
      >
        <MdClose />
      </button>
    </div>
  );
};

/**
 * Contenedor de Notificaciones
 */
const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
