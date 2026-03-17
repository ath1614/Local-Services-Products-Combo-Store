import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import '../../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };
  const isActive = (path: string) => location.pathname.startsWith(path) ? 'active' : '';

  const dashPath = user?.role === 'vendor' ? '/vendor' : user?.role === 'service_provider' ? '/provider' : user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          Local<span>Link</span>
        </Link>

        <ul className="navbar-links">
          <li><Link to="/products" className={isActive('/products')}>Products</Link></li>
          <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
          {user && <li><Link to="/orders" className={isActive('/orders')}>My Orders</Link></li>}
        </ul>

        <div className="navbar-actions">
          {user && (
            <button className="cart-btn" onClick={() => navigate('/cart')}>
              🛒 Cart
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
          )}

          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setOpen(o => !o)}>
                {user.name.split(' ')[0]} ▾
              </button>
              {open && (
                <div className="user-dropdown">
                  <Link to={dashPath} onClick={() => setOpen(false)}>Dashboard</Link>
                  <div className="dropdown-divider" />
                  <button className="logout" onClick={handleLogout}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
