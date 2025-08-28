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

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'default';
    setCurrentTheme(savedTheme);
    
    // Load applications from localStorage
    loadApplications();
    
    // Check for existing auth session
    const checkAuth = async () => {
      const { data: { user } } = await auth.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        console.log('User already authenticated:', user.email);
        
        // Check email verification
        const isEmailVerified = await checkEmailVerification();
        if (!isEmailVerified) {
          showNotification('Please verify your email address for full functionality', 'warning');
        }
        
        // Check if user needs onboarding
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        if (!onboardingCompleted) {
          setIsOnboardingOpen(true);
        }
        
        // Try to sync any existing localStorage applications to database
        try {
          await syncUserApplications();
        } catch (syncError) {
          console.log('Sync failed, continuing with local data:', syncError);
        }
      } else {
        setIsAuthenticated(false);
        console.log('No authenticated user found');
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true);
        showNotification('Welcome back!', 'success');
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

      // First, try to load from database using email
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
          return;
        }
      } catch (dbError) {
        console.log('No database applications found, checking localStorage...');
      }

      // Fallback to localStorage
      const savedApplications = localStorage.getItem('jobApplications');
      const allData = savedApplications ? JSON.parse(savedApplications) : [];
      
      // Filter applications by current user
      const userApplications = allData.filter(app => app.user_id === user.id);
      
      setApplications(userApplications);
      setFilteredApplications(userApplications);
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
        // Update existing application
        const newApplications = [...applications];
        const index = newApplications.findIndex(app => app.id === editingApplication.id);
        if (index !== -1) {
          newApplications[index] = { ...editingApplication, ...applicationData };
        }
        
        // Save to localStorage for now (we'll implement database updates later)
        localStorage.setItem('jobApplications', JSON.stringify(newApplications));
        setApplications(newApplications);
        setFilteredApplications(newApplications);
        showNotification('Application updated successfully!', 'success');
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
          
          // Also save to localStorage as backup
          localStorage.setItem('jobApplications', JSON.stringify(newApplications));
          
          setApplications(newApplications);
          setFilteredApplications(newApplications);
          showNotification('Application added successfully!', 'success');
        } catch (dbError) {
          console.error('Database save failed, using localStorage:', dbError);
          
          // Fallback to localStorage
          const newApp = {
            id: Date.now().toString(),
            ...applicationData,
            user_id: user.id,
            created_at: new Date().toISOString()
          };
          
          const newApplications = [newApp, ...applications];
          localStorage.setItem('jobApplications', JSON.stringify(newApplications));
          setApplications(newApplications);
          setFilteredApplications(newApplications);
          showNotification('Application added (offline mode)!', 'success');
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
      
      // Save to localStorage
      localStorage.setItem('jobApplications', JSON.stringify(newApplications));
      
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
