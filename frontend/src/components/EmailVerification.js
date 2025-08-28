import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { sendEmailVerification, checkEmailVerification } from '../services/userService';

const EmailVerification = ({ email, onVerificationComplete, onClose }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check verification status when component mounts
    checkVerificationStatus();
  }, [email]);

  const checkVerificationStatus = async () => {
    setIsChecking(true);
    try {
      const verified = await checkEmailVerification();
      setIsVerified(verified);
      if (verified) {
        setMessage('Email verified successfully!');
        setTimeout(() => {
          onVerificationComplete();
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await sendEmailVerification(email);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Error sending verification email: ' + error.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = () => {
    checkVerificationStatus();
  };

  if (isVerified) {
    return (
      <div className="modal show">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Email Verified!</h2>
            <span className="close" onClick={onClose}>&times;</span>
          </div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ 
              background: 'rgba(76, 175, 80, 0.1)', 
              border: '1px solid #4caf50', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ color: '#4caf50', marginBottom: '10px' }}>✅ Email Verified Successfully</h3>
              <p style={{ color: 'white', marginBottom: '15px' }}>
                Your email <strong>{email}</strong> has been verified.
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                You can now access all features of the application.
              </p>
            </div>
            <button
              onClick={onVerificationComplete}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Continue to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Email Verification Required</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ 
            background: 'rgba(255, 193, 7, 0.1)', 
            border: '1px solid #ffc107', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '20px' 
          }}>
            <h3 style={{ color: '#ffc107', marginBottom: '10px' }}>📧 Verify Your Email Address</h3>
            <p style={{ color: 'white', marginBottom: '15px' }}>
              We've sent a verification link to <strong>{email}</strong>
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '20px' }}>
              Please check your email and click the verification link to continue.
            </p>
            
            {message && (
              <div style={{
                background: message.includes('Error') ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                border: message.includes('Error') ? '1px solid #f44336' : '1px solid #4caf50',
                borderRadius: '5px',
                padding: '10px',
                marginBottom: '15px',
                color: message.includes('Error') ? '#f44336' : '#4caf50'
              }}>
                {message}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleRefresh}
                disabled={isChecking}
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: isChecking ? 'not-allowed' : 'pointer',
                  opacity: isChecking ? 0.6 : 1
                }}
              >
                {isChecking ? 'Checking...' : 'Check Verification'}
              </button>
              
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                style={{
                  background: '#d2691e',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: isResending ? 'not-allowed' : 'pointer',
                  opacity: isResending ? 0.6 : 1
                }}
              >
                {isResending ? 'Sending...' : 'Resend Email'}
              </button>
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '10px' }}>
              Didn't receive the email?
            </p>
            <ul style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '12px', 
              textAlign: 'left',
              display: 'inline-block',
              margin: '0 auto'
            }}>
              <li>Check your spam/junk folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
