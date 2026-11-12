import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { formatINR } from '../utils/formatters';
import ProviderEditorModal from '../components/ProviderEditorModal';
import './AdminPortalPage.css';

export default function AdminPortalPage() {
  const navigate = useNavigate();

  // Auth gate check
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return sessionStorage.getItem('trustpaw_admin_token') === 'trustpaw2007';
  });
  const [gatePasscode, setGatePasscode] = useState('');
  const [gateError, setGateError] = useState('');

  // Providers data
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Editing modal state
  const [editingProvider, setEditingProvider] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchAllProviders = async () => {
    try {
      setLoading(true);
      const res = await api.getProviders({});
      setProviders(res.providers || res.data?.providers || []);
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuth) {
      fetchAllProviders();
    }
  }, [isAdminAuth]);

  const handleGateSubmit = (e) => {
    e.preventDefault();
    if (gatePasscode.trim() === 'trustpaw2007') {
      sessionStorage.setItem('trustpaw_admin_token', 'trustpaw2007');
      setIsAdminAuth(true);
      setGateError('');
    } else {
      setGateError('Incorrect Admin Passcode / अमान्य पासवर्ड');
    }
  };

  const handleOpenAdd = () => {
    setEditingProvider(null);
    setShowEditor(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProvider(p);
    setShowEditor(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will remove the facility from the store.`)) {
      return;
    }

    try {
      await api.adminDeleteProvider(id, 'trustpaw2007');
      setToastMessage(`Facility "${name}" deleted successfully.`);
      setProviders((prev) => prev.filter((p) => p.id !== id));
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to delete facility');
    }
  };

  const handleSaved = (savedProvider) => {
    setToastMessage(`Facility "${savedProvider.name}" updated successfully! Changes are now live.`);
    setProviders((prev) => {
      const idx = prev.findIndex((p) => p.id === savedProvider.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedProvider;
        return next;
      }
      return [savedProvider, ...prev];
    });
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered providers
  const filtered = providers.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.clinicName?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.phone?.includes(q);

    return matchesCategory && matchesSearch;
  });

  // Lock Screen if not authorized
  if (!isAdminAuth) {
    return (
      <div className="admin-portal-page">
        <div className="admin-lock-screen glass-card glass-card--lg">
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>🔐</span>
          <h2 style={{ color: '#e8b86d', margin: '0 0 8px 0' }}>TrustPaw Master Administration</h2>
          <p style={{ color: '#a0aec0', fontSize: '14px', marginBottom: '20px' }}>
            Enter your secret master passcode to manage doctors, facilities, photos, and numbers.
          </p>

          <form onSubmit={handleGateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="password"
              placeholder="Enter passcode (trustpaw2007)..."
              value={gatePasscode}
              onChange={(e) => setGatePasscode(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                textAlign: 'center',
                fontSize: '15px',
              }}
              autoFocus
            />

            {gateError && <div style={{ color: '#fc8181', fontSize: '13px' }}>{gateError}</div>}

            <button
              type="submit"
              className="primary-btn"
              style={{ padding: '12px', background: 'linear-gradient(135deg, #e8b86d 0%, #c89547 100%)', color: '#1a202c', fontWeight: 'bold' }}
            >
              Unlock Admin Portal →
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{ background: 'transparent', border: 'none', color: '#a0aec0', cursor: 'pointer', marginTop: '8px', fontSize: '13px' }}
            >
              ← Back to Store / वापस जाएं
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal-page">
      {/* Top Header Bar */}
      <div className="admin-header-bar">
        <div className="admin-title-group">
          <h1>🛡️ TrustPaw Master Admin Portal</h1>
          <p>
            Dynamically update doctors, clinics, photos, consultation fees, and phone numbers in real-time.
          </p>
        </div>

        <div className="admin-header-actions">
          <button className="admin-add-btn" onClick={handleOpenAdd}>
            ➕ Add Doctor / Facility
          </button>
          <button className="admin-exit-btn" onClick={() => navigate('/')}>
            Exit Admin / स्टोर पर जाएं ✕
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="admin-toast-banner">
          <span>✅ {toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            style={{ background: 'transparent', border: 'none', color: '#34d399', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="🔍 Search by Doctor Name, Clinic, City, or Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="admin-category-tabs">
          {['all', 'veterinary', 'grooming', 'training', 'boarding'].map((cat) => (
            <button
              key={cat}
              className={`admin-tab-btn ${selectedCategory === cat ? 'admin-tab-btn--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#a0aec0' }}>
          <span style={{ fontSize: '32px' }}>🐾</span>
          <p>Loading database facilities...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(22, 33, 44, 0.5)', borderRadius: '14px' }}>
          <h3>No Facilities Found</h3>
          <p style={{ color: '#a0aec0' }}>Try searching with a different keyword or category.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <div style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '6px' }}>
            Showing <strong>{filtered.length}</strong> of {providers.length} registered facilities
          </div>

          {filtered.map((p) => {
            const pricingText = p.pricing?.consultation?.min
              ? `${formatINR(p.pricing.consultation.min)} - ${formatINR(p.pricing.consultation.max || p.pricing.consultation.min)}`
              : 'Rates on request';

            return (
              <div key={p.id} className="admin-facility-card">
                <div className="admin-facility-left">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="admin-facility-avatar"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop';
                    }}
                  />
                  <div className="admin-facility-info">
                    <h3>{p.name}</h3>
                    <span className="admin-facility-clinic">{p.clinicName || 'Independent Practice'}</span>
                    <div className="admin-facility-meta">
                      <span>🏷️ {p.category.toUpperCase()}</span>
                      <span>📍 {p.area || p.city}, {p.city}</span>
                      <span>📞 {p.phone}</span>
                      <span>💰 {pricingText}</span>
                      <span>⭐ {p.rating} ({p.reviewCount} reviews)</span>
                      {p.isEmergency && <span style={{ color: '#f87171' }}>🚨 Emergency</span>}
                    </div>
                  </div>
                </div>

                <div className="admin-facility-right">
                  <button className="admin-edit-action-btn" onClick={() => handleOpenEdit(p)}>
                    ✏️ Edit Details & Photos
                  </button>
                  <button className="admin-delete-action-btn" onClick={() => handleDelete(p.id, p.name)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <ProviderEditorModal
          provider={editingProvider}
          onSave={handleSaved}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
}

