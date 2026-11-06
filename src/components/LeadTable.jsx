import React from 'react';

const leads = [
  { id: 1, name: 'Carlos Mendoza', project: 'Nautica Torre A', status: 'Negociación', date: '23 Jul 2026', type: 'warning' },
  { id: 2, name: 'Sofia Real', project: 'Casa Akumal', status: 'Cerrado', date: '21 Jul 2026', type: 'success' },
  { id: 3, name: 'Luis Paredes', project: 'Distrito Financiero', status: 'Primer Contacto', date: '20 Jul 2026', type: 'warning' },
  { id: 4, name: 'Mariana Lopez', project: 'Nautica Torre B', status: 'Documentación', date: '18 Jul 2026', type: 'warning' },
];

const LeadTable = () => {
  return (
    <div className="data-table-container glass animate-fade-in delay-300">
      <h3 className="section-title">Leads Recientes</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Desarrollo de Interés</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="glass-hover">
              <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{lead.name}</td>
              <td>{lead.project}</td>
              <td>{lead.date}</td>
              <td>
                <span className={`badge badge-${lead.type}`}>{lead.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
