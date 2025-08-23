import React, { useState } from 'react';
import JobCard from './JobCard';

const ApplicationsList = ({ applications, onEdit, onDelete }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterApplications = (filter) => {
    setActiveFilter(filter);
  };

  const getFilteredApplications = () => {
    if (activeFilter === 'all') return applications;
    return applications.filter(app => {
      const status = app.status.toLowerCase();
      switch (activeFilter) {
        case 'applied':
          return status === 'applied';
        case 'pending':
          return ['under review', 'phone screen', 'interview', 'technical interview', 'final interview', 'no response'].includes(status);
        case 'interview':
          return ['phone screen', 'interview', 'technical interview', 'final interview'].includes(status);
        case 'rejected':
          return ['rejected', 'withdrawn', 'no response'].includes(status);
        default:
          return true;
      }
    });
  };

  const filteredApps = getFilteredApplications();

  if (applications.length === 0) {
    return (
      <div className="applications-container">
        <div className="empty-state">
          <i className="fas fa-briefcase"></i>
          <h3>No job applications yet</h3>
          <p>Click "Add New Application" to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h2 className="applications-title">
          <i className="fas fa-list-alt"></i> Recent Applications
        </h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => filterApplications('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'applied' ? 'active' : ''}`}
            onClick={() => filterApplications('applied')}
          >
            Applied
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
            onClick={() => filterApplications('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'interview' ? 'active' : ''}`}
            onClick={() => filterApplications('interview')}
          >
            Interview
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => filterApplications('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>
      <div className="applications-list">
        {filteredApps.map(app => (
          <JobCard
            key={app.id}
            application={app}
            onEdit={() => onEdit(app)}
            onDelete={() => onDelete(app)}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicationsList;
