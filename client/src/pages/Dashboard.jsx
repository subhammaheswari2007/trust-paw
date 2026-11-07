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

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Top Greeting Header */}
        <section className="dashboard-welcome">
          <div className="dashboard-welcome__text">
            <h1 className="dashboard-welcome__greeting">
              Namaste, {userName}! <span className="greeting-paw">🐾</span>
            </h1>
            <p className="dashboard-welcome__hindi">
              नमस्ते! आज आपके पालतू साथी की क्या देखभाल करनी है?
            </p>
            <span className="dashboard-welcome__date">{todayStr}</span>
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
                Guided questionnaire with voice & WhatsApp booking
              </span>
            </div>
            <span className="easy-assist-banner__arrow">→</span>
          </div>
        </section>

        {/* 1. Pet Category Selector */}
        <PetCategoryScroller
          selectedCategory={selectedPetCategory}
          onSelectCategory={(cat) => setSelectedPetCategory(cat)}
        />

        {/* 2. Services Grid (Explicitly NO PRICING on main grid) */}
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