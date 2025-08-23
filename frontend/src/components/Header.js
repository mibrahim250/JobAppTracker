import React from 'react';
import Settings from './Settings';

const Header = ({ currentTheme, onThemeChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1><i className="fas fa-briefcase"></i> Job Application Tracker</h1>
          <p>Keep track of your job applications and never miss a follow-up</p>
        </div>
        <div className="header-right">
          <Settings 
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
