import React, { useState } from 'react';

const UserOnboarding = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    notifications: true,
    theme: 'default',
    autoSave: true
  });

  const steps = [
    {
      title: "Welcome to Job Application Tracker!",
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#d2691e', marginBottom: '20px' }}>
            <i className="fas fa-briefcase"></i>
          </div>
          <h3 style={{ marginBottom: '15px', color: '#d2691e' }}>
            Let's get you started
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            Track your job applications, monitor your progress, and never miss a follow-up. 
            This quick setup will help you personalize your experience.
          </p>
        </div>
      )
    },
    {
      title: "Choose Your Theme",
      content: (
        <div>
          <p style={{ marginBottom: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Select a theme that matches your style:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            {[
              { id: 'default', name: 'Default', color: '#d2691e', icon: '🍂' },
              { id: 'dark', name: 'Dark', color: '#2c2c2c', icon: '🌙' },
              { id: 'sakura', name: 'Sakura', color: '#ff69b4', icon: '🌸' }
            ].map(theme => (
              <button
                key={theme.id}
                onClick={() => setUserPreferences({...userPreferences, theme: theme.id})}
                style={{
                  background: userPreferences.theme === theme.id 
                    ? `linear-gradient(135deg, ${theme.color}, ${theme.color}dd)` 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${userPreferences.theme === theme.id ? theme.color : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  fontSize: '24px'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{theme.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{theme.name}</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Notification Preferences",
      content: (
        <div>
          <p style={{ marginBottom: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Choose how you'd like to stay updated:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={userPreferences.notifications}
                onChange={(e) => setUserPreferences({...userPreferences, notifications: e.target.checked})}
                style={{ width: '20px', height: '20px' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  <i className="fas fa-bell" style={{ color: '#d2691e', marginRight: '8px' }}></i>
                  Email Notifications
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Get reminders for follow-ups and status updates
                </div>
              </div>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={userPreferences.autoSave}
                onChange={(e) => setUserPreferences({...userPreferences, autoSave: e.target.checked})}
                style={{ width: '20px', height: '20px' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  <i className="fas fa-save" style={{ color: '#d2691e', marginRight: '8px' }}></i>
                  Auto-save Applications
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Automatically save your progress as you type
                </div>
              </div>
            </label>
          </div>
        </div>
      )
    },
    {
      title: "Quick Tips",
      content: (
        <div>
          <p style={{ marginBottom: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
            Here are some helpful tips to get you started:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ 
              background: 'rgba(210, 105, 30, 0.1)', 
              border: '1px solid rgba(210, 105, 30, 0.3)', 
              borderRadius: '8px', 
              padding: '15px' 
            }}>
              <div style={{ fontWeight: 'bold', color: '#d2691e', marginBottom: '5px' }}>
                <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                Add Your First Application
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Click the "Add Application" button to start tracking your job search
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(210, 105, 30, 0.1)', 
              border: '1px solid rgba(210, 105, 30, 0.3)', 
              borderRadius: '8px', 
              padding: '15px' 
            }}>
              <div style={{ fontWeight: 'bold', color: '#d2691e', marginBottom: '5px' }}>
                <i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>
                Track Your Progress
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Use the statistics and data visualization to monitor your job search progress
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(210, 105, 30, 0.1)', 
              border: '1px solid rgba(210, 105, 30, 0.3)', 
              borderRadius: '8px', 
              padding: '15px' 
            }}>
              <div style={{ fontWeight: 'bold', color: '#d2691e', marginBottom: '5px' }}>
                <i className="fas fa-cog" style={{ marginRight: '8px' }}></i>
                Customize Settings
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Click your profile avatar to access settings and customize your experience
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      content: (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', color: '#4caf50', marginBottom: '20px' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h3 style={{ marginBottom: '15px', color: '#4caf50' }}>
            Welcome aboard!
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', marginBottom: '20px' }}>
            Your Job Application Tracker is ready to help you succeed in your job search. 
            Start by adding your first application!
          </p>
          <div style={{ 
            background: 'rgba(76, 175, 80, 0.1)', 
            border: '1px solid #4caf50', 
            borderRadius: '8px', 
            padding: '15px',
            marginTop: '20px'
          }}>
            <div style={{ color: '#4caf50', fontSize: '14px' }}>
              <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
              Tip: You can always change these settings later in your profile
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences and complete onboarding
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete(userPreferences);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete(userPreferences);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2>{steps[currentStep].title}</h2>
          <span className="close" onClick={handleSkip}>&times;</span>
        </div>

        <div style={{ padding: '2rem' }}>
          {steps[currentStep].content}
        </div>

        <div className="form-actions" style={{ 
          padding: '0 2rem 2rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {currentStep > 0 && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleBack}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                Back
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleSkip}
            >
              Skip
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 && (
                <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              )}
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div style={{ 
          padding: '0 2rem 2rem 2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index <= currentStep ? '#d2691e' : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserOnboarding;
