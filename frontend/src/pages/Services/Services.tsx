import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { servicesAPI } from '../../api';
import { useCart } from '../../hooks/useCart';
import '../../styles/catalog.css';
import '../../styles/components.css';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Painting', 'Gardening', 'Laundry'];

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { add } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const cat = params.get('category'); if (cat) setCategory(cat.charAt(0).toUpperCase() + cat.slice(1));
  }, [params]);

  useEffect(() => {
    setLoading(true);
    servicesAPI.getAll(category !== 'All' ? category : undefined)
      .then(r => setServices(r.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = services.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = (e: React.MouseEvent, s: any) => {
    e.stopPropagation();
    add({ id: s._id, type: 'service', name: s.title, price: s.basePrice, quantity: 1 });
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>Local Services</h1>
          <p>Book verified professionals from your neighborhood</p>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-search">
            <input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="catalog-tags" style={{ marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`tag ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div className="catalog-loading"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No services found</h3>
            <p>Try a different category</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(s => (
              <div className="card service-card" key={s._id} onClick={() => navigate(`/services/${s._id}`)}>
                <div className="service-header">
                  <div className="service-icon-wrap">
                    <span className="service-cat-label">{s.category?.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="service-title">{s.title}</div>
                    <div className="service-provider-name">{s.providerId?.expertiseArea || 'Local Pro'}</div>
                  </div>
                </div>
                <div className="service-body">
                  <div className="service-meta">
                    <span className="service-meta-item">{s.durationEst}</span>
                    {s.allowsSameDay && <span className="badge badge-green">Same day</span>}
                    {s.providerId?.averageRating > 0 && (
                      <span className="service-meta-item">{s.providerId.averageRating} / 5</span>
                    )}
                  </div>
                  <div className="service-footer">
                    <span className="service-price">₹{s.basePrice}</span>
                    <button className="btn btn-primary btn-sm" onClick={e => handleBook(e, s)}>Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
