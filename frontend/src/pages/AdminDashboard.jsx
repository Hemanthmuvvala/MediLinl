import { useState, useEffect, useCallback } from 'react';

const STATUS_MAP = {
  Pending: 'badge-pending',
  Confirmed: 'badge-confirmed',
  Cancelled: 'badge-cancelled',
};

const SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'Psychiatry', 'General Medicine', 'ENT',
  'Ophthalmology', 'Gynecology', 'Urology', 'Oncology',
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('appointments');
  const [data, setData] = useState({ doctors: [], patients: [], appointments: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [doctorForm, setDoctorForm] = useState({
    name: '', specialty: '', experience: '', consultationFee: '',
    email: '', password: '', phone: '',
  });

  const fetchAll = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/all')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3500);
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...doctorForm,
          experience: Number(doctorForm.experience),
          consultationFee: Number(doctorForm.consultationFee),
        }),
      });
      const resData = await res.json();
      if (!res.ok) return showMsg('error', resData.message || '❌ Failed to add doctor.');
      showMsg('success', '✅ Doctor added successfully!');
      setDoctorForm({ name: '', specialty: '', experience: '', consultationFee: '', email: '', password: '', phone: '' });
      setShowAddDoctor(false);
      fetchAll();
    } catch {
      showMsg('error', '❌ Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Remove this doctor from the system?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/doctors/${id}`, { method: 'DELETE' });
      showMsg('success', '✅ Doctor removed.');
      fetchAll();
    } catch {
      showMsg('error', '❌ Server error.');
    } finally {
      setDeleting(null);
    }
  };

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const { doctors, patients, appointments } = data;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>Manage doctors, patients, and all appointments across the system</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-icon">👨‍⚕️</span>
          <div className="stat-num">{doctors.length}</div>
          <div className="stat-label">Doctors</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🧑‍⚕️</span>
          <div className="stat-num">{patients.length}</div>
          <div className="stat-label">Patients</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div className="stat-num">{appointments.length}</div>
          <div className="stat-label">Appointments</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-num" style={{ color: 'var(--success)' }}>
            {appointments.filter((a) => a.status === 'Confirmed').length}
          </div>
          <div className="stat-label">Confirmed</div>
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'appointments', label: '📅 Appointments', count: appointments.length },
          { id: 'doctors', label: '👨‍⚕️ Doctors', count: doctors.length },
          { id: 'patients', label: '🧑‍⚕️ Patients', count: patients.length },
        ].map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span style={{
              background: tab === t.id ? 'rgba(255,255,255,0.25)' : 'var(--border)',
              color: tab === t.id ? '#fff' : 'var(--text-muted)',
              borderRadius: '20px',
              padding: '0.1rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <>
          {/* ===== APPOINTMENTS TAB ===== */}
          {tab === 'appointments' && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No appointments yet.</td></tr>
                  ) : appointments.map((appt, idx) => (
                    <tr key={appt._id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                      <td><strong>{appt.patientId?.name || 'N/A'}</strong></td>
                      <td>Dr. {appt.doctorId?.name || 'N/A'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{appt.doctorId?.specialty || '—'}</td>
                      <td>{appt.date}</td>
                      <td>{appt.time}</td>
                      <td>
                        <span className={`badge ${STATUS_MAP[appt.status]}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== DOCTORS TAB ===== */}
          {tab === 'doctors' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddDoctor((v) => !v)}
                >
                  {showAddDoctor ? '✕ Close Form' : '+ Add New Doctor'}
                </button>
              </div>

              {/* Add Doctor Form */}
              {showAddDoctor && (
                <div className="panel" style={{ marginBottom: '1.5rem' }}>
                  <div className="panel-title">➕ Add New Doctor</div>
                  <form onSubmit={handleAddDoctor}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          placeholder="Dr. John Smith"
                          value={doctorForm.name}
                          onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Specialty</label>
                        <select
                          value={doctorForm.specialty}
                          onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                          required
                        >
                          <option value="">Select specialty</option>
                          {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Experience (years)</label>
                        <input
                          type="number"
                          min={0}
                          placeholder="e.g. 10"
                          value={doctorForm.experience}
                          onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Consultation Fee (₹)</label>
                        <input
                          type="number"
                          min={0}
                          placeholder="e.g. 500"
                          value={doctorForm.consultationFee}
                          onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email (login)</label>
                        <input
                          type="email"
                          placeholder="doctor@clinic.com"
                          value={doctorForm.email}
                          onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Password (for doctor login)</label>
                        <input
                          type="text"
                          placeholder="Set a password"
                          value={doctorForm.password}
                          onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Phone (optional)</label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={doctorForm.phone}
                        onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn btn-teal" disabled={submitting}>
                      {submitting ? '⏳ Adding…' : '✅ Add Doctor'}
                    </button>
                  </form>
                </div>
              )}

              {/* Doctors Table */}
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Specialty</th>
                      <th>Experience</th>
                      <th>Fee</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No doctors yet. Add one above!</td></tr>
                    ) : doctors.map((doc, idx) => (
                      <tr key={doc._id}>
                        <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary), var(--teal))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                            }}>{getInitials(doc.name)}</div>
                            <strong>Dr. {doc.name}</strong>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{doc.specialty}</td>
                        <td>{doc.experience} yrs</td>
                        <td>₹{doc.consultationFee}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{doc.email}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{doc.phone || '—'}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={deleting === doc._id}
                            onClick={() => handleDeleteDoctor(doc._id)}
                          >
                            {deleting === doc._id ? '⏳' : '🗑️ Remove'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ===== PATIENTS TAB ===== */}
          {tab === 'patients' && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No patients registered yet.</td></tr>
                  ) : patients.map((p, idx) => (
                    <tr key={p._id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--teal), var(--indigo))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                          }}>{getInitials(p.name)}</div>
                          <strong>{p.name}</strong>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{p.email}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{p.phone || '—'}</td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {new Date(p.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
