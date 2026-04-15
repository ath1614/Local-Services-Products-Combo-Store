import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/landing.css';

const CATEGORIES = [
  { label: 'Groceries', type: 'product' },
  { label: 'Plumbing', type: 'service' },
  { label: 'Electrical', type: 'service' },
  { label: 'Cleaning', type: 'service' },
  { label: 'Pharmacy', type: 'product' },
  { label: 'Painting', type: 'service' },
  { label: 'Electronics', type: 'product' },
  { label: 'Gardening', type: 'service' },
];

export default function Landing() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-eyebrow">Hyperlocal Marketplace</div>
            <h1 className="hero-title">
              Your neighborhood,<br />
              <span className="highlight">one tap away</span>
            </h1>
            <p className="hero-sub">
              Buy products and book services from verified local vendors — all in a single cart, single checkout.
            </p>
            <div className="hero-cta">
              <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
              <Link to="/services" className="btn btn-outline btn-lg">Find Services</Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item"><span className="stat-num">500+</span><span className="stat-label">Local Vendors</span></div>
              <div className="stat-item"><span className="stat-num">2k+</span><span className="stat-label">Services Listed</span></div>
              <div className="stat-item"><span className="stat-num">60min</span><span className="stat-label">Avg Response</span></div>
            </div>
          </div>

          <div className="hero-visual">
            {[
              { title: 'Plumber Booked', sub: 'Arrives in 45 min', price: '₹299' },
              { title: 'Groceries', sub: 'Fresh & local', price: '₹840' },
              { title: 'Electrician', sub: 'Verified pro', price: '₹499' },
              { title: 'Deep Clean', sub: '3hr session', price: '₹699' },
            ].map((c, i) => (
              <div className="hero-card" key={i}>
                <div className="hero-card-title">{c.title}</div>
                <div className="hero-card-sub">{c.sub}</div>
                <div className="hero-card-price">{c.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for groceries, plumber, electrician..."
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Explore</div>
            <h2 className="section-title">What do you need today?</h2>
            <p className="section-sub">Products delivered. Services booked. All from your neighborhood.</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.label}
                to={`/${cat.type === 'product' ? 'products' : 'services'}?category=${cat.label.toLowerCase()}`}
                className="category-card"
              >
                <span className="category-name">{cat.label}</span>
                <span className="category-count">{cat.type === 'product' ? 'Products' : 'Services'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-title">Simple as 1, 2, 3</h2>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', title: 'Browse & Discover', desc: 'Search for products or services near you. Filter by category, rating, or availability.' },
              { n: '02', title: 'Add to Unified Cart', desc: 'Mix products and service bookings in one cart. Schedule services at your preferred time.' },
              { n: '03', title: 'Checkout & Relax', desc: 'Single payment for everything. Track your delivery and service provider in real time.' },
            ].map(s => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-banner">
            <div>
              <h2 className="cta-title">Are you a local vendor or service pro?</h2>
              <p className="cta-sub">Join LocalLink and reach thousands of customers in your neighborhood.</p>
            </div>
            <Link to="/register" className="btn btn-white btn-lg">Join as Vendor</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <div className="footer-logo">Local<span>Link</span></div>
              <div className="footer-tagline">Your digital neighborhood store.</div>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Explore</h4>
                <Link to="/products">Products</Link>
                <Link to="/services">Services</Link>
              </div>
              <div className="footer-col">
                <h4>Join</h4>
                <Link to="/register">As Customer</Link>
                <Link to="/register">As Vendor</Link>
                <Link to="/register">As Provider</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">© 2026 LocalLink. Built for the neighborhood.</div>
        </div>
      </footer>
    </>
  );
}
