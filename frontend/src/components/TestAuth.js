import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const TestAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
      setLoading(false);
    }
  };

  const testSignup = async () => {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    const testUsername = `testuser${Date.now()}`;

    try {
      setTestResults(prev => [...prev, `Testing signup with: ${testEmail}`]);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            username: testUsername
          }
        }
      });

      if (error) {
        setTestResults(prev => [...prev, `Signup error: ${error.message}`]);
      } else {
        setTestResults(prev => [...prev, `Signup successful: ${data.user?.email}`]);
      }
    } catch (error) {
      setTestResults(prev => [...prev, `Signup exception: ${error.message}`]);
    }
  };

  const testLogout = async () => {
    try {
      setTestResults(prev => [...prev, 'Testing logout...']);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setTestResults(prev => [...prev, `Logout error: ${error.message}`]);
      } else {
        setTestResults(prev => [...prev, 'Logout successful']);
      }
    } catch (error) {
      setTestResults(prev => [...prev, `Logout exception: ${error.message}`]);
    }
  };

  const checkUsersTable = async () => {
    try {
      setTestResults(prev => [...prev, 'Checking users table...']);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(5);

      if (error) {
        setTestResults(prev => [...prev, `Users table error: ${error.message}`]);
      } else {
        setTestResults(prev => [...prev, `Users table has ${data.length} records`]);
        if (data.length > 0) {
          setTestResults(prev => [...prev, `Sample user: ${data[0].email}`]);
        }
      }
    } catch (error) {
      setTestResults(prev => [...prev, `Users table exception: ${error.message}`]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
      <h3>Authentication Test Panel</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Current User:</strong> {user ? user.email : 'Not logged in'}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testSignup} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Test Signup
        </button>
        <button onClick={testLogout} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Test Logout
        </button>
        <button onClick={checkUsersTable} style={{ padding: '8px 16px' }}>
          Check Users Table
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px', maxHeight: '300px', overflowY: 'auto' }}>
        <strong>Test Results:</strong>
        {testResults.map((result, index) => (
          <div key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestAuth;
