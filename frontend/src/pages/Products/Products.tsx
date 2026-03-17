import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productsAPI } from '../../api';
import { useCart } from '../../hooks/useCart';
import '../../styles/catalog.css';
import '../../styles/components.css';

const CATEGORIES = ['All', 'Groceries', 'Electronics', 'Pharmacy', 'Hardware', 'Clothing'];
const ICONS: Record<string, string> = { Groceries: '🛒', Electronics: '📱', Pharmacy: '💊', Hardware: '🔩', Clothing: '👕' };

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { add } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const q = params.get('q'); if (q) setSearch(q);
    const cat = params.get('category'); if (cat) setCategory(cat.charAt(0).toUpperCase() + cat.slice(1));
  }, [params]);

  useEffect(() => {
    setLoading(true);
    productsAPI.getAll(category !== 'All' ? category : undefined)
      .then(r => setProducts(r.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.MouseEvent, p: any) => {
    e.stopPropagation();
    add({ id: p._id, type: 'product', name: p.name, price: p.price, quantity: 1, imageUrl: p.imageUrl });
  };

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>Local Products</h1>
          <p>Fresh goods from verified neighborhood vendors</p>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-search">
            <span>🔍</span>
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
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
            <div className="icon">📦</div>
            <h3>No products found</h3>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => (
              <div className="card product-card" key={p._id} onClick={() => navigate(`/products/${p._id}`)}>
                <div className="product-img">{ICONS[p.category] || '📦'}</div>
                <div className="product-info">
                  <div className="product-vendor">{p.vendorId?.shopName || 'Local Vendor'}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-footer">
                    <span className="product-price">₹{p.price}</span>
                    <button className="btn btn-accent btn-sm" onClick={e => handleAdd(e, p)}>+ Cart</button>
                  </div>
                  <div className="product-stock">{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
