import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

// Get Supabase configuration for validation
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

const LandingPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 25;
      if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength += 25;
      if (value.match(/[0-9]/)) strength += 25;
      if (value.match(/[^a-zA-Z0-9]/)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if Supabase is properly configured
      if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
        throw new Error('Supabase is not configured. Please set up your environment variables.');
      }

      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        onAuthSuccess();
      } else {
        // Sign up
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName
            }
          }
        });

        if (error) throw error;
        
        // Create user profile in our users table
        if (data.user) {
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                username: formData.fullName,
                email: formData.email
              }
            ]);

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        onAuthSuccess();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setPasswordStrength(0);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'linear-gradient(90deg, #ff4757, #ff6b35)';
    if (passwordStrength < 75) return 'linear-gradient(90deg, #ff8c42, #ffd662)';
    return 'linear-gradient(90deg, #5cb85c, #4caf50)';
  };

  return (
    <div className="landing-page">
      <div className="leaves-bg">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="leaf" style={{ left: `${i * 10}%` }}></div>
        ))}
      </div>

      <div className="container">
        <div className="logo">
          <div className="logo-icon">🍂</div>
          <h1>Job Application Tracker</h1>
          <p className="subtitle">Track your career journey with style</p>
        </div>

        <div className="form-toggle">
          <button 
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {(supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') && (
          <div className="setup-message">
            <h3>🚀 Setup Required</h3>
            <p>To use this app, you need to configure Supabase:</p>
            <ol>
              <li>Create a Supabase project</li>
              <li>Set up the database tables (see SUPABASE_SETUP_INSTRUCTIONS.md)</li>
              <li>Add your Supabase URL and API key to environment variables</li>
            </ol>
            <p><strong>For now, you can view the beautiful landing page! 🍂</strong></p>
          </div>
        )}

        {/* Login Form */}
        <form className={`login-form ${isLogin ? 'active' : ''}`} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="loginEmail">Email Address</label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              id="loginPassword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Signup Form */}
        <form className={`signup-form ${!isLogin ? 'active' : ''}`} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signupName">Full Name</label>
            <input
              type="text"
              id="signupName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signupEmail">Email Address</label>
            <input
              type="email"
              id="signupEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signupPassword">Password</label>
            <input
              type="password"
              id="signupPassword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            <div className="password-strength">
              <div 
                className="strength-bar" 
                style={{ 
                  width: `${passwordStrength}%`,
                  background: getStrengthColor()
                }}
              ></div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          <button 
            className="social-btn" 
            onClick={() => {
              if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
                setError('Supabase is not configured. Please set up your environment variables.');
              } else {
                supabase.auth.signInWithOAuth({ provider: 'google' });
              }
            }}
          >
            <span>🍁</span> Google
          </button>
          <button 
            className="social-btn" 
            onClick={() => {
              if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
                setError('Supabase is not configured. Please set up your environment variables.');
              } else {
                supabase.auth.signInWithOAuth({ provider: 'github' });
              }
            }}
          >
            <span>🌰</span> GitHub
          </button>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #2a1810 0%, #3d2817 25%, #4a2f1c 50%, #3d2817 75%, #2a1810 100%);
        }

        .leaves-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .leaf {
          position: absolute;
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #ff6b35, #d4663a);
          border-radius: 0 100% 0 100%;
          animation: fall 10s linear infinite;
          opacity: 0.7;
        }

        .leaf:nth-child(2) { animation-delay: -2s; background: linear-gradient(45deg, #ff8c42, #d4663a); }
        .leaf:nth-child(3) { animation-delay: -4s; background: linear-gradient(45deg, #ffd662, #cc9900); }
        .leaf:nth-child(4) { animation-delay: -6s; background: linear-gradient(45deg, #ff6b35, #cc4400); }
        .leaf:nth-child(5) { animation-delay: -8s; background: linear-gradient(45deg, #d4663a, #aa3300); }
        .leaf:nth-child(6) { animation-delay: -1s; background: linear-gradient(45deg, #ff8c42, #dd5500); }
        .leaf:nth-child(7) { animation-delay: -3s; background: linear-gradient(45deg, #ffd662, #bb8800); }
        .leaf:nth-child(8) { animation-delay: -5s; background: linear-gradient(45deg, #ff6b35, #cc3300); }
        .leaf:nth-child(9) { animation-delay: -7s; background: linear-gradient(45deg, #d4663a, #992200); }

        @keyframes fall {
          0% {
            top: -50px;
            transform: rotateZ(0deg);
          }
          50% {
            transform: rotateZ(180deg);
          }
          100% {
            top: 100vh;
            transform: rotateZ(360deg);
          }
        }

        .container {
          background: rgba(42, 42, 42, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 60px 50px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 107, 53, 0.1);
          position: relative;
          z-index: 2;
          animation: slideIn 0.8s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          border-radius: 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
          animation: pulse 2s infinite;
          font-size: 28px;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        h1 {
          color: #ffffff;
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #cccccc;
          text-align: center;
          margin-bottom: 40px;
          font-size: 16px;
        }

        .form-toggle {
          display: flex;
          background: rgba(60, 60, 60, 0.5);
          border-radius: 12px;
          margin-bottom: 30px;
          padding: 4px;
        }

        .toggle-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          background: transparent;
          color: #cccccc;
          cursor: pointer;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .toggle-btn.active {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
        }

        .error-message {
          background: rgba(220, 20, 60, 0.1);
          border: 1px solid #dc143c;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: #dc143c;
          text-align: center;
        }

        .form-group {
          margin-bottom: 25px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #e0e0e0;
          font-weight: 500;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 15px 18px;
          border: 2px solid rgba(80, 80, 80, 0.5);
          border-radius: 12px;
          background: rgba(60, 60, 60, 0.3);
          color: #ffffff;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: #ff6b35;
          background: rgba(60, 60, 60, 0.5);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        input::placeholder {
          color: #999999;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
          margin-bottom: 20px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(255, 107, 53, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .divider {
          text-align: center;
          margin: 30px 0;
          position: relative;
          color: #888888;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(136, 136, 136, 0.3);
          z-index: 1;
        }

        .divider span {
          background: rgba(42, 42, 42, 0.95);
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }

        .social-login {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .social-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid rgba(80, 80, 80, 0.5);
          border-radius: 12px;
          background: transparent;
          color: #cccccc;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .social-btn:hover {
          border-color: #ff6b35;
          background: rgba(255, 107, 53, 0.1);
        }

        .signup-form {
          display: none;
        }

        .signup-form.active {
          display: block;
        }

        .login-form.active {
          display: block;
        }

        .password-strength {
          margin-top: 5px;
          height: 4px;
          background: rgba(80, 80, 80, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }

                 .strength-bar {
           height: 100%;
           width: 0%;
           transition: all 0.3s ease;
           border-radius: 2px;
         }

         .setup-message {
           background: rgba(255, 193, 7, 0.1);
           border: 1px solid #ffc107;
           border-radius: 12px;
           padding: 20px;
           margin-bottom: 20px;
           color: #ffc107;
         }

         .setup-message h3 {
           color: #ffc107;
           margin-bottom: 10px;
           font-size: 18px;
         }

         .setup-message p {
           color: rgba(255, 193, 7, 0.8);
           margin-bottom: 10px;
           font-size: 14px;
         }

         .setup-message ol {
           margin: 10px 0;
           padding-left: 20px;
         }

         .setup-message li {
           color: rgba(255, 193, 7, 0.8);
           margin-bottom: 5px;
           font-size: 14px;
         }

         .setup-message strong {
           color: #ffc107;
         }
      `}</style>
    </div>
  );
};

export default LandingPage;
