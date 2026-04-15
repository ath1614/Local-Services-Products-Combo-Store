import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { productsAPI } from '../../api';
import '../../styles/dashboard.css';
import '../../styles/components.css';

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category: '', imageUrl: '' };

export default function VendorDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => productsAPI.getMine().then(r => setProducts(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) await productsAPI.update(editing, payload);
      else await productsAPI.create(payload);
      setShowModal(false); setForm(EMPTY_FORM); setEditing(null); load();
    } catch { } finally { setLoading(false); }
  };

  const handleEdit = (p: any) => {
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, imageUrl: p.imageUrl || '' });
    setEditing(p._id); setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this product?')) return;
    await productsAPI.delete(id); load();
  };

  const revenue = products.reduce((s, p) => s + p.price * (100 - p.stock), 0);

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Vendor Dashboard</h1>
          <p>Welcome back, {user?.name?.split(' ')[0]}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-card-label">Products</div><div className="stat-card-value">{products.length}</div></div>
          <div className="stat-card"><div className="stat-card-label">Active</div><div className="stat-card-value">{products.filter(p => p.isActive).length}</div></div>
          <div className="stat-card"><div className="stat-card-label">Est. Revenue</div><div className="stat-card-value">₹{revenue.toLocaleString()}</div></div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-title">
            My Products
            <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY_FORM); setEditing(null); setShowModal(true); }}>+ Add Product</button>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {products.length === 0 ? (
              <div className="empty-state"><p>No products yet. Add your first one!</p></div>
            ) : (
              <table className="data-table">
                <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>{p.category}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{p.price}</td>
                      <td>{p.stock}</td>
                      <td><span className={`badge ${p.isActive ? 'badge-green' : 'badge-gray'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: '#c0392b' }} onClick={() => handleDelete(p._id)}>Remove</button>
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
            <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              {[['name','Product name','text'],['category','Category','text'],['price','Price (₹)','number'],['stock','Stock quantity','number'],['imageUrl','Image URL (optional)','text']].map(([k,l,t]) => (
                <div className="input-group" key={k}>
                  <label>{l}</label>
                  <input className="input" type={t} placeholder={l} value={(form as any)[k]}
                    onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} required={k !== 'imageUrl'} />
                </div>
              ))}
              <div className="input-group">
                <label>Description</label>
                <input className="input" placeholder="Short description" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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
