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
import { fetchApplications, createApplication, updateApplication, deleteApplication } from './services/api';

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

  useEffect(() => {
    loadApplications();
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'default';
    setCurrentTheme(savedTheme);
  }, []);

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

  return (
    <>
      {currentTheme === 'sakura' && <SakuraPetals />}

      <div className="background-pattern"></div>
      <div className="container">
        <Header 
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
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
