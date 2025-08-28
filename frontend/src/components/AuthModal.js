import React, { useState } from 'react';
import { registerUser, loginUser, sendEmailVerification } from '../services/userService';
import PasswordReset from './PasswordReset';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all fields');
        }
        console.log('Attempting login for:', formData.email);
        const user = await loginUser(formData.email, formData.password);
        
        // Check if email is verified
        if (user && !user.email_confirmed_at) {
          setShowVerificationMessage(true);
          setVerificationEmail(formData.email);
          setError('Please verify your email address before logging in. Check your inbox for a verification link.');
          // Don't return here - let the user see the verification message
        } else {
          onAuthSuccess();
          onClose();
        }
      } else {
        // Register
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
          throw new Error('Please fill in all fields');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        console.log('Attempting registration for:', formData.email, 'username:', formData.username);
        const result = await registerUser(formData.username, formData.email, formData.password);
        console.log('Registration result:', result);
        
        // Show verification message
        setShowVerificationMessage(true);
        setVerificationEmail(formData.email);
        setError('Account created! Please check your email for verification link before logging in.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      await sendEmailVerification(verificationEmail);
      setError('Verification email sent! Please check your inbox.');
    } catch (error) {
      setError('Error sending verification email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setShowVerificationMessage(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleForgotPassword = () => {
    setShowPasswordReset(true);
  };

  const handleClosePasswordReset = () => {
    setShowPasswordReset(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        
        {showVerificationMessage ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ 
              background: 'rgba(255, 193, 7, 0.1)', 
              border: '1px solid #ffc107', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ color: '#ffc107', marginBottom: '10px' }}>Email Verification Required</h3>
              <p style={{ color: 'white', marginBottom: '15px' }}>
                We've sent a verification link to <strong>{verificationEmail}</strong>
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '20px' }}>
                Please check your email and click the verification link before logging in.
              </p>
              <button
                onClick={handleResendVerification}
                disabled={loading}
                style={{
                  background: '#d2691e',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginRight: '10px'
                }}
              >
                {loading ? 'Sending...' : 'Resend Verification'}
              </button>
              <button
                onClick={() => {
                  setShowVerificationMessage(false);
                  setError('');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message" style={{
                background: 'rgba(220, 20, 60, 0.1)',
                border: '1px solid #dc143c',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#dc143c'
              }}>
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  maxLength="50"
                  placeholder="Enter your username"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Enter your password"
              />
              {isLogin && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d2691e',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginTop: '5px'
                  }}
                >
                  Forgot Password?
                </button>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </div>
          </form>
        )}

        {!showVerificationMessage && (
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '10px' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#d2691e',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </div>
        )}

        <PasswordReset
          isOpen={showPasswordReset}
          onClose={handleClosePasswordReset}
          mode="request"
        />
      </div>
    </div>
  );
};

export default AuthModal;
