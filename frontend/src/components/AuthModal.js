import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/userService';
import PasswordReset from './PasswordReset';
import EmailVerification from './EmailVerification';

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
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

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
        await loginUser(formData.email, formData.password);
        onAuthSuccess();
        onClose();
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
        
        // Show email verification after successful registration
        setRegisteredUser(result);
        setShowEmailVerification(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowPasswordReset(true);
  };

  const handleClosePasswordReset = () => {
    setShowPasswordReset(false);
  };

  const handleEmailVerified = () => {
    setShowEmailVerification(false);
    onAuthSuccess();
    onClose();
  };

  const handleCloseEmailVerification = () => {
    setShowEmailVerification(false);
    setRegisteredUser(null);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-container">
        <div className="logo"></div>
        
        <h1>Welcome</h1>
        <p className="subtitle">Your autumn journey begins here</p>
        
        <div className="tab-container">
          <div 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </div>
          <div 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </div>
        </div>
        
        {/* Sign In Form */}
        <div className={`form-section ${isLogin ? 'active' : ''}`} id="signin-form">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="signin-email">Email Address</label>
              <input
                type="email"
                id="signin-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signin-password">Password</label>
              <input
                type="password"
                id="signin-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
          
          <div className="forgot-password">
            <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>
          </div>
        </div>
        
        {/* Sign Up Form */}
        <div className={`form-section ${!isLogin ? 'active' : ''}`} id="signup-form">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                type="text"
                id="signup-name"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Create a password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Confirm your password"
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>
        </div>
        
        <div className="divider">
          <span>or continue with</span>
        </div>
        
        <div className="social-buttons">
          <button className="social-btn">
            <span style={{color: '#ea4335'}}>●</span> Google
          </button>
          <button className="social-btn">
            <span style={{color: '#000'}}>🍎</span> Apple
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <PasswordReset onClose={handleClosePasswordReset} />
      )}

      {/* Email Verification Modal */}
      {showEmailVerification && registeredUser && (
        <EmailVerification
          user={registeredUser}
          onVerified={handleEmailVerified}
          onClose={handleCloseEmailVerification}
        />
      )}
    </div>
  );
};

export default AuthModal;
