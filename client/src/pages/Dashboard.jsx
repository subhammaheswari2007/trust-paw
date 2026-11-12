import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocation as useLocationHook } from '../hooks/useLocation';
import * as api from '../services/api';
import PetCategoryScroller from '../components/PetCategoryScroller';
import ServicesGrid from '../components/ServicesGrid';
import ProviderCard from '../components/ProviderCard';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { coords } = useLocationHook();

  const [selectedPetCategory, setSelectedPetCategory] = useState(null);
  const [topProviders, setTopProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
          category: selectedPetCategory ? undefined : undefined,
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
  }, [coords, selectedPetCategory]);

  const userName = user?.name ? user.name.split(' ')[0] : 'Pet Parent';
  const [heroSearch, setHeroSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/providers?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/providers');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Aesthetic Pet Store Hero Banner */}
        <section className="dashboard-hero-banner glass-card glass-card--lg">
          <div className="dashboard-hero-content">
            <span className="hero-pill-badge">✨ India's Most Trusted Pet Health & Care Network</span>
            <h1 className="dashboard-hero-title">
              Exceptional Care & Wellness for Every Companion 🐾
            </h1>
            <p className="dashboard-hero-subtitle">
              Book verified veterinary surgeons, luxury doorstep grooming, certified trainers, and trusted boarding across top Indian cities.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="dashboard-hero-search">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search clinics, veterinarians, groomers, or city (e.g. Bandra, Powai)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="hero-search-input"
              />
              <button type="submit" className="hero-search-btn">
                Find Care →
              </button>
            </form>

            {/* Quick Trust Badges */}
            <div className="hero-trust-badges">
              <span className="trust-badge-item">⭐ <strong>4.9/5</strong> Rating (15k+ Reviews)</span>
              <span className="trust-badge-item">🏥 <strong>100%</strong> Verified Clinics</span>
              <span className="trust-badge-item">💬 <strong>Instant</strong> WhatsApp Booking</span>
            </div>
          </div>
        </section>

        {/* Welcome Subheader & Easy Assist Option */}
        <div className="dashboard-subheader-row">
          <div className="dashboard-welcome-pill">
            <span>👋 Welcome, <strong>{userName}</strong>!</span>
            <span className="dashboard-date-tag">📅 {todayStr}</span>
          </div>

          <div
            className="easy-assist-banner glass-card"
            onClick={() => navigate('/easy-assist')}
          >
            <div className="easy-assist-banner__icon">👵</div>
            <div className="easy-assist-banner__info">
              <span className="easy-assist-banner__title">
                सुगम सेवा मोड | Easy Assist
              </span>
              <span className="easy-assist-banner__sub">
                Guided questionnaire with voice & WhatsApp
              </span>
            </div>
            <span className="easy-assist-banner__arrow">→</span>
          </div>
        </div>

        {/* 1. Pet Category Selector */}
        <PetCategoryScroller
          selectedCategory={selectedPetCategory}
          onSelectCategory={(cat) => setSelectedPetCategory(cat)}
        />

        {/* 2. Services Grid */}
        <ServicesGrid />

        {/* 3. Top Rated Providers Near You */}
        <section className="dashboard-providers-section">
          <div className="dashboard-section-header">
            <div>
              <h2 className="dashboard-section-title">
                Top Rated Near You / आपके पास सर्वश्रेष्ठ
              </h2>
              <p className="dashboard-section-sub">
                Verified veterinary clinics, groomers & certified trainers
              </p>
            </div>
            <button
              className="view-all-btn"
              onClick={() => navigate('/providers')}
            >
              View All Directory →
            </button>
          </div>

          {loading ? (
            <div className="dashboard-loading-box">
              <span className="loading-spinner">🐾</span>
              <p>Locating verified pet specialists...</p>
            </div>
          ) : (
            <div className="dashboard-providers-grid">
              {topProviders.map((provider) => (
                <ProviderCard key={provider.id || provider._id} provider={provider} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}