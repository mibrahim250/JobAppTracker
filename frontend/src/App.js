import React, { useState, useEffect } from 'react';
import { auth } from './config/supabase';
import { 
  getCurrentUserData, 
  getApplicationsByEmail, 
  addJobApplicationByEmail,
  syncUserApplications,
  checkEmailVerification 
} from './services/userService';
import Header from './components/Header';
import Actions from './components/Actions';
import Stats from './components/Stats';
import ApplicationsList from './components/ApplicationsList';
import JobModal from './components/JobModal';
import ConfirmModal from './components/ConfirmModal';
import Notification from './components/Notification';
import SakuraPetals from './components/SakuraPetals';
import DataVisualization from './components/DataVisualization';
import LandingPage from './components/LandingPage';
import UserOnboarding from './components/UserOnboarding';
import AuthModal from './components/AuthModal';
import EmailVerification from './components/EmailVerification';
// import TestAuth from './components/TestAuth';

function App() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDataVizOpen, setIsDataVizOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const [editingApplication, setEditingApplication] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTheme, setCurrentTheme] = useState('default');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start as not authenticated
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  // Clear localStorage on app start to fix data persistence issues
  useEffect(() => {
    // Clear localStorage to start fresh
    localStorage.removeItem('jobApplications');
    localStorage.removeItem('onboardingCompleted');
    console.log('LocalStorage cleared for fresh start');
  }, []);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'default';
    setCurrentTheme(savedTheme);
    
    // Check for existing auth session
    const checkAuth = async () => {
      const { data: { user } } = await auth.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        console.log('User already authenticated:', user.email);
        
        // Check email verification
        const isEmailVerified = await checkEmailVerification();
        if (!isEmailVerified) {
          setCurrentUserEmail(user.email);
          setShowEmailVerification(true);
          showNotification('Please verify your email address for full functionality', 'warning');
        }
        
        // Check if user needs onboarding
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        if (!onboardingCompleted) {
          setIsOnboardingOpen(true);
        }
        
        // Load applications from database
        await loadApplications();
      } else {
        setIsAuthenticated(false);
        console.log('No authenticated user found');
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        setCurrentUserEmail(session.user.email);
        
        // Check email verification for new sign-ins
        const isEmailVerified = await checkEmailVerification();
        if (!isEmailVerified) {
          setShowEmailVerification(true);
          showNotification('Please verify your email address for full functionality', 'warning');
        } else {
          showNotification('Welcome back!', 'success');
        }
        
        // Load applications when user signs in
        loadApplications();
      } else if (event === 'SIGNED_OUT') {
        // Don't show notification here as it might conflict with manual logout
        console.log('User signed out via auth state change');
      }
    });
    
    // Cleanup subscription on unmount
    return () => subscription?.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    showNotification('Welcome! You are now logged in.', 'success');
    loadApplications(); // Load applications after successful auth
  };

  const handleEmailVerificationComplete = () => {
    setShowEmailVerification(false);
    showNotification('Email verified successfully!', 'success');
    loadApplications(); // Reload applications after verification
  };

  const handleEmailVerificationClose = () => {
    setShowEmailVerification(false);
  };

  const handleLogout = async () => {
    // Logout disabled for personal use - just show a message
    showNotification('Logout disabled - this is your personal app!', 'info');
  };

  // Remove this useEffect since we don't need user-based loading

  useEffect(() => {
    // Apply theme class to body
    document.body.className = `theme-${currentTheme}`;
    // Save preference to localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(app =>
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.notes && app.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  const loadApplications = async () => {
    try {
      // Get current user
      const { data: { user } } = await auth.getCurrentUser();
      
      if (!user) {
        setApplications([]);
        setFilteredApplications([]);
        return;
      }

      // Load from database using email
      try {
        const dbApplications = await getApplicationsByEmail(user.email);
        if (dbApplications && dbApplications.length > 0) {
          // Convert database format to app format
          const formattedApplications = dbApplications.map(app => ({
            id: app.id,
            company: app.company,
            role: app.role,
            status: app.status,
            applied_date: app.applied_date,
            notes: app.notes,
            created_at: app.created_at,
            user_id: user.id
          }));
          
          setApplications(formattedApplications);
          setFilteredApplications(formattedApplications);
          console.log('Loaded applications from database:', formattedApplications.length);
          return;
        }
      } catch (dbError) {
        console.log('No database applications found:', dbError);
      }

      // If no database applications, start with empty array
      setApplications([]);
      setFilteredApplications([]);
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
      setFilteredApplications([]);
    }
  };

  const handleAddApplication = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleEditApplication = (application) => {
    setEditingApplication(application);
    setIsModalOpen(true);
  };

  const handleDeleteApplication = (application) => {
    setEditingApplication(application);
    setIsConfirmModalOpen(true);
  };

  const handleSaveApplication = async (applicationData) => {
    try {
      // Get current user
      const { data: { user } } = await auth.getCurrentUser();
      
      if (!user) {
        showNotification('You must be logged in to save applications', 'error');
        return;
      }

      if (editingApplication) {
        // Update existing application - for now, we'll recreate it
        // TODO: Implement proper update functionality
        const newApplications = applications.filter(app => app.id !== editingApplication.id);
        
        // Add the updated application as new
        try {
          const appId = await addJobApplicationByEmail(user.email, applicationData);
          
          const updatedApp = {
            id: appId,
            ...applicationData,
            user_id: user.id,
            created_at: new Date().toISOString()
          };
          
          const finalApplications = [updatedApp, ...newApplications];
          setApplications(finalApplications);
          setFilteredApplications(finalApplications);
          showNotification('Application updated successfully!', 'success');
        } catch (dbError) {
          console.error('Database update failed:', dbError);
          showNotification('Error updating application', 'error');
        }
      } else {
        // Add new application to database
        try {
          const appId = await addJobApplicationByEmail(user.email, applicationData);
          
          const newApp = {
            id: appId,
            ...applicationData,
            user_id: user.id,
            created_at: new Date().toISOString()
          };
          
          const newApplications = [newApp, ...applications];
          
          setApplications(newApplications);
          setFilteredApplications(newApplications);
          showNotification('Application added successfully!', 'success');
        } catch (dbError) {
          console.error('Database save failed:', dbError);
          showNotification('Error saving application to database', 'error');
        }
      }
      
      setIsModalOpen(false);
      setEditingApplication(null);
    } catch (error) {
      showNotification('Error saving application', 'error');
    }
  };

  const handleConfirmDelete = () => {
    try {
      const newApplications = applications.filter(app => app.id !== editingApplication.id);
      
      // Update state
      setApplications(newApplications);
      setFilteredApplications(newApplications);
      showNotification('Application deleted successfully!', 'success');
      setIsConfirmModalOpen(false);
      setEditingApplication(null);
    } catch (error) {
      showNotification('Error deleting application', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setEditingApplication(null);
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  const handleShowDataViz = () => {
    setIsDataVizOpen(true);
  };

  const handleCloseDataViz = () => {
    setIsDataVizOpen(false);
  };

  const handleOnboardingComplete = (preferences) => {
    // Apply user preferences
    if (preferences.theme) {
      setCurrentTheme(preferences.theme);
    }
    localStorage.setItem('onboardingCompleted', 'true');
    showNotification('Welcome! Your preferences have been saved.', 'success');
  };

  // Authentication removed - app works without user accounts



  return (
    <>
      {currentTheme === 'sakura' && <SakuraPetals />}

      <div className="background-pattern"></div>
      <div className="container">
        {isAuthenticated ? (
          <>
            <Header 
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              onLogout={handleLogout}
            />
            
            <Actions 
              onAddApplication={handleAddApplication}
              onShowDataViz={handleShowDataViz}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <Stats applications={applications} />
            
            <ApplicationsList 
              applications={filteredApplications}
              onEdit={handleEditApplication}
              onDelete={handleDeleteApplication}
            />
            
            <JobModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSave={handleSaveApplication}
              application={editingApplication}
            />
            
            <ConfirmModal
              isOpen={isConfirmModalOpen}
              onClose={closeConfirmModal}
              onConfirm={handleConfirmDelete}
              application={editingApplication}
            />

            <DataVisualization
              applications={applications}
              isOpen={isDataVizOpen}
              onClose={handleCloseDataViz}
            />

            <UserOnboarding
              isOpen={isOnboardingOpen}
              onClose={() => setIsOnboardingOpen(false)}
              onComplete={handleOnboardingComplete}
            />
            
            {/* Temporary test component - commented out for personal use */}
            {/* <TestAuth /> */}
          </>
        ) : (
          <>
            <LandingPage onAuthSuccess={handleAuthSuccess} />
          </>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />

        {/* Email Verification Modal */}
        <EmailVerification
          email={currentUserEmail}
          onVerificationComplete={handleEmailVerificationComplete}
          onClose={handleEmailVerificationClose}
        />
        
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
}

export default App;
