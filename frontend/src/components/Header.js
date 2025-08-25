import React from 'react';
import Settings from './Settings';

const Header = ({ currentTheme, onThemeChange, user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1><i className="fas fa-briefcase"></i> Job Application Tracker</h1>
          <p>Keep track of your job applications and never miss a follow-up</p>
        </div>
        <div className="header-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                Welcome, {user.username || user.email}!
              </span>
              <button
                onClick={onLogout}
                style={{
                  background: 'rgba(220, 20, 60, 0.1)',
                  border: '1px solid #dc143c',
                  color: '#dc143c',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Logout
              </button>
            </div>
            <Settings 
              currentTheme={currentTheme}
              onThemeChange={onThemeChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
