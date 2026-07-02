import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint =
        role === 'doctor'
          ? `${API}/api/auth/doctor-login`
          : `${API}/api/auth/login`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...(role === 'admin' ? { expectedRole: 'admin' } : {}) }),
      });
      const data = await res.json();

      if (!res.ok) return setError(data.message || 'Login failed.');

      // For admin, check role
      if (role === 'admin' && data.user.role !== 'admin') {
        return setError('Access denied. Not an admin account.');
      }

      localStorage.setItem('bad_user', JSON.stringify(data.user));

      if (data.user.role === 'admin') navigate('/admin', { replace: true });
      else if (data.user.role === 'doctor') navigate('/doctor', { replace: true });
      else navigate('/home', { replace: true });
    } catch {
      setError('Server error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">
        <div className="auth-logo">
          <span className="logo-icon">🏥</span>
          <h2>Book a Doctor</h2>
        </div>

        <h1 className="form-title">Welcome back</h1>
        <p className="form-subtitle">Sign in to continue to your dashboard</p>

        {/* Role Selector */}
        <div className="role-selector">
          {[
            { id: 'patient', icon: '🧑‍⚕️', label: 'Patient' },
            { id: 'doctor', icon: '👨‍⚕️', label: 'Doctor' },
            { id: 'admin', icon: '🛡️', label: 'Admin' },
          ].map((r) => (
            <div
              key={r.id}
              className={`role-option ${role === r.id ? 'selected' : ''}`}
              onClick={() => setRole(r.id)}
            >
              <span className="role-icon">{r.icon}</span>
              <span className="role-label">{r.label}</span>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? '⏳ Signing in…' : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        {role === 'patient' && (
          <>
            <div className="form-divider">or</div>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <button className="form-link" onClick={() => navigate('/register')}>
                Register here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
