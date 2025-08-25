const STORAGE_KEY = 'jobApplications';

// Helper functions for localStorage
const getApplications = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveApplications = (applications) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

export const fetchApplications = async () => {
  return getApplications();
};

export const fetchApplication = async (id) => {
  const applications = getApplications();
  const application = applications.find(app => app.id === parseInt(id));
  if (!application) {
    throw new Error('Application not found');
  }
  return application;
};

export const createApplication = async (applicationData) => {
  const applications = getApplications();
  const newApplication = {
    ...applicationData,
    id: Date.now(), // Simple ID generation
    createdAt: new Date().toISOString()
  };
  applications.push(newApplication);
  saveApplications(applications);
  return newApplication;
};

export const updateApplication = async (id, applicationData) => {
  const applications = getApplications();
  const index = applications.findIndex(app => app.id === parseInt(id));
  if (index === -1) {
    throw new Error('Application not found');
  }
  
  applications[index] = {
    ...applications[index],
    ...applicationData,
    updatedAt: new Date().toISOString()
  };
  saveApplications(applications);
  return applications[index];
};

export const deleteApplication = async (id) => {
  const applications = getApplications();
  const filteredApplications = applications.filter(app => app.id !== parseInt(id));
  saveApplications(filteredApplications);
};
