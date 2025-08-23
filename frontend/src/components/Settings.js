import React, { useState } from 'react';

const Settings = ({ currentTheme, onThemeChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleThemeChange = (theme) => {
    onThemeChange(theme);
    setIsDropdownOpen(false);
  };

  const handleDataVisualization = () => {
    // Placeholder for data visualization feature
    alert('Data Visualization feature coming soon!');
  };

  return (
    <div className="settings-container">
      <button 
        className="settings-btn"
        onClick={toggleDropdown}
        title="Settings"
      >
        <i className="fas fa-cog"></i>
      </button>
      
      {isDropdownOpen && (
        <div className="settings-dropdown">
          <div className="settings-item">
            <label className="settings-label">
              <i className="fas fa-palette"></i>
              Theme
            </label>
            <div className="theme-options">
              <button 
                className={`theme-btn ${currentTheme === 'default' ? 'active' : ''}`}
                onClick={() => handleThemeChange('default')}
                title="Default Orange Theme"
              >
                <div className="theme-preview default-theme"></div>
              </button>
              <button 
                className={`theme-btn ${currentTheme === 'sakura' ? 'active' : ''}`}
                onClick={() => handleThemeChange('sakura')}
                title="Japanese Sakura Theme"
              >
                <div className="theme-preview sakura-theme"></div>
              </button>
            </div>
          </div>
          
          <div className="settings-item">
            <button 
              className="settings-option-btn"
              onClick={handleDataVisualization}
            >
              <i className="fas fa-chart-bar"></i>
              Data Visualization
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div className="settings-overlay" onClick={toggleDropdown}></div>
      )}
    </div>
  );
};

export default Settings;
