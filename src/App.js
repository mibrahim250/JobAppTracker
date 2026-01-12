import React, { useEffect, useState } from 'react';
import { supabase } from './config/supabase';
import './App.css';

// Animated Background Component
function AnimatedBackground({ theme }) {
  if (theme === 'winter') {
    return (
      <div className="snow-container">
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
        <div className="snowflake"></div>
      </div>
    );
  }
  
  if (theme === 'starry') {
    return (
      <div className="starry-sky-container">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
        <div className="star star-6"></div>
        <div className="star star-7"></div>
        <div className="star star-8"></div>
        <div className="star star-9"></div>
        <div className="star star-10"></div>
        <div className="star star-11"></div>
        <div className="star star-12"></div>
        <div className="star star-13"></div>
        <div className="star star-14"></div>
        <div className="star star-15"></div>
        <div className="star star-16"></div>
        <div className="star star-17"></div>
        <div className="star star-18"></div>
        <div className="star star-19"></div>
        <div className="star star-20"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star shooting-star-2"></div>
      </div>
    );
  }
  
  if (theme === 'black') {
    return null; // No background animation for black theme
  }
  
  if (theme === 'valentines') {
    return (
      <div className="hearts-container">
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
        <div className="heart"></div>
      </div>
    );
  }
  
  if (theme === 'blood-orange') {
    return (
      <div className="liquid-container">
        <div className="liquid-blob liquid-blob-1"></div>
        <div className="liquid-blob liquid-blob-2"></div>
        <div className="liquid-blob liquid-blob-3"></div>
        <div className="liquid-blob liquid-blob-4"></div>
        <div className="liquid-blob liquid-blob-5"></div>
      </div>
    );
  }
  
  // Fall theme (default)
  return (
    <div className="leaves-container">
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
      <div className="leaf"></div>
    </div>
  );
}

