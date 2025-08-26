import React, { useState, useEffect } from 'react';
import { auth } from './config/supabase';
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

function App() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDataVizOpen, setIsDataVizOpen] = useState(false);

  const [editingApplication, setEditingApplication] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTheme, setCurrentTheme] = useState('default');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Always start with landing page

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
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        showNotification('You have been signed out.', 'info');
      }
    });
    
    // Cleanup subscription on unmount
    return () => subscription?.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    showNotification('Welcome! You are now logged in.', 'success');
  };

  const handleLogout = async () => {
    try {
      const { error } = await auth.signOut();
      if (error) {
        showNotification('Error signing out: ' + error.message, 'error');
      } else {
        setIsAuthenticated(false);
        showNotification('You have been signed out successfully.', 'info');
      }
    } catch (error) {
      showNotification('Error signing out: ' + error.message, 'error');
    }
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

      const newApplications = [...applications];
      
      if (editingApplication) {
        // Update existing application
        const index = newApplications.findIndex(app => app.id === editingApplication.id);
        if (index !== -1) {
          newApplications[index] = { ...editingApplication, ...applicationData };
        }
        showNotification('Application updated successfully!', 'success');
      } else {
        // Add new application
        const newApp = {
          id: Date.now().toString(), // Simple ID generation
          ...applicationData,
          user_id: user.id,
          created_at: new Date().toISOString()
        };
        newApplications.unshift(newApp); // Add to beginning
        showNotification('Application added successfully!', 'success');
      }
      
      // Save to localStorage (for now, we'll keep this for demo purposes)
      localStorage.setItem('jobApplications', JSON.stringify(newApplications));
      
      // Update state
      setApplications(newApplications);
      setFilteredApplications(newApplications);
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
          </>
        ) : (
          <>
            <div style={{
              position: 'fixed', 
              top: '10px', 
              right: '10px', 
              background: 'linear-gradient(135deg, #ff6b35, #ff8c42)', 
              color: 'white', 
              padding: '8px 12px', 
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 9999,
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
            }}>
              🍂 LANDING PAGE
            </div>
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
