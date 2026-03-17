import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import '../../styles/dashboard.css';
import '../../styles/components.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.stats(), adminAPI.users()])
      .then(([s, u]) => { setStats(s.data); setUsers(u.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await adminAPI.deleteUser(id);
    setUsers(u => u.filter(x => x._id !== id));
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Platform overview and user management</p>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-card-icon">👥</div><div className="stat-card-label">Total Users</div><div className="stat-card-value">{stats.users}</div></div>
            <div className="stat-card"><div className="stat-card-icon">📦</div><div className="stat-card-label">Products</div><div className="stat-card-value">{stats.products}</div></div>
            <div className="stat-card"><div className="stat-card-icon">🛠️</div><div className="stat-card-label">Services</div><div className="stat-card-value">{stats.services}</div></div>
            <div className="stat-card"><div className="stat-card-icon">🛒</div><div className="stat-card-label">Orders</div><div className="stat-card-value">{stats.orders}</div></div>
            <div className="stat-card"><div className="stat-card-icon">💰</div><div className="stat-card-label">Revenue</div><div className="stat-card-value">₹{stats.revenue?.toLocaleString()}</div></div>
          </div>
        )}

        <div className="dashboard-section">
          <div className="dashboard-section-title">All Users</div>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-orange' : u.role === 'vendor' ? 'badge-green' : 'badge-gray'}`}>{u.role}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <button className="btn btn-ghost btn-sm" style={{ color: '#c0392b' }} onClick={() => handleDelete(u._id)}>Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
