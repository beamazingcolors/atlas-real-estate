import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;
