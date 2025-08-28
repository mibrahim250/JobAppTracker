import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const EmailVerification = ({ isOpen, onClose, onVerified }) => {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [checkingStatus, setCheckingStatus] = useState(false);

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
        // Check if email is verified in Supabase Auth
        setIsVerified(!!user.email_confirmed_at);
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
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) throw error;
      
      showMessage('Verification email sent! Check your inbox and spam folder.', 'success');
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setCheckingStatus(true);
      
      // Refresh the user session to get updated verification status
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (data.user?.email_confirmed_at) {
        setIsVerified(true);
        showMessage('Email verified successfully!', 'success');
        
        // Update our users table to reflect verification
        await supabase
          .from('users')
          .update({ email_verified: true })
          .eq('id', data.user.id);
        
        setTimeout(() => {
          onVerified();
          onClose();
        }, 2000);
      } else {
        showMessage('Email not yet verified. Please check your email and click the verification link.', 'info');
      }
    } catch (error) {
      showMessage('Error checking verification status: ' + error.message, 'error');
    } finally {
      setCheckingStatus(false);
    }
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
            background: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 
                       message.type === 'error' ? 'rgba(244, 67, 54, 0.1)' :
                       'rgba(33, 150, 243, 0.1)',
            border: `1px solid ${message.type === 'success' ? '#4caf50' : 
                                message.type === 'error' ? '#f44336' : '#2196f3'}`,
            color: message.type === 'success' ? '#4caf50' : 
                   message.type === 'error' ? '#f44336' : '#2196f3'
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
                  Step 2: Check Verification Status
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '15px' }}>
                  After clicking the verification link in your email, click the button below to check your verification status.
                </p>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={loadUserData}
                    disabled={checkingStatus}
                  >
                    Refresh Status
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleCheckVerification}
                    disabled={checkingStatus}
                  >
                    {checkingStatus ? 'Checking...' : 'Check Verification'}
                  </button>
                </div>
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
                  <strong> How Email Verification Works</strong>
                </div>
                <ol style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: '14px', 
                  margin: 0, 
                  paddingLeft: '20px' 
                }}>
                  <li>Click "Send Verification Email" to receive a verification link</li>
                  <li>Check your email (including spam/junk folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>Return to this page and click "Check Verification"</li>
                  <li>Your email will be marked as verified automatically</li>
                </ol>
              </div>

              <div style={{ 
                background: 'rgba(255, 152, 0, 0.1)', 
                border: '1px solid #ff9800', 
                borderRadius: '8px', 
                padding: '15px', 
                marginTop: '15px' 
              }}>
                <div style={{ color: '#ff9800', marginBottom: '10px' }}>
                  <i className="fas fa-exclamation-triangle"></i>
                  <strong> Troubleshooting</strong>
                </div>
                <ul style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: '14px', 
                  margin: 0, 
                  paddingLeft: '20px' 
                }}>
                  <li>Check your spam/junk folder for the verification email</li>
                  <li>Make sure you entered the correct email address</li>
                  <li>Click "Send Verification Email" again if needed</li>
                  <li>Wait a few minutes for the email to arrive</li>
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
