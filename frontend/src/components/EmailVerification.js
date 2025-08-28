import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { sendEmailVerification, checkEmailVerification } from '../services/userService';

const EmailVerification = ({ isOpen, onClose, onVerified }) => {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [verificationToken, setVerificationToken] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const verified = await checkEmailVerification();
        setIsVerified(verified);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSendVerification = async () => {
    if (!user?.email) {
      showMessage('No email address found', 'error');
      return;
    }

    try {
      setLoading(true);
      await sendEmailVerification(user.email);
      showMessage('Verification email sent! Check your inbox.', 'success');
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    
    if (!verificationToken.trim()) {
      showMessage('Please enter the verification token', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Try to verify the token
      const { data, error } = await supabase.auth.verifyOtp({
        token: verificationToken,
        type: 'signup'
      });
      
      if (error) throw error;
      
      setIsVerified(true);
      showMessage('Email verified successfully!', 'success');
      
      setTimeout(() => {
        onVerified();
        onClose();
      }, 2000);
    } catch (error) {
      showMessage('Invalid verification token. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshVerification = async () => {
    await loadUserData();
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Email Verification</h2>
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

        <div style={{ padding: '2rem' }}>
          {isVerified ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                color: '#4caf50', 
                marginBottom: '20px' 
              }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 style={{ color: '#4caf50', marginBottom: '15px' }}>
                Email Verified!
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
                Your email address <strong>{user?.email}</strong> has been successfully verified.
                You now have access to all features.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onVerified();
                  onClose();
                }}
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <div style={{ 
                background: 'rgba(255, 193, 7, 0.1)', 
                border: '1px solid #ffc107', 
                borderRadius: '8px', 
                padding: '15px', 
                marginBottom: '20px' 
              }}>
                <div style={{ color: '#ffc107', marginBottom: '10px' }}>
                  <i className="fas fa-info-circle"></i>
                  <strong> Email Verification Required</strong>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: 0 }}>
                  Please verify your email address <strong>{user?.email}</strong> to access all features 
                  and ensure your job applications are properly saved.
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#d2691e', marginBottom: '10px' }}>
                  Step 1: Send Verification Email
                </h4>
                <button 
                  className="btn btn-primary"
                  onClick={handleSendVerification}
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Sending...' : 'Send Verification Email'}
                </button>
              </div>

              <div style={{ 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                paddingTop: '20px' 
              }}>
                <h4 style={{ color: '#d2691e', marginBottom: '10px' }}>
                  Step 2: Enter Verification Token
                </h4>
                <form onSubmit={handleVerifyToken}>
                  <div className="form-group">
                    <label>Verification Token</label>
                    <input
                      type="text"
                      value={verificationToken}
                      onChange={(e) => setVerificationToken(e.target.value)}
                      placeholder="Enter the token from your email"
                      required
                    />
                    <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                      Check your email for the verification token
                    </small>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleRefreshVerification}
                      disabled={loading}
                    >
                      Refresh Status
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading}
                    >
                      {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                  </div>
                </form>
              </div>

              <div style={{ 
                background: 'rgba(33, 150, 243, 0.1)', 
                border: '1px solid #2196f3', 
                borderRadius: '8px', 
                padding: '15px', 
                marginTop: '20px' 
              }}>
                <div style={{ color: '#2196f3', marginBottom: '10px' }}>
                  <i className="fas fa-lightbulb"></i>
                  <strong> Need Help?</strong>
                </div>
                <ul style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: '14px', 
                  margin: 0, 
                  paddingLeft: '20px' 
                }}>
                  <li>Check your spam/junk folder</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Click "Send Verification Email" again if needed</li>
                  <li>Contact support if you continue having issues</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="form-actions" style={{ padding: '0 2rem 2rem 2rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
