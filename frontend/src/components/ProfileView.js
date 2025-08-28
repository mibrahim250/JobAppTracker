import React, { useState, useEffect } from 'react';
import { getCurrentUserData } from '../services/userService';

const ProfileView = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeApplications: 0,
    interviews: 0,
    offers: 0
  });

  useEffect(() => {
    if (isOpen) {
      loadUserData();
      loadUserStats();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUserData();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = () => {
    try {
      const savedApplications = localStorage.getItem('jobApplications');
      const allData = savedApplications ? JSON.parse(savedApplications) : [];
      
      // Filter applications by current user
      const userApplications = allData.filter(app => app.user_id === user?.id);
      
      const stats = {
        totalApplications: userApplications.length,
        activeApplications: userApplications.filter(app => 
          ['Applied', 'Interview', 'Follow-up'].includes(app.status)
        ).length,
        interviews: userApplications.filter(app => 
          ['Interview', 'Interview Scheduled'].includes(app.status)
        ).length,
        offers: userApplications.filter(app => 
          ['Offer', 'Accepted'].includes(app.status)
        ).length
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>Profile</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Loading profile...
            </p>
          </div>
        ) : (
          <div style={{ padding: '2rem' }}>
            {/* Profile Header */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              padding: '2rem',
              background: 'rgba(210, 105, 30, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(210, 105, 30, 0.2)'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d2691e, #cd853f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.username || 'User'} 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  getInitials(user?.username || user?.email)
                )}
              </div>
              
              <h3 style={{ color: '#d2691e', marginBottom: '0.5rem' }}>
                {user?.username || 'User'}
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
                {user?.email}
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                Member since {formatDate(user?.created_at)}
              </p>
            </div>

            {/* Statistics */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#d2691e', marginBottom: '1rem', textAlign: 'center' }}>
                Your Job Search Statistics
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '1rem' 
              }}>
                <div style={{ 
                  background: 'rgba(76, 175, 80, 0.1)', 
                  border: '1px solid rgba(76, 175, 80, 0.3)', 
                  borderRadius: '12px', 
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
                    {stats.totalApplications}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Applications
                  </div>
                </div>
                
                <div style={{ 
                  background: 'rgba(255, 193, 7, 0.1)', 
                  border: '1px solid rgba(255, 193, 7, 0.3)', 
                  borderRadius: '12px', 
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                    {stats.activeApplications}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Active Applications
                  </div>
                </div>
                
                <div style={{ 
                  background: 'rgba(33, 150, 243, 0.1)', 
                  border: '1px solid rgba(33, 150, 243, 0.3)', 
                  borderRadius: '12px', 
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
                    {stats.interviews}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Interviews
                  </div>
                </div>
                
                <div style={{ 
                  background: 'rgba(156, 39, 176, 0.1)', 
                  border: '1px solid rgba(156, 39, 176, 0.3)', 
                  borderRadius: '12px', 
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>
                    {stats.offers}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Offers
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: '#d2691e', marginBottom: '1rem' }}>
                Account Information
              </h4>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '12px', 
                padding: '1rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Username:</span>
                  <span style={{ color: 'white', fontWeight: '500' }}>
                    {user?.username || 'Not set'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Email:</span>
                  <span style={{ color: 'white', fontWeight: '500' }}>
                    {user?.email}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Member Since:</span>
                  <span style={{ color: 'white', fontWeight: '500' }}>
                    {formatDate(user?.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 style={{ color: '#d2691e', marginBottom: '1rem' }}>
                Quick Actions
              </h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    // This would open the add application modal
                    onClose();
                    // You could add a callback to open the add modal
                  }}
                  style={{ flex: '1', minWidth: '150px' }}
                >
                  <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                  Add Application
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    // This would open the data visualization
                    onClose();
                    // You could add a callback to open the data viz
                  }}
                  style={{ flex: '1', minWidth: '150px' }}
                >
                  <i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions" style={{ padding: '0 2rem 2rem 2rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
