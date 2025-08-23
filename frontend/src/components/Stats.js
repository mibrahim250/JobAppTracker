import React from 'react';

const Stats = ({ applications }) => {
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

  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-icon"><i className="fas fa-clipboard-list"></i></div>
        <div className="stat-number">{total}</div>
        <div className="stat-label">Total Applications</div>
      </div>
      <div className="stat-card pending">
        <div className="stat-icon"><i className="fas fa-clock"></i></div>
        <div className="stat-number">{pending}</div>
        <div className="stat-label">Pending</div>
      </div>
      <div className="stat-card interviews">
        <div className="stat-icon"><i className="fas fa-handshake"></i></div>
        <div className="stat-number">{interviews}</div>
        <div className="stat-label">Interviews</div>
      </div>
      <div className="stat-card rejected">
        <div className="stat-icon"><i className="fas fa-times-circle"></i></div>
        <div className="stat-number">{rejected}</div>
        <div className="stat-label">Rejected</div>
      </div>
    </div>
  );
};

export default Stats;
