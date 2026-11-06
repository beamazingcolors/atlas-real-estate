import React from 'react';

const MetricCard = ({ title, value, trend, isPositive, delayClass }) => {
  return (
    <div className={`metric-card glass animate-fade-in ${delayClass}`}>
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-trend flex items-center gap-2" style={{ color: isPositive ? 'var(--status-success)' : 'var(--status-danger)' }}>
        {isPositive ? (
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
        ) : (
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
        )}
        {trend} vs mes anterior
      </div>
    </div>
  );
};

export default MetricCard;
