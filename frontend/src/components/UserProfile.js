import React, { useState, useEffect } from 'react';
import { getCurrentUserData } from '../services/userService';
import ProfileView from './ProfileView';

const UserProfile = ({ onOpenSettings, onLogout }) => {
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getCurrentUserData();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOpenSettings = () => {
    onOpenSettings();
    setIsDropdownOpen(false);
  };

  const getInitials = (username) => {
    if (!username) return '?';
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="user-profile">
        <div className="user-avatar loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <button 
        className="user-avatar-btn"
        onClick={toggleDropdown}
        title={user?.username || user?.email || 'User'}
      >
        <div className="user-avatar">
          {user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.username || 'User'} 
              className="avatar-image"
            />
          ) : (
            <div className="avatar-initials">
              {getInitials(user?.username || user?.email)}
            </div>
          )}
        </div>
      </button>
      
      {isDropdownOpen && (
        <>
          <div className="user-dropdown">
            <div className="user-info">
              <div className="user-name">
                {user?.username || 'User'}
              </div>
              <div className="user-email">
                {user?.email}
              </div>
            </div>
            
            <div className="dropdown-divider"></div>
            
            <div className="dropdown-actions">
              <button 
                className="dropdown-action"
                onClick={handleOpenSettings}
              >
                <i className="fas fa-cog"></i>
                Settings
              </button>
              
                             <button 
                 className="dropdown-action"
                 onClick={() => {
                   setIsProfileViewOpen(true);
                   setIsDropdownOpen(false);
                 }}
               >
                 <i className="fas fa-user"></i>
                 View Profile
               </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-action logout"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
          
          {/* Overlay to close dropdown */}
          <div 
            className="dropdown-overlay" 
            onClick={() => setIsDropdownOpen(false)}
          >          </div>
        </>
      )}

      <ProfileView
        isOpen={isProfileViewOpen}
        onClose={() => setIsProfileViewOpen(false)}
      />
    </div>
  );
};

export default UserProfile;
