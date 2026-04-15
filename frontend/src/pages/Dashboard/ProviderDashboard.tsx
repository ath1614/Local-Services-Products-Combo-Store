import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { servicesAPI } from '../../api';
import '../../styles/dashboard.css';
import '../../styles/components.css';

const EMPTY_FORM = { title: '', description: '', basePrice: '', durationEst: '1 hour', category: '', allowsSameDay: false };

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => servicesAPI.getMine().then(r => setServices(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...form, basePrice: Number(form.basePrice) };
      if (editing) await servicesAPI.update(editing, payload);
      else await servicesAPI.create(payload);
      setShowModal(false); setForm(EMPTY_FORM); setEditing(null); load();
    } catch { } finally { setLoading(false); }
  };

  const handleEdit = (s: any) => {
    setForm({ title: s.title, description: s.description, basePrice: s.basePrice, durationEst: s.durationEst, category: s.category, allowsSameDay: s.allowsSameDay });
    setEditing(s._id); setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this service?')) return;
    await servicesAPI.delete(id); load();
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Provider Dashboard</h1>
          <p>Manage your services, {user?.name?.split(' ')[0]}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-card-label">Services</div><div className="stat-card-value">{services.length}</div></div>
          <div className="stat-card"><div className="stat-card-label">Active</div><div className="stat-card-value">{services.filter(s => s.isActive).length}</div></div>
          <div className="stat-card"><div className="stat-card-label">Same Day</div><div className="stat-card-value">{services.filter(s => s.allowsSameDay).length}</div></div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-title">
            My Services
            <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY_FORM); setEditing(null); setShowModal(true); }}>+ Add Service</button>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {services.length === 0 ? (
              <div className="empty-state"><p>No services yet. Add your first one!</p></div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Title</th><th>Category</th><th>Base Price</th><th>Duration</th><th>Same Day</th><th>Actions</th></tr></thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 600 }}>{s.title}</td>
                      <td>{s.category}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{s.basePrice}</td>
                      <td>{s.durationEst}</td>
                      <td><span className={`badge ${s.allowsSameDay ? 'badge-green' : 'badge-gray'}`}>{s.allowsSameDay ? 'Yes' : 'No'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(s)}>Edit</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: '#c0392b' }} onClick={() => handleDelete(s._id)}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Service' : 'Add Service'}</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              {[['title','Service title','text'],['category','Category','text'],['basePrice','Base price (₹)','number'],['durationEst','Duration estimate','text']].map(([k,l,t]) => (
                <div className="input-group" key={k}>
                  <label>{l}</label>
                  <input className="input" type={t} placeholder={l} value={form[k]}
                    onChange={e => setForm((f: any) => ({ ...f, [k]: e.target.value }))} required />
                </div>
              ))}
              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.allowsSameDay}
                    onChange={e => setForm((f: any) => ({ ...f, allowsSameDay: e.target.checked }))} />
                  Allow same-day booking
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