// Settings Modal Component
function SettingsModal({ isOpen, onClose, currentTheme, onThemeChange }) {
  if (!isOpen) return null;

  const themes = [
    { id: 'black', name: '⚫ Clean Black', description: 'Minimalist dark theme for focus' },
    { id: 'winter', name: '❄️ Winter Wonderland', description: 'Cool blues with falling snow' },
    { id: 'starry', name: '🌌 Starry Night', description: 'Magical night sky with twinkling stars' },
    { id: 'valentines', name: '💕 Valentines', description: 'Sweet pink theme with falling hearts' },
    { id: 'blood-orange', name: '🍊 Blood Orange', description: 'Dark mode with liquid orange & maroon vibes' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚙️ Settings</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="theme-section">
            <h4>Choose Theme</h4>
            <div className="theme-options">
              {themes.map(theme => (
                <div 
                  key={theme.id} 
                  className={`theme-option ${currentTheme === theme.id ? 'selected' : ''}`}
                  onClick={() => onThemeChange(theme.id)}
                >
                  <div className={`theme-preview theme-preview-${theme.id}`}></div>
                  <div className="theme-info">
                    <h5>{theme.name}</h5>
                    <p>{theme.description}</p>
                  </div>
                  {currentTheme === theme.id && <span className="checkmark">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Modal Component
function AnalyticsModal({ isOpen, onClose, applications }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && applications.length > 0) {
      generateAnalytics();
    }
  }, [isOpen, applications]);

  const generateAnalytics = async () => {
    setLoading(true);
    
    // Faster processing - reduced loading time
    setTimeout(() => {
      const analytics = processApplicationsData(applications);
      setAnalyticsData(analytics);
      setLoading(false);
    }, 800);
  };

  // Process applications data and generate analytics - Simplified for performance
  const processApplicationsData = (apps) => {
    if (!apps || apps.length === 0) {
      return {
        totalApplications: 0,
        successRate: 0,
        statusCounts: {},
        successCount: 0,
        status: 'empty',
        message: 'No applications to analyze yet'
      };
    }

    // Simplified analytics - only essential data
    const statusCounts = {};
    let successCount = 0;
    const successStatuses = ['offer', 'accepted', 'interview'];
    
    // Process only essential data for better performance
    apps.forEach(app => {
      if (app && app.status) {
        const status = app.status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        if (successStatuses.includes(status)) {
          successCount++;
        }
      }
    });
    
    // Calculate success rate
    const successRate = apps.length > 0 ? 
      Math.round((successCount / apps.length) * 100 * 10) / 10 : 0;
    
    return {
      totalApplications: apps.length,
      successRate: successRate,
      statusCounts: statusCounts,
      successCount: successCount,
      status: 'success',
      message: 'Analytics generated successfully!'
    };
  };



  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content analytics-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📊 Application Analytics</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="fun-loading-state">
              <div className="bouncing-emoji">📊</div>
              <p>Generating your analytics...</p>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : analyticsData ? (
            <div className="analytics-content">
              {/* Check if no data */}
              {analyticsData.status === 'empty' ? (
                <div className="fun-maintenance-message">
                  <div className="popup-emoji">📊</div>
                  <h3>No Data Yet!</h3>
                  <p>{analyticsData.message}</p>
                  <div className="sparkle">✨</div>
                </div>
              ) : (
                 <>
                   {/* Spring Boot Note */}
                   <div className="spring-boot-note">
                     <p>🚀 <strong>Client-side Analytics</strong> - Enhanced with Spring Boot backend coming soon!</p>
                   </div>
                   
                   {/* Summary Cards */}
                   <div className="analytics-summary">
                     <div className="summary-card">
                       <h4>Total Applications</h4>
                       <p className="summary-number">{analyticsData.totalApplications}</p>
                     </div>
                     <div className="summary-card">
                       <h4>Success Rate</h4>
                       <p className="summary-number">{analyticsData.successRate}%</p>
                     </div>
                     <div className="summary-card">
                       <h4>Active Pipeline</h4>
                       <p className="summary-number">{analyticsData.successCount}</p>
                                          </div>
                   </div>
               
               {/* Status Distribution - Simplified */}
               <div className="analytics-section">
                 <h4>📊 Application Status</h4>
                 <div className="status-chart">
                   {analyticsData.statusCounts && Object.entries(analyticsData.statusCounts).map(([status, count]) => (
                     <div key={status} className="status-bar">
                       <span className="status-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                       <div className="status-bar-container">
                         <div 
                           className="status-bar-fill" 
                           style={{ 
                             width: `${analyticsData.totalApplications > 0 ? (count / analyticsData.totalApplications) * 100 : 0}%`,
                             backgroundColor: getStatusColor(status)
                           }}
                         ></div>
                       </div>
                       <span className="status-count">{count}</span>
                     </div>
                   ))}
                 </div>
               </div>
                 </>
               )}
             </div>
          ) : (
            <div className="empty-state">
              <p>📊 No data available for analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function for status colors
function getStatusColor(status) {
  const colors = {
    'wishlist': '#6366f1',
    'applied': '#f59e0b',
    'oa': '#8b5cf6',
    'interview': '#06b6d4',
    'offer': '#10b981',
    'rejected': '#ef4444',
    'ghosted': '#6b7280',
    'accepted': '#059669',
    'declined': '#dc2626'
  };
  return colors[status] || '#6b7280';
}

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  
  // Theme state
  const [theme, setTheme] = useState('black');
  const [showSettings, setShowSettings] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNotesPage, setShowNotesPage] = useState(false);
  const [showInterviewTracker, setShowInterviewTracker] = useState(false);
  const [quickAdder, setQuickAdder] = useState(false);
  
  // Interview Tracker states
  const [interviews, setInterviews] = useState([]);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [interviewFormData, setInterviewFormData] = useState({
    name: '',
    time: '',
    place: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to user's timezone
    status: 'in-progress'
  });

  // Common timezones for interviews
  const timezones = [
    { value: 'America/New_York', label: '🇺🇸 Eastern Time (ET)' },
    { value: 'America/Chicago', label: '🇺🇸 Central Time (CT)' },
    { value: 'America/Denver', label: '🇺🇸 Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: '🇺🇸 Pacific Time (PT)' },
    { value: 'America/Phoenix', label: '🇺🇸 Arizona Time (MST)' },
    { value: 'Asia/Karachi', label: '🇵🇰 Pakistan Time (PKT)' },
    { value: 'Asia/Dubai', label: '🇦🇪 UAE Time (GST)' },
    { value: 'Asia/Kolkata', label: '🇮🇳 India Time (IST)' },
    { value: 'Europe/London', label: '🇬🇧 UK Time (GMT/BST)' },
    { value: 'Europe/Paris', label: '🇪🇺 Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: '🇯🇵 Japan Time (JST)' },
    { value: 'Australia/Sydney', label: '🇦🇺 Australia Eastern Time (AEST)' },
    { value: 'UTC', label: '🌍 UTC' }
  ];
  
  // Job application states
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    company: '',
    role_title: '',
    status: 'applied',
    location: '',
    source: '',
    link: '',
    applied_at: '',
    notes: ''
  });

  // Filters state
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
    statuses: [],
    isExpanded: false
  });

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('jobTrackerTheme');
    if (savedTheme && ['black', 'winter', 'starry', 'valentines', 'blood-orange'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('jobTrackerTheme', theme);
  }, [theme]);

  // Load existing session on mount + subscribe to changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setUser(session?.user ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Load job applications when user is authenticated
  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  // Load interviews when Interview Tracker page is opened
  useEffect(() => {
    if (showInterviewTracker && user) {
      loadInterviews();
    }
  }, [showInterviewTracker, user]);

  async function handleAuth(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg('Check your email to confirm your account (if email confirmations are enabled).');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg('Signed in!');
      }
    } catch (err) {
      setMsg(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    setMsg('');
    try {
      await supabase.auth.signOut();
      // Reset all state immediately
      setUser(null);
      setApplications([]);
      setShowForm(false);
      setEditingApp(null);
      setFormData({
        company: '',
        role_title: '',
        status: 'applied',
        location: '',
        source: '',
        link: '',
        applied_at: '',
        notes: ''
      });
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setBusy(false);
    }
  }

  async function loadApplications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error loading applications:', err);
      setMsg('Failed to load applications: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitApplication(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([{
          ...formData,
          user_id: user.id,
          applied_at: formData.applied_at || null
        }]);
      
      if (error) throw error;
      
      setMsg('Application added successfully!');
      setFormData({
        company: '',
        role_title: '',
        status: 'applied',
        location: '',
        source: '',
        link: '',
        applied_at: '',
        notes: ''
      });
      setQuickAdder(false);
      setShowForm(false);
      loadApplications();
    } catch (err) {
      setMsg('Failed to add application: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateApplication(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({
          ...formData,
          applied_at: formData.applied_at || null
        })
        .eq('id', editingApp.id);
      
      if (error) throw error;
      
      setMsg('Application updated successfully!');
      setEditingApp(null);
      setFormData({
        company: '',
        role_title: '',
        status: 'applied',
        location: '',
        source: '',
        link: '',
        applied_at: '',
        notes: ''
      });
      loadApplications();
      // Don't scroll to top - stay in current position
    } catch (err) {
      setMsg('Failed to update application: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteApplication(id) {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    setBusy(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMsg('Application deleted successfully!');
      loadApplications();
    } catch (err) {
      setMsg('Failed to delete application: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleEdit(application) {
    setEditingApp(application);
    setFormData({
      company: application.company,
      role_title: application.role_title,
      status: application.status,
      location: application.location || '',
      source: application.source || '',
      link: application.link || '',
      applied_at: application.applied_at || '',
      notes: application.notes || ''
    });
  }

  function handleCancel() {
    setShowForm(false);
    setEditingApp(null);
    setQuickAdder(false);
    setFormData({
      company: '',
      role_title: '',
      status: 'applied',
      location: '',
      source: '',
      link: '',
      applied_at: '',
      notes: ''
    });
    // Don't scroll to top - stay in current position
  }

  function toggleStatusFilter(status) {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }));
  }

  function clearFilters() {
    setFilters({
      searchTerm: '',
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
      statuses: [],
      isExpanded: false
    });
  }

  const filteredApplications = applications.filter(app => {
    // Apply search filter
    const matchesSearchTerm = !filters.searchTerm || 
      app.company.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      app.role_title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
      (app.notes && app.notes.toLowerCase().includes(filters.searchTerm.toLowerCase()));

    // Apply date filter
    let matchesDateRange = true;
    if (filters.dateRange !== 'all') {
      // Handle dateless applications
      if (filters.dateRange === 'dateless') {
        matchesDateRange = !app.applied_at || app.applied_at === '';
      } else if (app.applied_at) {
        // Only process applications that have dates
        const now = new Date();
        const appDate = new Date(app.applied_at);
        let startDate = new Date();
        let endDate = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            matchesDateRange = appDate >= startDate && appDate <= endDate;
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
            matchesDateRange = appDate >= startDate;
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            startDate.setHours(0, 0, 0, 0);
            matchesDateRange = appDate >= startDate;
            break;
          case '3months':
            startDate.setMonth(now.getMonth() - 3);
            startDate.setHours(0, 0, 0, 0);
            matchesDateRange = appDate >= startDate;
            break;
          case '6months':
            startDate.setMonth(now.getMonth() - 6);
            startDate.setHours(0, 0, 0, 0);
            matchesDateRange = appDate >= startDate;
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            startDate.setHours(0, 0, 0, 0);
            matchesDateRange = appDate >= startDate;
            break;
          case 'custom':
            if (filters.customStartDate) {
              const start = new Date(filters.customStartDate);
              start.setHours(0, 0, 0, 0);
              matchesDateRange = appDate >= start;
            }
            if (filters.customEndDate) {
              const end = new Date(filters.customEndDate);
              end.setHours(23, 59, 59, 999);
              matchesDateRange = matchesDateRange && appDate <= end;
            }
            break;
        }
      } else {
        // If looking for specific date ranges but no date is set, exclude this application
        matchesDateRange = false;
      }
    }

    // Apply status filter
    const matchesStatuses = filters.statuses.length === 0 || filters.statuses.includes(app.status);

    return matchesSearchTerm && matchesDateRange && matchesStatuses;
  });

  if (!user) {
    return (
      <>
        <AnimatedBackground theme={theme} />
        <div className="App">
          <header className="App-header">
            <h1>{theme === 'winter' ? '❄️' : theme === 'black' ? '⚫' : theme === 'starry' ? '🌌' : theme === 'valentines' ? '💕' : theme === 'blood-orange' ? '🍊' : '🍂'} Job Application Tracker</h1>
            <p>Track your career journey with style</p>
          </header>

          <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
            <div className="form-header">
              <h3>{mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}</h3>
              <p>{mode === 'signup' ? 'Start tracking your job applications today' : 'Sign in to continue'}</p>
            </div>
            <form onSubmit={handleAuth} className="row">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <div className="row">
                <button disabled={busy} type="submit" className="btn-primary">
                  {busy ? 'Please wait…' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode(m => (m === 'signup' ? 'signin' : 'signup'))}
                  disabled={busy}
                  className="btn-secondary"
                >
                  {mode === 'signup' ? 'Already have an account?' : 'New here?'}
                </button>
              </div>
            </form>
            {msg && <p style={{ opacity: 0.85, textAlign: 'center', marginTop: '16px' }}>{msg}</p>}
          </div>
        </div>
      </>
    );
  }

  // Load interviews from Supabase
  async function loadInterviews() {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInterviews(data || []);
    } catch (err) {
      console.error('Error loading interviews:', err);
      setMsg('Failed to load interviews: ' + err.message);
    }
  }

  // Interview Tracker handlers
  async function handleSubmitInterview(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    
    try {
      if (editingInterview) {
        // Update existing interview
        const { error } = await supabase
          .from('interviews')
          .update({
            ...interviewFormData
          })
          .eq('id', editingInterview.id);
        
        if (error) throw error;
        setMsg('Interview updated successfully!');
      } else {
        // Add new interview
        const { error } = await supabase
          .from('interviews')
          .insert([{
            ...interviewFormData,
            user_id: user.id
          }]);
        
        if (error) throw error;
        setMsg('Interview added successfully!');
      }
      
      setInterviewFormData({ name: '', time: '', place: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, status: 'in-progress' });
      setShowInterviewForm(false);
      setEditingInterview(null);
      loadInterviews();
    } catch (err) {
      setMsg('Failed to save interview: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteInterview(id) {
    if (!confirm('Are you sure you want to delete this interview?')) return;
    
    setBusy(true);
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMsg('Interview deleted successfully!');
      loadInterviews();
    } catch (err) {
      setMsg('Failed to delete interview: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleEditInterview(interview) {
    setEditingInterview(interview);
    setInterviewFormData({
      name: interview.name,
      time: interview.time,
      place: interview.place,
      timezone: interview.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      status: interview.status
    });
    setShowInterviewForm(true);
  }

  // Show Interview Tracker Page
  if (showInterviewTracker) {
    return (
      <>
        <AnimatedBackground theme={theme} />
        <div className="App">
          <header className="App-header">
            <h1>{theme === 'winter' ? '❄️' : theme === 'black' ? '⚫' : theme === 'starry' ? '🌌' : theme === 'valentines' ? '💕' : theme === 'blood-orange' ? '🍊' : '🍂'} Job Application Tracker</h1>
            <div className="row">
              <p>Welcome back, {user.email}</p>
              <div className="row" style={{ gap: '12px' }}>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  ⚙️ Settings
                </button>
                <button onClick={handleSignOut} disabled={busy} className="btn-secondary">
                  Sign out
                </button>
              </div>
            </div>
          </header>

          {msg && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <p style={{ margin: 0, opacity: 0.85, textAlign: 'center' }}>{msg}</p>
            </div>
          )}

          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>📅 Interview Tracker ({interviews.length})</h2>
            <button
              onClick={() => setShowInterviewForm(true)}
              disabled={showInterviewForm || editingInterview}
              className="btn-primary"
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              + Add Interview
            </button>
          </div>

          {showInterviewForm && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="form-header">
                <h3>{editingInterview ? '✏️ Edit Interview' : '📅 Add New Interview'}</h3>
                <p>{editingInterview ? 'Update interview details' : 'Track your upcoming interviews'}</p>
              </div>
              <form onSubmit={handleSubmitInterview} className="job-form">
                <div className="form-group">
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Name</label>
                  <input
                    type="text"
                    placeholder="Interviewer/Company name"
                    value={interviewFormData.name}
                    onChange={e => setInterviewFormData({...interviewFormData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Time</label>
                  <input
                    type="time"
                    value={interviewFormData.time}
                    onChange={e => setInterviewFormData({...interviewFormData, time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Timezone</label>
                  <select
                    value={interviewFormData.timezone}
                    onChange={e => setInterviewFormData({...interviewFormData, timezone: e.target.value})}
                    required
                  >
                    {timezones.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Place</label>
                  <input
                    type="text"
                    placeholder="Location or platform (e.g., Zoom, Office, etc.)"
                    value={interviewFormData.place}
                    onChange={e => setInterviewFormData({...interviewFormData, place: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Status</label>
                  <select
                    value={interviewFormData.status}
                    onChange={e => setInterviewFormData({...interviewFormData, status: e.target.value})}
                    required
                  >
                    <option value="in-progress">🟡 In Progress</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>
              </form>
              <div className="row" style={{ justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  onClick={() => {
                    setShowInterviewForm(false);
                    setEditingInterview(null);
                    setInterviewFormData({ name: '', time: '', place: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, status: 'in-progress' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitInterview}
                  disabled={busy || !interviewFormData.name || !interviewFormData.time || !interviewFormData.place}
                  className="btn-primary"
                >
                  {busy ? 'Saving...' : (editingInterview ? 'Update Interview' : 'Add Interview')}
                </button>
              </div>
            </div>
          )}

          {interviews.length === 0 ? (
            <div className="card empty-state">
              <p>📅 No interviews tracked yet. Add your first interview to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {interviews.map(interview => (
                <div key={interview.id} className="card application-card">
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 8px 0' }}>{interview.name}</h3>
                      <p className="meta" style={{ margin: '4px 0' }}>
                        🕐 {interview.time} {interview.timezone ? `(${timezones.find(tz => tz.value === interview.timezone)?.label.split(' ').slice(1).join(' ') || interview.timezone})` : ''} | 📍 {interview.place}
                      </p>
                    </div>
                    <div className="row" style={{ gap: '12px', alignItems: 'center' }}>
                      <span 
                        className={`status-badge ${interview.status === 'done' ? 'status-accepted' : 'status-interview'}`}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        {interview.status === 'done' ? '✅ Done' : '🟡 In Progress'}
                      </span>
                      <button 
                        onClick={() => handleEditInterview(interview)}
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteInterview(interview.id)}
                        disabled={busy}
                        className="btn-danger"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button
              onClick={() => { setShowInterviewTracker(false); setMsg(''); }}
              className="btn-primary"
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              ← Back to Applications
            </button>
          </div>
        </div>
      </>
    );
  }

  // Show Notes Page
  if (showNotesPage) {
    return (
      <>
        <AnimatedBackground theme={theme} />
        <div className="App">
          <header className="App-header">
            <h1>{theme === 'winter' ? '❄️' : theme === 'black' ? '⚫' : theme === 'starry' ? '🌌' : theme === 'valentines' ? '💕' : theme === 'blood-orange' ? '🍊' : '🍂'} Job Application Tracker</h1>
            <div className="row">
              <p>Welcome back, {user.email}</p>
              <div className="row" style={{ gap: '12px' }}>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  ⚙️ Settings
                </button>
                <button onClick={handleSignOut} disabled={busy} className="btn-secondary">
                  Sign out
                </button>
              </div>
            </div>
          </header>
          
          <div className="card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>📝</div>
            <h2 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Notes Feature</h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Coming Soon!
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              This feature will allow you to store detailed notes about specific job applications.
            </p>
            <button
              onClick={() => setShowNotesPage(false)}
              className="btn-primary"
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              ← Back to Applications
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground theme={theme} />
      <div className="App">
        <header className="App-header">
          <h1>{theme === 'winter' ? '❄️' : theme === 'black' ? '⚫' : theme === 'starry' ? '🌌' : theme === 'valentines' ? '💕' : theme === 'blood-orange' ? '🍊' : '🍂'} Job Application Tracker</h1>
          <div className="row">
            <p>Welcome back, {user.email}</p>
            <div className="row" style={{ gap: '12px' }}>
              <button 
                onClick={() => setShowSettings(true)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                ⚙️ Settings
              </button>
              <button onClick={handleSignOut} disabled={busy} className="btn-secondary">
                Sign out
              </button>
            </div>
          </div>
        </header>

        {msg && (
          <div className="card" style={{ marginBottom: '16px' }}>
            <p style={{ margin: 0, opacity: 0.85, textAlign: 'center' }}>{msg}</p>
          </div>
        )}

        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Your Applications ({filteredApplications.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <button
              onClick={() => setShowForm(true)}
              disabled={showForm || editingApp}
              className="btn-primary"
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              Add Application
            </button>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="🔍 Search applications..."
                value={filters.searchTerm}
                onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="inline-search-input"
              />
              <button
                onClick={() => setFilters(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
                className="btn-primary"
                style={{ fontSize: '12px', padding: '6px 12px', width: 'fit-content' }}
                title={filters.isExpanded ? 'Collapse filters' : 'Expand filters'}
              >
                Filters {(filters.searchTerm || filters.dateRange !== 'all' || filters.statuses.length > 0) ? ' (Active)' : ''} {filters.isExpanded ? '−' : '+'}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Options - Only shown when filter button is clicked */}
        {filters.isExpanded && (
          <div className="expanded-filter-content">
            <div className="filter-section">
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>📅 Date Range</h4>
              <div className="filter-options">
                {[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                  { value: '3months', label: 'Last 3 Months' },
                  { value: '6months', label: 'Last 6 Months' },
                  { value: 'year', label: 'This Year' },
                  { value: 'dateless', label: '📅 No Date Set' },
                  { value: 'custom', label: 'Custom Range' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: option.value }))}
                    className={`filter-chip ${filters.dateRange === option.value ? 'active' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {filters.dateRange === 'custom' && (
                <div className="custom-date-inputs">
                  <input
                    type="date"
                    value={filters.customStartDate}
                    onChange={e => setFilters(prev => ({ ...prev, customStartDate: e.target.value }))}
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={filters.customEndDate}
                    onChange={e => setFilters(prev => ({ ...prev, customEndDate: e.target.value }))}
                    placeholder="End Date"
                  />
                </div>
              )}
            </div>

            <div className="filter-section">
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>📊 Status</h4>
              <div className="filter-options">
                {[
                  { value: 'wishlist', label: '🌟 Wishlist' },
                  { value: 'applied', label: '📝 Applied' },
                  { value: 'oa', label: '💻 OA' },
                  { value: 'interview', label: '🎯 Interview' },
                  { value: 'offer', label: '🎉 Offer' },
                  { value: 'rejected', label: '❌ Rejected' },
                  { value: 'ghosted', label: '👻 Ghosted' },
                  { value: 'accepted', label: '✅ Accepted' },
                  { value: 'declined', label: '🚫 Declined' }
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => toggleStatusFilter(status.value)}
                    className={`filter-chip ${filters.statuses.includes(status.value) ? 'active' : ''}`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>🔍 Search</h4>
              <input
                type="text"
                placeholder="Search by company, role, location, or notes..."
                value={filters.searchTerm}
                onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="search-input"
              />
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="btn-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                🗑️ Clear All
              </button>
              <span className="filter-summary">
                Showing {filteredApplications.length} of {applications.length} applications
              </span>
            </div>
          </div>
        )}

        {/* Analytics and View Toggle Buttons */}
        <div className="view-toggle-container">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="btn-primary"
            style={{ fontSize: '14px', padding: '8px 16px', marginRight: '12px' }}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setExpandedView(!expandedView)}
            className="btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px', marginRight: '12px' }}
          >
            {expandedView ? '📋 Compact View' : '📖 Expanded View'}
          </button>
          <button
            onClick={() => setShowNotesPage(true)}
            className="btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px', marginRight: '12px' }}
          >
            📝 Notes
          </button>
          <button
            onClick={() => setShowInterviewTracker(true)}
            className="btn-secondary"
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            📅 Interview Tracker
          </button>
        </div>

{showForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="form-header">
              <h3>🚀 Add New Application</h3>
              <p>Track your next career opportunity</p>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="quickAdder"
                  checked={quickAdder}
                  onChange={e => setQuickAdder(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="quickAdder" style={{ cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500' }}>
                  ⚡ Quick Adder (Company, Role, Status only)
                </label>
              </div>
            </div>
            <form onSubmit={handleSubmitApplication} className="job-form">
              <div className="form-group">
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Company</label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Role</label>
                <input
                  type="text"
                  placeholder="Role/Position title"
                  value={formData.role_title}
                  onChange={e => setFormData({...formData, role_title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="wishlist">🌟 Wishlist</option>
                  <option value="applied">📝 Applied</option>
                  <option value="oa">💻 Online Assessment</option>
                  <option value="interview">🎯 Interview</option>
                  <option value="offer">🎉 Offer</option>
                  <option value="rejected">❌ Rejected</option>
                  <option value="ghosted">👻 Ghosted</option>
                  <option value="accepted">✅ Accepted</option>
                  <option value="declined">🚫 Declined</option>
                </select>
              </div>
              {!quickAdder && (
                <>
                  <div className="form-group">
                    <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Location</label>
                    <input
                      type="text"
                      placeholder="Location (optional)"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Source</label>
                    <input
                      type="text"
                      placeholder="Source (e.g., LinkedIn, Indeed)"
                      value={formData.source}
                      onChange={e => setFormData({...formData, source: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Application Link</label>
                    <input
                      type="url"
                      placeholder="Application link (optional)"
                      value={formData.link}
                      onChange={e => setFormData({...formData, link: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Applied Date</label>
                    <input
                      type="date"
                      placeholder="Applied date"
                      value={formData.applied_at}
                      onChange={e => setFormData({...formData, applied_at: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Notes</label>
                    <textarea
                      placeholder="Add any notes about this application..."
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                    />
                  </div>
                </>
              )}
            </form>
            <div className="row" style={{ justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleSubmitApplication}
                disabled={busy || !formData.company || !formData.role_title}
                className="btn-primary"
              >
                {busy ? 'Saving...' : 'Add Application'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="card loading-state">
            <p>🍂 Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="card empty-state">
            <p>🍂 No applications yet. Add your first one to get started!</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="card empty-state">
            <p>🔍 No applications match your current filters. Try adjusting your search criteria.</p>
            <button onClick={clearFilters} className="btn-secondary" style={{ marginTop: '12px' }}>
              🗑️ Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredApplications.map(app => (
              <div key={app.id} className={`card application-card ${expandedView ? 'expanded' : 'compact'}`}>
                {editingApp && editingApp.id === app.id ? (
                  // Inline Edit Form
                  <div className="inline-edit-form">
                    <div className="form-header">
                      <h3>✏️ Edit Application</h3>
                      <p>Update your application details</p>
                    </div>
                    <form onSubmit={handleUpdateApplication} className="job-form">
                      <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Company</label>
                        <input
                          type="text"
                          placeholder="Company name"
                          value={formData.company}
                          onChange={e => setFormData({...formData, company: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Role</label>
                        <input
                          type="text"
                          placeholder="Role/Position title"
                          value={formData.role_title}
                          onChange={e => setFormData({...formData, role_title: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Status</label>
                        <select
                          value={formData.status}
                          onChange={e => setFormData({...formData, status: e.target.value})}
                          required
                        >
                          <option value="wishlist">🌟 Wishlist</option>
                          <option value="applied">📝 Applied</option>
                          <option value="oa">💻 Online Assessment</option>
                          <option value="interview">🎯 Interview</option>
                          <option value="offer">🎉 Offer</option>
                          <option value="rejected">❌ Rejected</option>
                          <option value="ghosted">👻 Ghosted</option>
                          <option value="accepted">✅ Accepted</option>
                          <option value="declined">🚫 Declined</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Location</label>
                        <input
                          type="text"
                          placeholder="Location (optional)"
                          value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Source</label>
                        <input
                          type="text"
                          placeholder="Source (e.g., LinkedIn, Indeed)"
                          value={formData.source}
                          onChange={e => setFormData({...formData, source: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Application Link</label>
                        <input
                          type="url"
                          placeholder="Application link (optional)"
                          value={formData.link}
                          onChange={e => setFormData({...formData, link: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Applied Date</label>
                        <input
                          type="date"
                          placeholder="Applied date"
                          value={formData.applied_at}
                          onChange={e => setFormData({...formData, applied_at: e.target.value})}
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Notes</label>
                        <textarea
                          placeholder="Add any notes about this application..."
                          value={formData.notes}
                          onChange={e => setFormData({...formData, notes: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </form>
                    <div className="row" style={{ justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                      <button onClick={handleCancel} className="btn-secondary">
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdateApplication}
                        disabled={busy || !formData.company || !formData.role_title}
                        className="btn-primary"
                      >
                        {busy ? 'Saving...' : 'Update Application'}
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal View
                  expandedView ? (
                    // Expanded View - Full Details
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3>{app.role_title}</h3>
                        <p className="company">{app.company}</p>
                        {app.location && (
                          <p className="meta">📍 {app.location}</p>
                        )}
                        {app.source && (
                          <p className="meta">📋 Applied via {app.source}</p>
                        )}
                        {app.applied_at && (
                          <p className="meta">📅 Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                        )}
                        {app.notes && (
                          <div className="notes">{app.notes}</div>
                        )}
                        <div className="row" style={{ gap: '12px', marginTop: '16px' }}>
                          <span 
                            className={`status-badge status-${app.status}`}
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                          {app.link && (
                            <a 
                              href={app.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                fontSize: '14px', 
                                color: 'var(--accent-primary)',
                                textDecoration: 'none',
                                fontWeight: '600'
                              }}
                            >
                              🔗 View Application
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="row" style={{ gap: '8px' }}>
                        <button 
                          onClick={() => handleEdit(app)}
                          disabled={editingApp}
                          className="btn-secondary"
                          style={{ fontSize: '12px', padding: '8px 12px' }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteApplication(app.id)}
                          disabled={busy}
                          className="btn-danger"
                          style={{ fontSize: '12px', padding: '8px 12px' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Compact View - Just Job Name and Status
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{app.role_title}</h3>
                        <p className="company" style={{ margin: '0', fontSize: '0.9rem' }}>{app.company}</p>
                      </div>
                      <div className="row" style={{ gap: '12px', alignItems: 'center' }}>
                        <span 
                          className={`status-badge status-${app.status}`}
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        <div className="row" style={{ gap: '6px' }}>
                          <button 
                            onClick={() => handleEdit(app)}
                            disabled={editingApp}
                            className="btn-secondary"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteApplication(app.id)}
                            disabled={busy}
                            className="btn-danger"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}
        
        <SettingsModal 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currentTheme={theme}
          onThemeChange={setTheme}
        />
        <AnalyticsModal 
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          applications={applications}
        />
      </div>
    </>
  );
}

