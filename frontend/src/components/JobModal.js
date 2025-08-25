import React, { useState, useEffect } from 'react';

const JobModal = ({ isOpen, onClose, onSave, application }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: '',
    notes: '',
    appliedDate: ''
  });

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company || '',
        role: application.role || '',
        status: application.status || '',
        notes: application.notes || '',
        appliedDate: application.appliedDate || ''
      });
    } else {
      // Set default date to today when adding a new job application
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        company: '',
        role: '',
        status: '',
        notes: '',
        appliedDate: today
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedData = {
      company: formData.company.trim(),
      role: formData.role.trim(),
      status: formData.status,
      notes: formData.notes.trim() || null,
      appliedDate: formData.appliedDate || null
    };
    onSave(trimmedData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{application ? 'Edit Job Application' : 'Add New Job Application'}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="company">Company *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              maxLength="200"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role/Position *</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              maxLength="200"
            />
          </div>
          <div className="form-group">
            <label htmlFor="appliedDate">Date Applied</label>
            <input
              type="date"
              id="appliedDate"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Interview">Interview</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="Final Interview">Final Interview</option>
              <option value="Offer">Offer</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="No Response">No Response</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              maxLength="2000"
              placeholder="Add any notes about the application, interview questions, or follow-up tasks..."
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
