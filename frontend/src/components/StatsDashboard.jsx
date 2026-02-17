import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatsDashboard = ({ refreshTrigger }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/tickets/stats/');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };
        fetchStats();
    }, [refreshTrigger]);

    if (!stats) return <div className="loading">Loading stats...</div>;

    const priorityData = Object.entries(stats.priority_breakdown).map(([key, value]) => ({
        name: key,
        value: value,
    }));

    const categoryData = Object.entries(stats.category_breakdown).map(([key, value]) => ({
        name: key,
        value: value,
    }));

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

    return (
        <div className="grid grid-cols-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
                <h3>Total Tickets</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {stats.total_tickets}
                </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
                <h3>Open Tickets</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                    {stats.open_tickets}
                </div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
                <h3>Avg / Day</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    {stats.avg_tickets_per_day}
                </div>
            </div>

            <div className="card" style={{ gridColumn: 'span 2' }}>
                <h3>Priority Breakdown</h3>
                <div style={{ height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityData}>
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Bar dataKey="value" fill="#8884d8">
                                {priorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card" style={{ gridColumn: 'span 2' }}>
                <h3>Category Breakdown</h3>
                <div style={{ height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <XAxis dataKey="name" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Bar dataKey="value" fill="#82ca9d">
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
