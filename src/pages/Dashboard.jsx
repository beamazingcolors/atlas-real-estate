import React from 'react';
import TopBar from '../components/TopBar';
import MetricCard from '../components/MetricCard';
import LeadTable from '../components/LeadTable';

const Dashboard = () => {
  return (
    <div className="main-content">
      <TopBar />
      
      <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Bienvenido a Atlas, Alexis
        </h1>
        <p>Aquí tienes el resumen de tu operación inmobiliaria de hoy.</p>
      </div>

      <div className="metrics-grid">
        <MetricCard title="Nuevos Leads" value="124" trend="+12%" isPositive={true} delayClass="" />
        <MetricCard title="Cierres Mes Actual" value="$4.2M" trend="+5.4%" isPositive={true} delayClass="delay-100" />
        <MetricCard title="Inventario Activo" value="342" trend="-2%" isPositive={false} delayClass="delay-200" />
      </div>

      <LeadTable />
    </div>
  );
};

export default Dashboard;
