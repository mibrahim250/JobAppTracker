import React from 'react';

const Notification = ({ message, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      default:
        return '#2196F3';
    }
  };

  return (
    <div 
      className="notification"
      style={{ background: getBackgroundColor() }}
    >
      <i className={getIcon()}></i>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default Notification;
