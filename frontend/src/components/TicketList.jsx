import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

const TicketList = ({ refreshTrigger }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        search: '',
    });

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            if (filters.category) params.category = filters.category;
            if (filters.search) params.search = filters.search;

            const response = await api.get('/tickets/', { params });
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filters, refreshTrigger]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const statusColors = {
        open: 'status-open',
        in_progress: 'status-in_progress',
        resolved: 'status-resolved',
        closed: 'status-closed',
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Tickets</h2>
                <button onClick={fetchTickets} className="btn-icon">
                    <RefreshCw size={18} />
                </button>
            </div>

            <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search..."
                            className="form-control"
                            style={{ paddingLeft: '35px' }}
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <select name="status" className="form-control" onChange={handleFilterChange}>
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
                <select name="priority" className="form-control" onChange={handleFilterChange}>
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
                <select name="category" className="form-control" onChange={handleFilterChange}>
                    <option value="">All Categories</option>
                    <option value="billing">Billing</option>
                    <option value="technical">Technical</option>
                    <option value="account">Account</option>
                    <option value="general">General</option>
                </select>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    <AlertCircle size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
                    No tickets found.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--text-secondary)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem' }}>Title</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem' }}>Priority</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>{ticket.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {ticket.description}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{ticket.category}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            color: ticket.priority === 'critical' ? 'var(--danger)' :
                                                ticket.priority === 'high' ? 'var(--warning)' : 'inherit',
                                            fontWeight: 'bold'
                                        }}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`status-badge ${statusColors[ticket.status]}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TicketList;
