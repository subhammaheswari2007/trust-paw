import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { formatINR } from '../utils/formatters';
import ProviderEditorModal from '../components/ProviderEditorModal';
import './AdminPortalPage.css';

const HERO_PRESETS = [
  {
    name: 'Veterinarian & Companion (Default)',
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&h=700&fit=crop',
    tag: 'Editorial',
  },
  {
    name: 'Golden Retriever Medical Exam',
    url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=900&h=700&fit=crop',
    tag: 'Clinical',
  },
  {
    name: 'Feline Health & Care Consultation',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&h=700&fit=crop',
    tag: 'Cat Wellness',
  },
  {
    name: 'Modern Hospital Surgery Suite',
    url: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=900&h=700&fit=crop',
    tag: 'Specialist',
  },
  {
    name: 'Holistic Spa & Gentle Grooming',
    url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=900&h=700&fit=crop',
    tag: 'Grooming',
  },
];

export default function AdminPortalPage() {
  const navigate = useNavigate();

  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return sessionStorage.getItem('trustpaw_admin_token') === 'trustpaw2007';
  });
  const [gatePasscode, setGatePasscode] = useState('');
  const [gateError, setGateError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'settings'

  // Directory state
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [editingProvider, setEditingProvider] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Live Platform Settings state
  const [heroImageUrl, setHeroImageUrl] = useState(
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&h=700&fit=crop'
  );
  const [sosPhone, setSosPhone] = useState('+919725671201');
  const [sosHospitalName, setSosHospitalName] = useState(
    'TrustPaw 24/7 National Emergency Trauma Hotline'
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState('');

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

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res?.settings) {
        if (res.settings.heroImageUrl) setHeroImageUrl(res.settings.heroImageUrl);
        if (res.settings.sosPhone) setSosPhone(res.settings.sosPhone);
        if (res.settings.sosHospitalName) setSosHospitalName(res.settings.sosHospitalName);
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    }
  };

  useEffect(() => {
    if (isAdminAuth) {
      fetchAllProviders();
      fetchSettings();
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
    if (!window.confirm(`Are you sure you want to remove "${name}" from the live directory?`)) {
      return;
    }

    try {
      await api.adminDeleteProvider(id, 'trustpaw2007');
      setToastMessage(`Facility "${name}" removed successfully.`);
      setProviders((prev) => prev.filter((p) => p.id !== id));
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      alert(err.message || 'Failed to delete facility');
    }
  };

  const handleSaved = (savedProvider) => {
    setToastMessage(`Facility "${savedProvider.name}" updated successfully! Changes are live.`);
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

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSavingSettings(true);
      setSettingsStatus('');
      await api.adminSaveSettings(
        {
          heroImageUrl,
          sosPhone,
          sosHospitalName,
        },
        'trustpaw2007'
      );

      // Also persist to localStorage for instant client view update
      localStorage.setItem('trustpaw_hero_image', heroImageUrl);
      localStorage.setItem('trustpaw_sos_phone', sosPhone);
      localStorage.setItem('trustpaw_sos_name', sosHospitalName);

      setToastMessage('Live platform settings updated successfully! Changes are immediately live for all clients.');
      setSettingsStatus('Settings successfully saved and published!');
      setTimeout(() => setToastMessage(''), 4000);
      setTimeout(() => setSettingsStatus(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to update platform settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleResetSettingsDefaults = () => {
    setHeroImageUrl('https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&h=700&fit=crop');
    setSosPhone('+919725671201');
    setSosHospitalName('TrustPaw 24/7 National Emergency Trauma Hotline');
  };

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

  // Locked Screen
  if (!isAdminAuth) {
    return (
      <div className="admin-page">
        <div className="admin-lock-card">
          <div className="admin-lock-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="admin-lock-title">TrustPaw Master Administration</h2>
          <p className="admin-lock-subtitle">
            Enter your secret master passcode to manage clinics, landing page hero visuals, and 24/7 SOS hotlines.
          </p>

          <form onSubmit={handleGateSubmit} className="admin-lock-form">
            <input
              type="password"
              placeholder="Enter passcode (e.g. trustpaw2007)..."
              value={gatePasscode}
              onChange={(e) => setGatePasscode(e.target.value)}
              className="admin-lock-input"
              autoFocus
            />

            {gateError && <div className="admin-lock-error">{gateError}</div>}

            <button type="submit" className="btn-primary" style={{ padding: '12px' }}>
              Unlock Admin Portal →
            </button>
            <button
              type="button"
              className="admin-back-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Main Platform
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header Bar */}
        <div className="admin-header-card">
          <div>
            <span className="admin-eyebrow">Executive Console</span>
            <h1 className="admin-title">TrustPaw Platform Management</h1>
            <p className="admin-subtitle">
              Manage live doctors, clinics, landing page hero photography, and 24/7 SOS emergency contact hotlines.
            </p>
          </div>

          <div className="admin-top-actions">
            {activeTab === 'directory' && (
              <button className="btn-primary" onClick={handleOpenAdd}>
                + Add Doctor / Facility
              </button>
            )}
            <button className="btn-secondary" onClick={() => navigate('/')}>
              Exit Console ✕
            </button>
          </div>
        </div>

        {/* Executive Platform KPI Statistics Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-number">{providers.length}</span>
            <span className="admin-stat-label">Total Facilities</span>
            <span className="admin-stat-sub">Across All Categories</span>
          </div>

          <div className="admin-stat-card admin-stat-card--emergency">
            <span className="admin-stat-number">{providers.filter((p) => p.isEmergency).length}</span>
            <span className="admin-stat-label">24/7 ER Trauma Units</span>
            <span className="admin-stat-sub">Immediate Critical Care</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-number">{providers.filter((p) => (p.category || '').toLowerCase() === 'veterinary').length}</span>
            <span className="admin-stat-label">Verified Specialists</span>
            <span className="admin-stat-sub">Board Certified Doctors</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-number">{new Set(providers.map((p) => p.city).filter(Boolean)).size || 1}</span>
            <span className="admin-stat-label">Covered Regions</span>
            <span className="admin-stat-sub">Active Cities & Districts</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === 'directory' ? 'admin-tab-nav-btn--active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Live Directory ({providers.length})</span>
          </button>

          <button
            type="button"
            className={`admin-tab-nav-btn ${activeTab === 'settings' ? 'admin-tab-nav-btn--active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Landing Page & SOS Hotline</span>
          </button>
        </div>

        {toastMessage && (
          <div className="admin-toast">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')}>✕</button>
          </div>
        )}

        {/* TAB 1: Live Directory */}
        {activeTab === 'directory' && (
          <>
            {/* Filter and Search Bar */}
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="admin-search-box"
                  placeholder="Search by practitioner name, clinic, city, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="admin-cat-pills">
                {['all', 'veterinary', 'grooming', 'training', 'boarding'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`admin-cat-btn ${selectedCategory === cat ? 'admin-cat-btn--active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Facilities Table */}
            {loading ? (
              <div className="admin-loading-box">
                <div className="loading-spinner-circle"></div>
                <p>Loading database directory records...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty-box">
                <h3>No Records Found</h3>
                <p>No facilities match your search query or filter selection.</p>
              </div>
            ) : (
              <div className="admin-records-list">
                <div className="admin-meta-count">
                  Showing <strong>{filtered.length}</strong> of {providers.length} registered facilities
                </div>

                {filtered.map((p) => {
                  const pricingText = p.pricing?.consultation?.min
                    ? `${formatINR(p.pricing.consultation.min)} – ${formatINR(
                        p.pricing.consultation.max || p.pricing.consultation.min
                      )}`
                    : 'Fee on inquiry';

                  return (
                    <div key={p.id} className="admin-row-card">
                      <div className="admin-row-left">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="admin-row-avatar"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop';
                          }}
                        />
                        <div className="admin-row-info">
                          <div className="admin-row-title-row">
                            <h3 className="admin-row-name">{p.name}</h3>
                            <span className="badge badge--navy">{p.category?.toUpperCase()}</span>
                            {p.isEmergency && <span className="badge badge--emergency">24/7 ER</span>}
                          </div>
                          <span className="admin-row-clinic">{p.clinicName || 'Independent Practice'}</span>

                          <div className="admin-row-tags">
                            <span>📍 {p.area ? `${p.area}, ` : ''}{p.city}</span>
                            <span>📞 {p.phone}</span>
                            <span>💰 {pricingText}</span>
                            <span>⭐ {p.rating} ({p.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ fontSize: '12.5px', padding: '7px 12px' }}
                          onClick={() => handleOpenEdit(p)}
                        >
                          Edit Facility
                        </button>
                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* TAB 2: Landing Page Visual & 24/7 SOS Phone Config */}
        {activeTab === 'settings' && (
          <div className="admin-settings-container">
            <form onSubmit={handleSaveSettings} className="admin-settings-form">
              {/* SECTION 1: Landing Page Hero Visual */}
              <div className="admin-settings-card">
                <div className="settings-card-header">
                  <div>
                    <span className="settings-eyebrow">Visual Brand Asset</span>
                    <h2 className="settings-card-title">Homepage Hero Photography (Near Search Bar)</h2>
                    <p className="settings-card-sub">
                      Control the main high-resolution editorial photograph displayed next to the healthcare search bar on the landing page.
                    </p>
                  </div>
                </div>

                <div className="settings-hero-grid">
                  <div className="settings-input-col">
                    <div className="settings-form-group">
                      <label htmlFor="heroImageUrl" className="settings-label">
                        Image URL (Direct HTTPS Web or Cloud Link)
                      </label>
                      <input
                        id="heroImageUrl"
                        type="url"
                        className="settings-text-input"
                        placeholder="https://images.unsplash.com/..."
                        value={heroImageUrl}
                        onChange={(e) => {
                          let val = e.target.value;
                          const gdriveMatch = val.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
                          if (gdriveMatch) {
                            val = `https://drive.google.com/uc?export=view&id=${gdriveMatch[1]}`;
                          } else if (val.includes('dropbox.com') && val.includes('dl=0')) {
                            val = val.replace('dl=0', 'raw=1');
                          }
                          setHeroImageUrl(val);
                        }}
                        required
                      />
                      <span className="settings-hint">
                        Pro-tip: Unsplash, Cloudinary, AWS S3, or direct high-resolution web links are supported. Recommended aspect ratio 4:3 or 16:10.
                      </span>
                    </div>

                    <div className="settings-preset-section">
                      <label className="settings-label">Or choose from curated veterinary presets:</label>
                      <div className="settings-preset-chips">
                        {HERO_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            className={`settings-preset-btn ${heroImageUrl === preset.url ? 'settings-preset-btn--active' : ''}`}
                            onClick={() => setHeroImageUrl(preset.url)}
                          >
                            <span className="preset-name">{preset.name}</span>
                            <span className="preset-tag">{preset.tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="settings-preview-col">
                    <label className="settings-label">Live Landing Page Visual Preview</label>
                    <div className="hero-preview-frame">
                      <img
                        src={heroImageUrl}
                        alt="Landing Page Hero Preview"
                        className="hero-preview-img"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&h=700&fit=crop';
                        }}
                      />
                      <div className="preview-badge">Homepage Hero Asset</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: 24/7 SOS Contact Number & Trauma Desk */}
              <div className="admin-settings-card">
                <div className="settings-card-header">
                  <div>
                    <span className="settings-eyebrow settings-eyebrow--emergency">Emergency Healthcare Line</span>
                    <h2 className="settings-card-title">24/7 SOS Contact Number & Trauma Dispatch</h2>
                    <p className="settings-card-sub">
                      Configure the emergency phone number and hospital dispatch desk that clients can access in critical situations.
                    </p>
                  </div>
                </div>

                <div className="settings-sos-grid">
                  <div className="settings-input-col">
                    <div className="settings-form-group">
                      <label htmlFor="sosPhone" className="settings-label">
                        24/7 Emergency Telephone Number
                      </label>
                      <input
                        id="sosPhone"
                        type="text"
                        className="settings-text-input"
                        placeholder="+919725671201 or 112"
                        value={sosPhone}
                        onChange={(e) => setSosPhone(e.target.value)}
                        required
                      />
                      <span className="settings-hint">
                        Include country code for India (+91) or your local 24/7 trauma dispatch number. Clients can tap to call instantly.
                      </span>
                    </div>

                    <div className="settings-form-group">
                      <label htmlFor="sosHospitalName" className="settings-label">
                        Emergency Hospital / Dispatch Center Name
                      </label>
                      <input
                        id="sosHospitalName"
                        type="text"
                        className="settings-text-input"
                        placeholder="TrustPaw 24/7 National Emergency Trauma Hotline"
                        value={sosHospitalName}
                        onChange={(e) => setSosHospitalName(e.target.value)}
                        required
                      />
                      <span className="settings-hint">
                        Displayed in the SOS Emergency Modal and the 24/7 Trauma badge on the landing page.
                      </span>
                    </div>

                    <div className="settings-sos-callout">
                      <div className="callout-icon">ℹ️</div>
                      <div className="callout-text">
                        <strong>Where this contact is deployed:</strong>
                        <ul>
                          <li><strong>Landing Page:</strong> 24/7 Trauma Service banner near the search bar.</li>
                          <li><strong>Floating SOS Button:</strong> 1-tap emergency trigger available on every screen.</li>
                          <li><strong>SOS Emergency Modal:</strong> Verified Emergency Dispatch banner with direct cellular call and WhatsApp alert.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="settings-preview-col">
                    <label className="settings-label">Client SOS Emergency Card Preview</label>
                    <div className="sos-live-preview-box">
                      <div className="sos-preview-badge-row">
                        <span className="sos-preview-dot"></span>
                        <span className="sos-preview-badge-txt">VERIFIED EMERGENCY DISPATCH</span>
                      </div>
                      <h4 className="sos-preview-name">{sosHospitalName || 'TrustPaw 24/7 Emergency Hotline'}</h4>
                      <p className="sos-preview-desc">
                        Direct triage, immediate ambulance dispatch, and critical surgeon on-call.
                      </p>

                      <div className="sos-preview-actions">
                        <a
                          href={`tel:${sosPhone.replace(/[^0-9+]/g, '')}`}
                          className="sos-preview-call-btn"
                          onClick={(e) => e.preventDefault()}
                        >
                          📞 Call ({sosPhone})
                        </a>
                        <a
                          href={`https://wa.me/${sosPhone.replace(/[^0-9]/g, '')}`}
                          className="sos-preview-wa-btn"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          💬 WhatsApp Alert
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE ACTION BAR */}
              <div className="settings-action-bar">
                <div className="settings-action-left">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSavingSettings}
                    style={{ padding: '12px 24px', fontSize: '14.5px' }}
                  >
                    {isSavingSettings ? 'Publishing Live Changes...' : 'Save Live Platform Settings →'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleResetSettingsDefaults}
                    disabled={isSavingSettings}
                    style={{ padding: '12px 18px', fontSize: '13.5px' }}
                  >
                    Reset Defaults
                  </button>
                </div>

                {settingsStatus && <div className="settings-status-indicator">{settingsStatus}</div>}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Facility Editor Modal */}
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
