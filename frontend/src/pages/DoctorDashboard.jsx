import { useState, useEffect, useCallback } from 'react';
import API from '../api';

const STATUS_MAP = {
  Pending: 'badge-pending',
  Confirmed: 'badge-confirmed',
  Cancelled: 'badge-cancelled',
};

export default function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem('bad_user') || 'null');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('All');

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    fetch(`${API}/api/appointments/doctor/${user._id}`)
      .then((r) => r.json())
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, [user._id]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API}/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
        setMsg({ type: 'success', text: `✅ Appointment ${status.toLowerCase()}.` });
      } else {
        setMsg({ type: 'error', text: data.message || '❌ Update failed.' });
      }
    } catch {
      setMsg({ type: 'error', text: '❌ Server error.' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    }
  };

  const total = appointments.length;
  const confirmed = appointments.filter((a) => a.status === 'Confirmed').length;
  const pending = appointments.filter((a) => a.status === 'Pending').length;
  const cancelled = appointments.filter((a) => a.status === 'Cancelled').length;

  const filtered =
    filter === 'All' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <h1>👨‍⚕️ Doctor Dashboard</h1>
        <p>Welcome, Dr. {user?.name} — manage your patient appointments below</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div className="stat-num">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div className="stat-num" style={{ color: 'var(--pending)' }}>{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-num" style={{ color: 'var(--success)' }}>{confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">❌</span>
          <div className="stat-num" style={{ color: 'var(--danger)' }}>{cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {/* Filter Tabs */}
      <div className="tabs">
        {['All', 'Pending', 'Confirmed', 'Cancelled'].map((f) => (
          <button
            key={f}
            className={`tab-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            <span style={{
              background: filter === f ? 'rgba(255,255,255,0.25)' : 'var(--border)',
              color: filter === f ? '#fff' : 'var(--text-muted)',
              borderRadius: '20px',
              padding: '0.1rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {f === 'All' ? total
                : f === 'Pending' ? pending
                : f === 'Confirmed' ? confirmed
                : cancelled}
            </span>
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No {filter === 'All' ? '' : filter.toLowerCase()} appointments</h3>
          <p>Patients will appear here once they book with you.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, idx) => (
                <tr key={appt._id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                  <td><strong>{appt.patientId?.name || 'N/A'}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{appt.patientId?.email || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{appt.patientId?.phone || '—'}</td>
                  <td>{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>
                    <span className={`badge ${STATUS_MAP[appt.status]}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      {appt.status !== 'Confirmed' && appt.status !== 'Cancelled' && (
                        <button
                          className="btn btn-success btn-sm"
                          disabled={updatingId === appt._id}
                          onClick={() => updateStatus(appt._id, 'Confirmed')}
                        >
                          ✅ Confirm
                        </button>
                      )}
                      {appt.status !== 'Cancelled' && (
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={updatingId === appt._id}
                          onClick={() => updateStatus(appt._id, 'Cancelled')}
                        >
                          ✕ Cancel
                        </button>
                      )}
                      {appt.status === 'Cancelled' && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                      )}
                    </div>
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
