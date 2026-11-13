import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocation as useLocationHook } from '../hooks/useLocation';
import * as api from '../services/api';
import PetCategoryScroller from '../components/PetCategoryScroller';
import ServicesGrid from '../components/ServicesGrid';
import ProviderCard from '../components/ProviderCard';
import SOSModal from '../components/SOSModal';
import { CITIES } from '../utils/constants';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { coords } = useLocationHook();

  const [selectedPetCategory, setSelectedPetCategory] = useState(null);
  const [topProviders, setTopProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [showSOSModal, setShowSOSModal] = useState(false);

  // Dynamic Site Settings configured from Admin side
  const [heroImage, setHeroImage] = useState(() => {
    const cached = localStorage.getItem('trustpaw_hero_image');
    if (cached && !cached.includes('photo-1548767797-d8c844163c4c')) return cached;
    return 'https://res.cloudinary.com/qhmx80db/image/upload/v1794515619/WIN_20260623_03_15_58_Pro.jpg';
  });

  const [sosPhone, setSosPhone] = useState(() => {
    return localStorage.getItem('trustpaw_sos_phone') || '+919725671201';
  });

  const [sosHospitalName, setSosHospitalName] = useState(() => {
    return localStorage.getItem('trustpaw_sos_name') || 'TrustPaw 24/7 National Emergency Trauma Hotline';
  });

  // Load site settings (Hero Image & SOS Contact) from server or local cache
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await api.getSettings();
        if (res.settings) {
          if (res.settings.heroImageUrl) {
            setHeroImage(res.settings.heroImageUrl);
            localStorage.setItem('trustpaw_hero_image', res.settings.heroImageUrl);
          }
          if (res.settings.sosPhone) {
            setSosPhone(res.settings.sosPhone);
            localStorage.setItem('trustpaw_sos_phone', res.settings.sosPhone);
          }
          if (res.settings.sosHospitalName) {
            setSosHospitalName(res.settings.sosHospitalName);
            localStorage.setItem('trustpaw_sos_name', res.settings.sosHospitalName);
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    async function loadTopProviders() {
      try {
        setLoading(true);
        const lat = coords?.lat || 19.076;
        const lng = coords?.lng || 72.8777;
        const res = await api.getProviders({
          lat,
          lng,
          sort: 'rating',
          category: selectedPetCategory || undefined,
          city: selectedCity === 'All' ? undefined : selectedCity,
        });
        const list = res.providers || res.data?.providers || [];
        setTopProviders(list.slice(0, 4));
      } catch (err) {
        console.error('Failed to load top providers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTopProviders();
  }, [coords, selectedPetCategory, selectedCity]);

  const userName = user?.name ? user.name.split(' ')[0] : 'Pet Parent';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroSearch.trim()) params.set('q', heroSearch.trim());
    if (selectedCity !== 'All') params.set('city', selectedCity);
    navigate(`/providers?${params.toString()}`);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Editorial Healthcare Hero */}
        <section className="editorial-hero">
          <div className="editorial-hero__grid">
            <div className="editorial-hero__copy">
              <div className="editorial-hero__badge">
                <span className="badge-dot"></span>
                <span>Premier Indian Pet Healthcare Network</span>
              </div>

              <h1 className="editorial-hero__headline">
                Better care for every paw.
              </h1>

              <p className="editorial-hero__subhead">
                Connect with verified veterinary surgeons, luxury doorstep groomers, certified animal behaviorists, and 24/7 trauma hospitals across major Indian cities.
              </p>

              {/* Comprehensive Search & City Filter */}
              <form onSubmit={handleSearchSubmit} className="hero-search-box">
                <div className="hero-search-input-group">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hero-search-icon">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search doctors, surgeries, clinics, or areas (e.g. Bandra, Indiranagar)..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="hero-search-field"
                  />
                </div>

                <div className="hero-city-select-group">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hero-city-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="hero-city-select"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="hero-search-submit">
                  Find Specialists
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="hero-trust-row">
                <div className="trust-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A7B7A4" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>100% Verified Specialists</span>
                </div>
                <div className="trust-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C98D72" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="6" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Transparent INR Pricing</span>
                </div>
                <div className="trust-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#263B50" strokeWidth="2.5">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  <span>Direct WhatsApp Forwarding</span>
                </div>
              </div>
            </div>

            {/* Editorial Hero Visual Card (Configurable from Admin side) */}
            <div className="editorial-hero__media">
              <div className="hero-image-frame">
                <img
                  src={heroImage}
                  alt="Veterinarian with companion dog"
                  className="hero-image"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&h=700&fit=crop';
                  }}
                />
                <div className="hero-floating-stat hero-floating-stat--emergency" onClick={() => setShowSOSModal(true)}>
                  <div className="stat-icon-danger">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                  <div>
                    <span className="stat-title">24/7 Trauma Care</span>
                    <span className="stat-subtitle">Call {sosPhone}</span>
                  </div>
                </div>

                <div className="hero-floating-stat hero-floating-stat--rating">
                  <div className="stat-rating-badge">
                    <span>4.9</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#C98D72" stroke="#C98D72">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div>
                    <span className="stat-title">Top Rated Clinics</span>
                    <span className="stat-subtitle">Over 15,000+ Indian reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome & Accessibility Action Bar */}
        <section className="dashboard-action-bar">
          <div className="welcome-banner">
            <span className="welcome-text">Welcome back, <strong>{userName}</strong></span>
            <span className="welcome-date">India • {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>

          <div className="action-bar-right">
            {/* Easy Assist Quick Access */}
            <div
              className="easy-assist-card"
              onClick={() => navigate('/easy-assist')}
              role="button"
              tabIndex={0}
            >
              <div className="easy-assist-card__badge">सुगम सेवा</div>
              <div className="easy-assist-card__text">
                <span className="easy-assist-card__title">Easy Assist Mode</span>
                <span className="easy-assist-card__sub">Voice guidance & large text for elders</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>

            {/* Emergency SOS Button */}
            <button
              type="button"
              className="emergency-btn"
              onClick={() => setShowSOSModal(true)}
              title={`24/7 Emergency SOS Hotline: ${sosPhone}`}
            >
              <span className="emergency-indicator"></span>
              <span>24/7 SOS: {sosPhone}</span>
            </button>
          </div>
        </section>

        {/* 1. Pet Categories */}
        <PetCategoryScroller
          selectedCategory={selectedPetCategory}
          onSelectCategory={(cat) => setSelectedPetCategory(cat)}
        />

        {/* 2. Specialized Services */}
        <ServicesGrid />

        {/* 3. Verified Directory Highlights */}
        <section className="featured-providers-section">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">Verified Directory</span>
              <h2 className="section-title">Top Rated Care Providers Near You</h2>
              <p className="section-subtitle">
                उच्चतम रेटिंग वाले पशु चिकित्सक, ग्रूमर्स एवं प्रमाणित व्यवहार विशेषज्ञ
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/providers')}
            >
              <span>View Full Directory</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="directory-loading-state">
              <div className="loading-spinner-circle"></div>
              <p>Locating verified pet specialists in {selectedCity === 'All' ? 'India' : selectedCity}...</p>
            </div>
          ) : topProviders.length === 0 ? (
            <div className="directory-empty-state">
              <p>No specialists match the selected criteria in this area.</p>
              <button className="btn-secondary" onClick={() => { setSelectedPetCategory(null); setSelectedCity('All'); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="providers-grid">
              {topProviders.map((provider) => (
                <ProviderCard key={provider.id || provider._id} provider={provider} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Floating 24/7 SOS Quick Trigger Button */}
      <button
        type="button"
        className="floating-sos-pill"
        onClick={() => setShowSOSModal(true)}
        aria-label="Open 24/7 Emergency Pet Hospital Finder"
        title={`Emergency Helpline: ${sosPhone}`}
      >
        <span className="floating-sos-dot"></span>
        <span className="floating-sos-text">24/7 SOS: {sosPhone}</span>
      </button>

      {/* SOS Modal Component */}
      {showSOSModal && (
        <SOSModal
          onClose={() => setShowSOSModal(false)}
          customPhone={sosPhone}
          customHospitalName={sosHospitalName}
        />
      )}
    </div>
  );
}