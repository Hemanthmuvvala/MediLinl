import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

export default function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('bad_user') || 'null');

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ date: '', time: '', notes: '' });

  useEffect(() => {
    fetch(`${API}/api/doctors/${doctorId}`)
      .then((r) => r.json())
      .then((data) => setDoctor(data))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user._id,
          doctorId,
          date: form.date,
          time: form.time,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Booking failed.');
      setSuccess('✅ Appointment booked successfully!');
      setTimeout(() => navigate('/my-appointments'), 1800);
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="spinner-wrap" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

  if (!doctor)
    return (
      <div className="page-wrapper">
        <div className="alert alert-error">Doctor not found.</div>
      </div>
    );

  return (
    <div className="page-wrapper" style={{ maxWidth: 600 }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/home')}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        ← Back to Doctors
      </button>

      <div className="page-header">
        <h1>Book Appointment</h1>
        <p>Choose a date and time that works for you</p>
      </div>

      {/* Doctor Summary */}
      <div className="booking-doctor-summary">
        <div className="summary-avatar">{getInitials(doctor.name)}</div>
        <div>
          <h3>Dr. {doctor.name}</h3>
          <p>🩺 {doctor.specialty} &nbsp;·&nbsp; ⏱️ {doctor.experience} yrs exp.</p>
          <p className="fee">₹{doctor.consultationFee} <small style={{ fontWeight: 400, fontSize: '0.8rem' }}>/ session</small></p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="card" style={{ padding: '2rem' }}>
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Appointment Date</label>
              <input
                type="date"
                name="date"
                min={today}
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Preferred Time</label>
              <select name="time" value={form.time} onChange={handleChange} required>
                <option value="">Select time</option>
                {[
                  '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
                  '11:00 AM','11:30 AM','12:00 PM','02:00 PM',
                  '02:30 PM','03:00 PM','03:30 PM','04:00 PM',
                  '04:30 PM','05:00 PM','05:30 PM',
                ].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes / Symptoms (optional)</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Briefly describe your symptoms or reason for visit…"
              value={form.notes}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
            style={{ marginTop: '0.5rem' }}
          >
            {submitting ? '⏳ Booking…' : '📅 Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
