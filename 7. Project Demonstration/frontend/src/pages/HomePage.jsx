import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'Psychiatry', 'General Medicine', 'ENT',
  'Ophthalmology', 'Gynecology', 'Urology', 'Oncology',
];

const SPECIALTY_ICONS = {
  Cardiology: '❤️', Dermatology: '🧴', Neurology: '🧠',
  Orthopedics: '🦴', Pediatrics: '👶', Psychiatry: '🧘',
  'General Medicine': '🩺', ENT: '👂', Ophthalmology: '👁️',
  Gynecology: '🌸', Urology: '💧', Oncology: '🎗️',
};

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/doctors`)
      .then((r) => r.json())
      .then((data) => {
        setDoctors(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = doctors;
    if (search) {
      result = result.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (specialty) {
      result = result.filter((d) => d.specialty === specialty);
    }
    setFiltered(result);
  }, [search, specialty, doctors]);

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="hero">
        <h1>Find Your Perfect Doctor 🩺</h1>
        <p>
          Browse our network of top specialists. Book an appointment instantly —
          no waiting, no hassle.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">{doctors.length}+</div>
            <div className="hero-stat-label">Doctors</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">12</div>
            <div className="hero-stat-label">Specialties</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">24/7</div>
            <div className="hero-stat-label">Booking</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search doctor by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.65rem 1rem',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            flex: '1',
            minWidth: '200px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          style={{
            padding: '0.65rem 1rem',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            minWidth: '180px',
            outline: 'none',
            fontFamily: 'inherit',
            background: '#fff',
          }}
        >
          <option value="">All Specialties</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Doctor Count */}
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Showing <strong>{filtered.length}</strong> doctor{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No doctors found</h3>
          <p>Try adjusting your search or specialty filter.</p>
        </div>
      ) : (
        <div className="doctor-grid">
          {filtered.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <div className="doctor-card-header">
                <div className="doctor-avatar">{getInitials(doc.name)}</div>
                <div>
                  <h3>Dr. {doc.name}</h3>
                  <span className="specialty-badge">
                    {SPECIALTY_ICONS[doc.specialty] || '🩺'} {doc.specialty}
                  </span>
                </div>
              </div>
              <div className="doctor-card-body">
                <div className="doctor-info-row">
                  <span>⏱️</span>
                  <span>{doc.experience} years of experience</span>
                </div>
                <div className="doctor-info-row">
                  <span>📧</span>
                  <span>{doc.email}</span>
                </div>
                {doc.phone && (
                  <div className="doctor-info-row">
                    <span>📞</span>
                    <span>{doc.phone}</span>
                  </div>
                )}
                <div className="doctor-fee">
                  ₹{doc.consultationFee}
                  <small> / consultation</small>
                </div>
              </div>
              <div className="doctor-card-footer">
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => navigate(`/book/${doc._id}`)}
                >
                  📅 Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
