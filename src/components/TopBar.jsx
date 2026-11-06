import React from 'react';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Buscar desarrollos, clientes o leads..." 
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="glass glass-hover" style={{ padding: '0.5rem', background: 'transparent', cursor: 'pointer', border: 'none', color: 'var(--text-secondary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>
        <div className="user-profile flex items-center gap-2" style={{ cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-gold), #8a704c)' }}></div>
          <div className="flex-col">
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Alexis Garzon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
