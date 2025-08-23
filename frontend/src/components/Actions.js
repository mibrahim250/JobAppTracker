import React from 'react';

const Actions = ({ onAddApplication, onShowDataViz, searchTerm, onSearchChange }) => {
  return (
    <div className="actions">
      <div className="action-buttons">
        <button 
          id="addJobBtn" 
          className="btn btn-primary"
          onClick={onAddApplication}
        >
          <i className="fas fa-plus"></i> Add New Application
        </button>
        <button 
          id="dataVizBtn" 
          className="btn btn-secondary"
          onClick={onShowDataViz}
        >
          <i className="fas fa-chart-bar"></i> Data Visualization
        </button>
      </div>
      <div className="search-box">
        <input
          type="text"
          id="searchInput"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <i className="fas fa-search"></i>
      </div>
    </div>
  );
};

export default Actions;
