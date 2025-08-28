import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { getCurrentUserData, updateUserProfile, checkEmailVerification } from '../services/userService';
import EmailVerification from './EmailVerification';

const Settings = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: ''
  });
  
  // Password reset state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    theme: 'default',
    autoSave: true
  });
  
  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUserData();
      if (userData) {
        setUser(userData);
        setProfileForm({
          username: userData.username || '',
          email: userData.email || ''
        });
        
        // Check email verification status
        const verified = await checkEmailVerification();
        setEmailVerified(verified);
        
        // Load saved preferences
        const savedPrefs = localStorage.getItem('userPreferences');
        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        }
      }
    } catch (error) {
      showMessage('Error loading user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile(profileForm);
      showMessage('Profile updated successfully!', 'success');
      await loadUserData(); // Reload user data
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      
      showMessage('Password updated successfully!', 'success');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    showMessage('Preferences saved!', 'success');
  };

  const handleAccountDeletion = async () => {
    if (!deletePassword) {
      showMessage('Please enter your password to confirm deletion', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Verify password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword
      });
      
      if (signInError) {
        showMessage('Incorrect password', 'error');
        return;
      }
      
      // Delete user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        // If admin delete fails, try user deletion
        const { error: userError } = await supabase.auth.updateUser({
          data: { deleted: true }
        });
        
        if (userError) throw userError;
      }
      
      showMessage('Account deleted successfully', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      showMessage('Error deleting account: ' + error.message, 'error');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeletePassword('');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
        <div className="modal-header">
          <h2>Settings</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>

        {message.text && (
          <div className={`message ${message.type}`} style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '8px',
            background: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`,
            color: message.type === 'success' ? '#4caf50' : '#f44336'
          }}>
            {message.text}
          </div>
        )}

        <div className="tabs" style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {['profile', 'password', 'preferences', 'account'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab ? '#d2691e' : 'rgba(255, 255, 255, 0.7)',
                padding: '12px 20px',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid #d2691e' : 'none',
                textTransform: 'capitalize',
                fontWeight: activeTab === tab ? 'bold' : 'normal'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                    placeholder="Enter username"
                    maxLength="50"
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    placeholder="Enter email"
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                    <small style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Email cannot be changed for security reasons
                    </small>
                    {emailVerified ? (
                      <span style={{ color: '#4caf50', fontSize: '12px' }}>
                        <i className="fas fa-check-circle"></i> Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowEmailVerification(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ffc107',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <i className="fas fa-exclamation-triangle"></i> Verify Email
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    Update Profile
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordReset}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    minLength="6"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                    />
                    Email Notifications
                  </label>
                </div>
                
                <div className="form-group">
                  <label>Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  >
                    <option value="default">Default</option>
                    <option value="dark">Dark</option>
                    <option value="sakura">Sakura</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={preferences.autoSave}
                      onChange={(e) => setPreferences({...preferences, autoSave: e.target.checked})}
                    />
                    Auto-save applications
                  </label>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handlePreferencesUpdate}
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <div style={{ 
                  background: 'rgba(244, 67, 54, 0.1)', 
                  border: '1px solid #f44336', 
                  borderRadius: '8px', 
                  padding: '20px', 
                  marginBottom: '20px' 
                }}>
                  <h3 style={{ color: '#f44336', marginTop: 0 }}>Danger Zone</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none'
                      }}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div>
                      <div className="form-group">
                        <label>Enter your password to confirm:</label>
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Enter password"
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn"
                          style={{
                            background: '#f44336',
                            color: 'white',
                            border: 'none'
                          }}
                          onClick={handleAccountDeletion}
                          disabled={loading}
                        >
                          {loading ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <EmailVerification
          isOpen={showEmailVerification}
          onClose={() => setShowEmailVerification(false)}
          onVerified={() => {
            setEmailVerified(true);
            setShowEmailVerification(false);
            showMessage('Email verified successfully!', 'success');
          }}
        />
      </div>
    </div>
  );
};

export default Settings;
