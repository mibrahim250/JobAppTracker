// Global variables
let applications = [];
let editingId = null;
const API_BASE_URL = '/api/jobs';

// DOM elements
const applicationsList = document.getElementById('applicationsList');
const addJobBtn = document.getElementById('addJobBtn');
const jobModal = document.getElementById('jobModal');
const confirmModal = document.getElementById('confirmModal');
const jobForm = document.getElementById('jobForm');
const searchInput = document.getElementById('searchInput');
const modalTitle = document.getElementById('modalTitle');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadApplications();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    addJobBtn.addEventListener('click', openAddModal);
    
    // Modal close events
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === jobModal) {
            closeModal();
        }
        if (event.target === confirmModal) {
            closeConfirmModal();
        }
    });
    
    // Form submission
    jobForm.addEventListener('submit', handleFormSubmit);
    
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
}

// Load all applications from the backend
async function loadApplications() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        applications = await response.json();
        renderApplications();
        updateStats();
    } catch (error) {
        console.error('Error loading applications:', error);
        showNotification('Error loading applications', 'error');
    }
}

// Render applications in the UI
function renderApplications(filteredApplications = null) {
    const appsToRender = filteredApplications || applications;
    
    if (appsToRender.length === 0) {
        applicationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-briefcase"></i>
                <h3>No job applications yet</h3>
                <p>Click "Add New Application" to get started!</p>
            </div>
        `;
        return;
    }
    
    applicationsList.innerHTML = appsToRender.map(app => `
        <div class="job-card" data-id="${app.id}">
            <div class="job-card-header">
                <div class="job-card-title">
                    <h3>${escapeHtml(app.role)}</h3>
                    <div class="company">${escapeHtml(app.company)}</div>
                    <div class="role">${escapeHtml(app.role)}</div>
                </div>
                <span class="status-badge status-${getStatusClass(app.status)}">${escapeHtml(app.status)}</span>
            </div>
            ${app.notes ? `<div class="job-card-notes">${escapeHtml(app.notes)}</div>` : ''}
            <div class="job-card-actions">
                <button class="action-btn edit" onclick="editApplication(${app.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteApplication(${app.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Get CSS class for status badge
function getStatusClass(status) {
    const statusMap = {
        'Applied': 'applied',
        'Under Review': 'review',
        'Phone Screen': 'phone',
        'Interview': 'interview',
        'Technical Interview': 'technical',
        'Final Interview': 'final',
        'Offer': 'offer',
        'Accepted': 'accepted',
        'Rejected': 'rejected',
        'Withdrawn': 'withdrawn'
    };
    return statusMap[status] || 'applied';
}

// Update statistics
function updateStats() {
    const total = applications.length;
    const pending = applications.filter(app => 
        ['Applied', 'Under Review', 'Phone Screen', 'Interview', 'Technical Interview', 'Final Interview'].includes(app.status)
    ).length;
    const interviews = applications.filter(app => 
        ['Phone Screen', 'Interview', 'Technical Interview', 'Final Interview'].includes(app.status)
    ).length;
    const rejected = applications.filter(app => 
        ['Rejected', 'Withdrawn'].includes(app.status)
    ).length;
    
    document.getElementById('totalApplications').textContent = total;
    document.getElementById('pendingApplications').textContent = pending;
    document.getElementById('interviewApplications').textContent = interviews;
    document.getElementById('rejectedApplications').textContent = rejected;
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderApplications();
        return;
    }
    
    const filtered = applications.filter(app => 
        app.company.toLowerCase().includes(searchTerm) ||
        app.role.toLowerCase().includes(searchTerm) ||
        app.status.toLowerCase().includes(searchTerm) ||
        (app.notes && app.notes.toLowerCase().includes(searchTerm))
    );
    
    renderApplications(filtered);
}

// Open modal for adding new application
function openAddModal() {
    editingId = null;
    modalTitle.textContent = 'Add New Job Application';
    jobForm.reset();
    jobModal.style.display = 'block';
}

// Open modal for editing existing application
async function editApplication(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const app = await response.json();
        editingId = id;
        modalTitle.textContent = 'Edit Job Application';
        
        // Populate form fields
        document.getElementById('company').value = app.company;
        document.getElementById('role').value = app.role;
        document.getElementById('status').value = app.status;
        document.getElementById('notes').value = app.notes || '';
        
        jobModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading application for edit:', error);
        showNotification('Error loading application for edit', 'error');
    }
}

// Handle form submission (create or update)
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(jobForm);
    const applicationData = {
        company: formData.get('company').trim(),
        role: formData.get('role').trim(),
        status: formData.get('status'),
        notes: formData.get('notes').trim() || null
    };
    
    try {
        let response;
        let message;
        
        if (editingId) {
            // Update existing application
            response = await fetch(`${API_BASE_URL}/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData)
            });
            message = 'Application updated successfully!';
        } else {
            // Create new application
            response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData)
            });
            message = 'Application added successfully!';
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }
        
        closeModal();
        await loadApplications();
        showNotification(message, 'success');
        
    } catch (error) {
        console.error('Error saving application:', error);
        showNotification(error.message || 'Error saving application', 'error');
    }
}

// Delete application
function deleteApplication(id) {
    const app = applications.find(a => a.id === id);
    const message = `Are you sure you want to delete the application for ${app.company} - ${app.role}?`;
    
    showConfirmModal(message, () => performDelete(id));
}

// Perform the actual deletion
async function performDelete(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadApplications();
        showNotification('Application deleted successfully!', 'success');
        
    } catch (error) {
        console.error('Error deleting application:', error);
        showNotification('Error deleting application', 'error');
    }
}

// Show confirmation modal
function showConfirmModal(message, onConfirm) {
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmActionBtn').onclick = onConfirm;
    confirmModal.style.display = 'block';
}

// Close confirmation modal
function closeConfirmModal() {
    confirmModal.style.display = 'none';
}

// Close job modal
function closeModal() {
    jobModal.style.display = 'none';
    editingId = null;
    jobForm.reset();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: auto;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add some sample data for demonstration (remove in production)
function addSampleData() {
    const sampleApplications = [
        {
            company: 'Tech Corp',
            role: 'Software Engineer',
            status: 'Applied',
            notes: 'Applied through LinkedIn. Company looks promising with good benefits.'
        },
        {
            company: 'Startup Inc',
            role: 'Full Stack Developer',
            status: 'Phone Screen',
            notes: 'Scheduled for next week. Need to prepare for system design questions.'
        },
        {
            company: 'Enterprise Solutions',
            role: 'Senior Developer',
            status: 'Interview',
            notes: 'On-site interview scheduled. Prepare portfolio and coding challenges.'
        }
    ];
    
    // Add sample data one by one
    sampleApplications.forEach(async (app) => {
        try {
            await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(app)
            });
        } catch (error) {
            console.error('Error adding sample data:', error);
        }
    });
    
    // Reload applications after adding sample data
    setTimeout(loadApplications, 1000);
}

// Add a button to load sample data (for development purposes)
// Uncomment the following lines if you want to add sample data functionality
/*
document.addEventListener('DOMContentLoaded', function() {
    if (applications.length === 0) {
        const sampleBtn = document.createElement('button');
        sampleBtn.textContent = 'Load Sample Data';
        sampleBtn.className = 'btn btn-secondary';
        sampleBtn.style.marginLeft = '10px';
        sampleBtn.onclick = addSampleData;
        document.querySelector('.actions').appendChild(sampleBtn);
    }
});
*/
