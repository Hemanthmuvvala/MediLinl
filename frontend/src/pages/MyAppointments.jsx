import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP = {
  Pending: 'badge-pending',
  Confirmed: 'badge-confirmed',
  Cancelled: 'badge-cancelled',
};

export default function MyAppointments() {
  const user = JSON.parse(localStorage.getItem('bad_user') || 'null');
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    fetch(`/api/appointments/patient/${user._id}`)
      .then((r) => r.json())
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, [user._id]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg({ type: 'success', text: '✅ Appointment cancelled.' });
        setAppointments((prev) => prev.filter((a) => a._id !== id));
      } else {
        setMsg({ type: 'error', text: '❌ Failed to cancel appointment.' });
      }
    } catch {
      setMsg({ type: 'error', text: '❌ Server error.' });
    } finally {
      setDeletingId(null);
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    }
  };

  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === 'Confirmed').length;
  const pending = appointments.filter((a) => a.status === 'Pending').length;
  const cancelled = appointments.filter((a) => a.status === 'Cancelled').length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>📋 My Appointments</h1>
        <p>Track all your upcoming and past medical appointments</p>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div className="stat-num">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-num" style={{ color: 'var(--success)' }}>{confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-num" style={{ color: 'var(--pending)' }}>{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">❌</span>
          <div className="stat-num" style={{ color: 'var(--danger)' }}>{cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      {msg.text && (
        <div className={`alert alert-${msg.type}`}>{msg.text}</div>
      )}

      {/* Book New Button */}
      <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/home')}
        >
          + Book New Appointment
        </button>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No appointments yet</h3>
          <p>Browse doctors and book your first appointment!</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/home')}
            style={{ marginTop: '1rem' }}
          >
            Browse Doctors
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Date</th>
                <th>Time</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, idx) => (
                <tr key={appt._id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                  <td>
                    <strong>Dr. {appt.doctorId?.name || 'N/A'}</strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {appt.doctorId?.specialty || '—'}
                    </span>
                  </td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>₹{appt.doctorId?.consultationFee || '—'}</td>
                  <td>
                    <span className={`badge ${STATUS_MAP[appt.status]}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    {appt.status !== 'Cancelled' && (
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={deletingId === appt._id}
                        onClick={() => handleDelete(appt._id)}
                      >
                        {deletingId === appt._id ? '⏳' : '✕ Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
