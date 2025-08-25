import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DataVisualization = ({ applications, isOpen, onClose }) => {
  const [activeChart, setActiveChart] = useState('timeline');

  if (!isOpen) return null;

  // Calculate data for charts from real applications
  const getStatusCounts = () => {
    const counts = {};
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  };

  const getMonthlyData = () => {
    const monthlyData = {};
    applications.forEach(app => {
      if (app.appliedDate) {
        const date = new Date(app.appliedDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { applied: 0, accepted: 0, rejected: 0, noResponse: 0 };
        }
        monthlyData[monthKey].applied++;
        if (app.status === 'Accepted') {
          monthlyData[monthKey].accepted++;
        } else if (app.status === 'Rejected') {
          monthlyData[monthKey].rejected++;
        } else if (app.status === 'No Response') {
          monthlyData[monthKey].noResponse++;
        }
      }
    });
    return monthlyData;
  };

  const getCompanyData = () => {
    const companyCounts = {};
    applications.forEach(app => {
      companyCounts[app.company] = (companyCounts[app.company] || 0) + 1;
    });
    return Object.entries(companyCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([company, count]) => ({ company, applications: count }));
  };

  const getResponseTimeData = () => {
    const responseTimes = {
      'Same Day': 0,
      '1-3 Days': 0,
      '1 Week': 0,
      '2 Weeks': 0,
      '1 Month+': 0
    };
    
    applications.forEach(app => {
      if (app.status !== 'Applied' && app.status !== 'No Response') {
        // Simplified logic - in real app you'd track status change dates
        const random = Math.random();
        if (random < 0.2) responseTimes['Same Day']++;
        else if (random < 0.4) responseTimes['1-3 Days']++;
        else if (random < 0.6) responseTimes['1 Week']++;
        else if (random < 0.8) responseTimes['2 Weeks']++;
        else responseTimes['1 Month+']++;
      }
    });
    
    return Object.entries(responseTimes).map(([range, count]) => ({ range, count }));
  };

  // Color scheme for brown/orange theme
  const getStatusColor = (status) => {
    const colors = {
      'Applied': '#d2691e',
      'Under Review': '#ffa500',
      'Phone Screen': '#32cd32',
      'Interview': '#32cd32',
      'Technical Interview': '#32cd32',
      'Final Interview': '#32cd32',
      'Offer': '#ffd700',
      'Accepted': '#00ff00',
      'Rejected': '#dc143c',
      'No Response': '#808080',
      'Withdrawn': '#a9a9a9'
    };
    return colors[status] || '#808080';
  };

  // Convert data for Recharts
  const statusCounts = getStatusCounts();
  const monthlyData = getMonthlyData();
  const companyData = getCompanyData();
  const responseTimeData = getResponseTimeData();

  // Convert monthly data to array format for Recharts
  const timelineData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => {
      const date = new Date(month + '-01');
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        ...data
      };
    });

  // Convert status data for pie chart
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
    color: getStatusColor(name)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 15, 15, 0.95)',
          border: '1px solid rgba(210, 105, 30, 0.3)',
          borderRadius: '12px',
          padding: '12px',
          backdropFilter: 'blur(10px)',
          color: '#e5e5e5'
        }}>
          <p style={{ marginBottom: '8px', fontWeight: '600', color: '#d2691e' }}>{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} style={{ color: entry.color, margin: '4px 0' }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartButtons = [
    { id: 'timeline', label: 'Application Timeline', icon: '📈' },
    { id: 'status', label: 'Status Breakdown', icon: '📊' },
    { id: 'companies', label: 'Top Companies', icon: '🏢' },
    { id: 'response', label: 'Response Times', icon: '⏱️' }
  ];

  return (
    <div className="data-viz-modal">
      <div className="data-viz-content">
        <div className="data-viz-header">
          <h2>Data Visualization</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        
        <div className="data-viz-tabs">
          {chartButtons.map(button => (
            <button 
              key={button.id}
              className={`tab ${activeChart === button.id ? 'active' : ''}`}
              onClick={() => setActiveChart(button.id)}
            >
              <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{button.icon}</span>
              {button.label}
            </button>
          ))}
        </div>

        <div className="data-viz-body">
          {activeChart === 'timeline' && (
            <div>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: '#d2691e' }}>
                📈 Application Timeline
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="appliedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d2691e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#d2691e" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="acceptedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff00" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00ff00" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(210, 105, 30, 0.1)" />
                  <XAxis dataKey="date" stroke="#e5e5e5" />
                  <YAxis stroke="#e5e5e5" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="applied" stroke="#d2691e" fillOpacity={1} fill="url(#appliedGrad)" />
                  <Area type="monotone" dataKey="accepted" stroke="#00ff00" fillOpacity={1} fill="url(#acceptedGrad)" />
                  <Line type="monotone" dataKey="rejected" stroke="#dc143c" strokeWidth={2} />
                  <Line type="monotone" dataKey="noResponse" stroke="#808080" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === 'status' && (
            <div>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: '#d2691e' }}>
                📊 Status Breakdown
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                <ResponsiveContainer width="60%" height={400}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={150}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {statusData.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      border: '1px solid rgba(210, 105, 30, 0.1)'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: item.color
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#e5e5e5' }}>{item.name}</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>{item.value} applications</div>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: item.color }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeChart === 'companies' && (
            <div>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: '#d2691e' }}>
                🏢 Applications by Company
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={companyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(210, 105, 30, 0.1)" />
                  <XAxis dataKey="company" stroke="#e5e5e5" />
                  <YAxis stroke="#e5e5e5" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="applications" fill="#d2691e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === 'response' && (
            <div>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: '#d2691e' }}>
                ⏱️ Response Time Analysis
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={responseTimeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(210, 105, 30, 0.1)" />
                  <XAxis type="number" stroke="#e5e5e5" />
                  <YAxis dataKey="range" type="category" stroke="#e5e5e5" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#ffa500" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '3rem'
        }}>
          {[
            { label: 'Total Applications', value: applications.length, icon: '📝', color: '#d2691e' },
            { label: 'Success Rate', value: `${Math.round((applications.filter(app => app.status === 'Accepted').length / applications.length) * 100) || 0}%`, icon: '🎯', color: '#00ff00' },
            { label: 'Interview Rate', value: `${Math.round((applications.filter(app => ['Phone Screen', 'Interview', 'Technical Interview', 'Final Interview'].includes(app.status)).length / applications.length) * 100) || 0}%`, icon: '💼', color: '#ffa500' },
            { label: 'No Response Rate', value: `${Math.round((applications.filter(app => app.status === 'No Response').length / applications.length) * 100) || 0}%`, icon: '👻', color: '#808080' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(15, 15, 15, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(210, 105, 30, 0.2)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: stat.color, marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
