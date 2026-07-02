import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('bad_user') || 'null');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('bad_user');
    // replace:true clears the history stack so back-arrow can't re-enter protected pages
    navigate('/login', { replace: true });
  };

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const roleLabel = {
    patient: '🧑‍⚕️ Patient',
    doctor: '👨‍⚕️ Doctor',
    admin: '🛡️ Admin',
  }[user?.role] || '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🏥</span>
        <span>Book a Doctor</span>
      </Link>

      <ul className="navbar-links">
        {user?.role === 'patient' && (
          <>
            <li><Link to="/home">🏠 Home</Link></li>
            <li><Link to="/my-appointments">📋 My Appointments</Link></li>
          </>
        )}
        {user?.role === 'doctor' && (
          <li><Link to="/doctor">📊 Dashboard</Link></li>
        )}
        {user?.role === 'admin' && (
          <li><Link to="/admin">⚙️ Admin Panel</Link></li>
        )}

        {user && (
          <>
            {/* User chip */}
            <li>
              <span className="nav-user">
                <span className="avatar">{getInitials(user.name)}</span>
                <span className="nav-user-info">
                  <span className="nav-user-name">{user.name}</span>
                  <span className="nav-user-role">{roleLabel}</span>
                </span>
              </span>
            </li>

            {/* Logout button — always visible */}
            <li>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="btn-logout-pill"
                title="Logout"
              >
                <span>⏻</span>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

