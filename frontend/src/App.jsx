import { useState } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import StatsDashboard from './components/StatsDashboard';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTicketCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Support Ticket System</h1>
        <p style={{ color: 'var(--text-secondary)' }}>AI-Powered Ticket Classification &
          Management</p>
      </header>

      <StatsDashboard refreshTrigger={refreshTrigger} />

      <div className="grid" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div>
          <TicketForm onTicketCreated={handleTicketCreated} />
        </div>
        <div>
          <TicketList refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {/* Mobile responsive tweak: allow wrapping */}
      <style>{`
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default App;
