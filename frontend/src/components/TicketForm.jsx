import { useState } from 'react';
import api from '../services/api';
import { Sparkles, Send, Loader2 } from 'lucide-react';

const TicketForm = ({ onTicketCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: '',
    });
    const [loading, setLoading] = useState(false);
    const [classifying, setClassifying] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = async () => {
        if (!formData.description || formData.category || formData.priority) return;

        setClassifying(true);
        try {
            const response = await api.post('/tickets/classify/', { description: formData.description });
            setFormData((prev) => ({
                ...prev,
                category: response.data.suggested_category || 'general',
                priority: response.data.suggested_priority || 'medium',
            }));
        } catch (error) {
            console.error('Classification failed', error);
        } finally {
            setClassifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Set defaults if empty
            const payload = {
                ...formData,
                category: formData.category || 'general',
                priority: formData.priority || 'low',
            };
            await api.post('/tickets/', payload);
            setFormData({ title: '', description: '', category: '', priority: '' });
            if (onTicketCreated) onTicketCreated();
        } catch (error) {
            console.error('Failed to create ticket', error);
            alert('Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['billing', 'technical', 'account', 'general'];
    const priorities = ['low', 'medium', 'high', 'critical'];

    return (
        <div className="card">
            <h2>Create New Ticket</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        placeholder="Brief summary of the issue"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Description
                        {classifying && <span className="text-secondary" style={{ marginLeft: '10px', fontSize: '0.8rem' }}><Loader2 className="animate-spin" size={12} style={{ display: 'inline' }} /> AI Classifying...</span>}
                    </label>
                    <textarea
                        name="description"
                        className="form-control"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        placeholder="Describe your issue in detail..."
                    />
                </div>

                <div className="grid grid-cols-2">
                    <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                            Category
                            {classifying && <Sparkles size={14} className="text-accent animate-pulse" />}
                        </label>
                        <select
                            name="category"
                            className="form-control"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label flex items-center gap-2">
                            Priority
                            {classifying && <Sparkles size={14} className="text-accent animate-pulse" />}
                        </label>
                        <select
                            name="priority"
                            className="form-control"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="">Select Priority</option>
                            {priorities.map((p) => (
                                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={18} style={{ marginRight: '8px' }} />}
                    Submit Ticket
                </button>
            </form>
        </div>
    );
};

export default TicketForm;
