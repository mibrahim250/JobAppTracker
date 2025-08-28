import React, { useState } from 'react';
import Settings from './Settings';
import UserProfile from './UserProfile';

const Header = ({ currentTheme, onThemeChange, onLogout }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1><i className="fas fa-briefcase"></i> Job Application Tracker</h1>
            <p>Keep track of your job applications and never miss a follow-up</p>
          </div>
          <div className="header-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <UserProfile 
                onOpenSettings={handleOpenSettings}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      </header>

      <Settings 
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
      />
    </>
  );
};

export default Header;
