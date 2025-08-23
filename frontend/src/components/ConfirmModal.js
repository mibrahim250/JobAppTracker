import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, application }) => {
  if (!isOpen || !application) return null;

  const message = `Are you sure you want to delete the application for ${application.company} - ${application.role}?`;

  return (
    <div className="modal show">
      <div className="modal-content confirm-modal">
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
