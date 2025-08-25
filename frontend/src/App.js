import React, { useState, useEffect } from 'react';
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
import { fetchApplications, createApplication, updateApplication, deleteApplication } from './services/api';
import { getCurrentUserData, logoutUser } from './services/userService';

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true); // FORCE DEMO MODE - Always show landing page

  useEffect(() => {
    checkAuthStatus();
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'default';
    setCurrentTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

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
      const data = await fetchApplications();
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      showNotification('Error loading applications', 'error');
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
      if (editingApplication) {
        await updateApplication(editingApplication.id, applicationData);
        showNotification('Application updated successfully!', 'success');
      } else {
        await createApplication(applicationData);
        showNotification('Application added successfully!', 'success');
      }
      await loadApplications();
      setIsModalOpen(false);
      setEditingApplication(null);
    } catch (error) {
      showNotification(error.message || 'Error saving application', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteApplication(editingApplication.id);
      showNotification('Application deleted successfully!', 'success');
      await loadApplications();
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

  const checkAuthStatus = async () => {
    try {
      console.log('Demo mode:', demoMode); // Debug log
      if (demoMode) {
        // Force show landing page for demo purposes
        console.log('Forcing landing page display'); // Debug log
        // Clear any cached authentication
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        setUser(null);
      } else {
        const userData = await getCurrentUserData();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async () => {
    if (demoMode) {
      // In demo mode, just show a success message but stay on landing page
      showNotification('Demo mode: Authentication would work here! 🍂', 'success');
    } else {
      await checkAuthStatus();
      showNotification('Welcome! You are now logged in.', 'success');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setApplications([]);
      setFilteredApplications([]);
      showNotification('You have been logged out.', 'info');
    } catch (error) {
      showNotification('Error logging out', 'error');
    }
  };



  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
        color: '#e5e5e5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <div>Loading Job Application Tracker...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentTheme === 'sakura' && <SakuraPetals />}

      <div className="background-pattern"></div>
      <div className="container">
        {user ? (
          <>
            <Header 
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              user={user}
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
            <div style={{position: 'fixed', top: '10px', right: '10px', background: 'red', color: 'white', padding: '5px', zIndex: 9999}}>
              DEMO MODE ACTIVE
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
