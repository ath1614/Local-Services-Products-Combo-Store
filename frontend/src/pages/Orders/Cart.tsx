import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { ordersAPI } from '../../api';
import '../../styles/cart.css';
import '../../styles/components.css';

export default function Cart() {
  const { items, remove, update, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    if (!address.trim()) { setError('Please enter a delivery address'); return; }
    setLoading(true); setError('');
    try {
      const orderItems = items.map(i => ({
        ...(i.type === 'product' ? { productId: i.id } : { serviceId: i.id }),
        quantity: i.quantity,
      }));
      await ordersAPI.create({ items: orderItems, deliveryAddress: address });
      clear();
      navigate('/orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally { setLoading(false); }
  };

  if (items.length === 0) return (
    <div className="cart-page">
      <div className="container">
        <div className="empty-state" style={{ paddingTop: 120 }}>
          <h3>Your cart is empty</h3>
          <p>Add some products or book a service</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
            <Link to="/services" className="btn btn-outline">Find Services</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Your Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-icon">
                  <span className="cart-item-type-label">{item.type === 'product' ? 'P' : 'S'}</span>
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-type">{item.type}</div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price} each</div>
                </div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => update(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => update(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="cart-remove" onClick={() => remove(item.id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            {items.map(i => (
              <div className="summary-row" key={i.id}>
                <span>{i.name} × {i.quantity}</span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <div className="cart-address">
              <div className="input-group">
                <label>Delivery Address</label>
                <input className="input" placeholder="Enter your full address" value={address}
                  onChange={e => setAddress(e.target.value)} />
              </div>
            </div>
            {error && <div className="auth-error" style={{ marginBottom: 8 }}>{error}</div>}
            <button className="btn btn-accent" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Placing order...' : `Place Order · ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
