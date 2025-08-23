import React from 'react';

const JobCard = ({ application, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      'Applied': 'applied',
      'Under Review': 'review',
      'Phone Screen': 'phone',
      'Interview': 'interview',
      'Technical Interview': 'technical',
      'Final Interview': 'final',
      'Offer': 'offer',
      'Accepted': 'accepted',
      'Rejected': 'rejected',
      'No Response': 'no-response',
      'Withdrawn': 'withdrawn'
    };
    return statusMap[status] || 'applied';
  };

  return (
    <div className="job-card" data-id={application.id}>
      <div className="job-card-header">
        <div className="job-card-title">
          <h3>{application.role}</h3>
          <div className="company">{application.company}</div>
        </div>
        <div className="job-card-top-right">
          <span className={`status-badge status-${getStatusClass(application.status)}`}>
            {application.status}
          </span>
          <div className="job-card-actions">
            <button 
              className="action-btn edit" 
              onClick={onEdit}
              title="Edit application"
            >
              <i className="fas fa-edit"></i> Edit
            </button>
            <button 
              className="action-btn delete" 
              onClick={onDelete}
              title="Delete application"
            >
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
      {application.notes && (
        <div className="notes-section">
          <span className="notes-label">
            <i className="fas fa-sticky-note"></i> Notes:
          </span>
          <div className="notes-text">{application.notes}</div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
