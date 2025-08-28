import React, { useState } from 'react';
import { supabase } from '../config/supabase';

const PasswordReset = ({ isOpen, onClose, mode = 'request' }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [resetSent, setResetSent] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showMessage('Please enter your email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      setResetSent(true);
      showMessage('Password reset email sent! Check your inbox.', 'success');
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      showMessage('Please fill in all fields', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }
    
    if (newPassword.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      showMessage('Password updated successfully!', 'success');
      setTimeout(() => {
        onClose();
        // Redirect to login or dashboard
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleClose = () => {
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setResetSent(false);
    setMessage({ text: '', type: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>{mode === 'request' ? 'Reset Password' : 'Set New Password'}</h2>
          <span className="close" onClick={handleClose}>&times;</span>
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

        {mode === 'request' ? (
          <>
            {!resetSent ? (
              <form onSubmit={handleRequestReset}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div style={{ 
                  background: 'rgba(255, 193, 7, 0.1)', 
                  border: '1px solid #ffc107', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  marginBottom: '20px',
                  color: '#ffc107'
                }}>
                  <i className="fas fa-info-circle"></i>
                  We'll send you a link to reset your password.
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  fontSize: '48px', 
                  color: '#4caf50', 
                  marginBottom: '20px' 
                }}>
                  <i className="fas fa-envelope"></i>
                </div>
                <h3 style={{ color: '#4caf50', marginBottom: '10px' }}>
                  Check Your Email
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => setResetSent(false)}
                  >
                    Try Again
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength="6"
              />
            </div>
            
            <div style={{ 
              background: 'rgba(76, 175, 80, 0.1)', 
              border: '1px solid #4caf50', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '20px',
              color: '#4caf50'
            }}>
              <i className="fas fa-shield-alt"></i>
              Password must be at least 6 characters long.
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
