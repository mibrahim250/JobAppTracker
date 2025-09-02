import React, { useEffect, useState } from 'react';
import { supabase } from './config/supabase';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  
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
    await supabase.auth.signOut();
    setApplications([]);
    setBusy(false);
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
  }

  const statusColors = {
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

  if (!user) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Job Application Tracker</h1>
          <p className="row">Supabase Auth • React 18</p>
        </header>

        <div className="card" style={{ maxWidth: 420 }}>
          <h3>{mode === 'signup' ? 'Create account' : 'Sign in'}</h3>
          <form onSubmit={handleAuth} className="row" style={{ flexDirection: 'column' }}>
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
              <button disabled={busy} type="submit">
                {busy ? 'Please wait…' : (mode === 'signup' ? 'Sign up' : 'Sign in')}
              </button>
              <button
                type="button"
                onClick={() => setMode(m => (m === 'signup' ? 'signin' : 'signup'))}
                disabled={busy}
              >
                {mode === 'signup' ? 'Have an account? Sign in' : 'New here? Sign up'}
              </button>
            </div>
          </form>
          {msg && <p style={{ opacity: 0.85 }}>{msg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Application Tracker</h1>
        <div className="row">
          <p>Welcome back, {user.email}</p>
          <button onClick={handleSignOut} disabled={busy}>
            Sign out
          </button>
        </div>
      </header>

      {msg && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <p style={{ margin: 0, opacity: 0.85 }}>{msg}</p>
        </div>
      )}

      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Your Applications ({applications.length})</h2>
        <button 
          onClick={() => setShowForm(true)}
          disabled={showForm || editingApp}
        >
          + Add Application
        </button>
      </div>

      {(showForm || editingApp) && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <h3>{editingApp ? 'Edit Application' : 'Add New Application'}</h3>
          <form onSubmit={editingApp ? handleUpdateApplication : handleSubmitApplication} className="row">
            <div className="row" style={{ flexDirection: 'column', flex: 1 }}>
              <input
                type="text"
                placeholder="Company name"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Role/Position title"
                value={formData.role_title}
                onChange={e => setFormData({...formData, role_title: e.target.value})}
                required
              />
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                required
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="oa">Online Assessment</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="ghosted">Ghosted</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div className="row" style={{ flexDirection: 'column', flex: 1 }}>
              <input
                type="text"
                placeholder="Location (optional)"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
              <input
                type="text"
                placeholder="Source (e.g., LinkedIn, Indeed)"
                value={formData.source}
                onChange={e => setFormData({...formData, source: e.target.value})}
              />
              <input
                type="url"
                placeholder="Application link (optional)"
                value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
              />
            </div>
            <div className="row" style={{ flexDirection: 'column', flex: 1 }}>
              <input
                type="date"
                placeholder="Applied date"
                value={formData.applied_at}
                onChange={e => setFormData({...formData, applied_at: e.target.value})}
              />
              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>
          </form>
          <div className="row" style={{ justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={handleCancel}>Cancel</button>
            <button 
              onClick={editingApp ? handleUpdateApplication : handleSubmitApplication}
              disabled={busy || !formData.company || !formData.role_title}
            >
              {busy ? 'Saving...' : (editingApp ? 'Update' : 'Add')}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card">
          <p>Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card">
          <p>No applications yet. Add your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applications.map(app => (
            <div key={app.id} className="card">
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{app.role_title}</h3>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{app.company}</p>
                  {app.location && <p style={{ margin: '0 0 4px 0', opacity: 0.7 }}>📍 {app.location}</p>}
                  {app.source && <p style={{ margin: '0 0 4px 0', opacity: 0.7 }}>📋 Applied via {app.source}</p>}
                  {app.applied_at && <p style={{ margin: '0 0 4px 0', opacity: 0.7 }}>📅 Applied {new Date(app.applied_at).toLocaleDateString()}</p>}
                  {app.notes && <p style={{ margin: '0 0 8px 0', opacity: 0.8 }}>{app.notes}</p>}
                  <div className="row" style={{ gap: '8px' }}>
                    <span 
                      style={{
                        backgroundColor: statusColors[app.status],
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    {app.link && (
                      <a 
                        href={app.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px', opacity: 0.8 }}
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
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteApplication(app.id)}
                    disabled={busy}
                    style={{ 
                      fontSize: '12px', 
                      padding: '6px 8px',
                      backgroundColor: '#dc2626',
                      borderColor: '#dc2626'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

