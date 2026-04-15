import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth.css';

const ROLES = [
  { value: 'customer', label: 'Customer' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'service_provider', label: 'Provider' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.token, data.user);
      const role = data.user.role;
      if (role === 'vendor') navigate('/vendor');
      else if (role === 'service_provider') navigate('/provider');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-logo">Local<span>Link</span></div>
        <div className="auth-left-content">
          <h2 className="auth-left-title">Join your digital neighborhood</h2>
          <p className="auth-left-sub">Whether you're a customer, vendor, or service professional — LocalLink has a place for you.</p>
          <div className="auth-perks">
            {[['List your shop or services'], ['Real-time dashboard & analytics'], ['Reach customers within 5km']].map(([text]) => (
              <div className="auth-perk" key={text}>
                <div className="auth-perk-dot" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-form-title">Create account</h1>
          <p className="auth-form-sub">Start in under a minute.</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>I am a...</label>
              <div className="role-select">
                {ROLES.map(r => (
                  <div
                    key={r.value}
                    className={`role-option ${form.role === r.value ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                  >
                    <div className="role-name">{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label>Full name</label>
              <input className="input" placeholder="Your full name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
