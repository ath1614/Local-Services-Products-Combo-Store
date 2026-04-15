import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ordersAPI } from '../../api';
import '../../styles/dashboard.css';
import '../../styles/components.css';

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-gray', paid: 'badge-green', completed: 'badge-green', cancelled: 'badge-gray', shipped: 'badge-orange',
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    ordersAPI.getMine().then(r => setOrders(r.data)).catch(() => {});
  }, []);

  const active = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const spent = orders.filter(o => o.status !== 'cancelled').reduce((s: number, o: any) => s + o.totalAmount, 0);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Hello, {user?.name?.split(' ')[0]}</h1>
          <p>Here's what's happening with your orders</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-card-label">Total Orders</div><div className="stat-card-value">{orders.length}</div></div>
          <div className="stat-card"><div className="stat-card-label">Active</div><div className="stat-card-value">{active.length}</div></div>
          <div className="stat-card"><div className="stat-card-label">Total Spent</div><div className="stat-card-value">₹{spent}</div></div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-title">
            Recent Orders
            <Link to="/orders" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {orders.length === 0 ? (
            <div className="empty-state">
              <p>No orders yet. <Link to="/products">Start shopping</Link></p>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 600 }}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td>{o.items.length} item{o.items.length > 1 ? 's' : ''}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{o.totalAmount}</td>
                      <td><span className={`badge ${STATUS_COLORS[o.status] || 'badge-gray'}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
          <Link to="/services" className="btn btn-outline">Book a Service</Link>
        </div>
      </div>
    </div>
  );
}
