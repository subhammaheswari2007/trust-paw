import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation as useLocationHook } from '../hooks/useLocation';
import * as api from '../services/api';
import ProviderCard from '../components/ProviderCard';
import { CITIES, SERVICE_TYPES } from '../utils/constants';
import './ProviderListPage.css';

export default function ProviderListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { coords } = useLocationHook();

  const currentCategory = searchParams.get('category') || '';
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchList() {
      try {
        setLoading(true);
        const lat = coords?.lat || 19.076;
        const lng = coords?.lng || 72.8777;

        const res = await api.getProviders({
          category: currentCategory || undefined,
          city: selectedCity === 'All' ? undefined : selectedCity,
          sort: sortBy,
          lat,
          lng,
        });

        setProviders(res.providers || res.data?.providers || []);
      } catch (err) {
        console.error('Failed to load providers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, [currentCategory, selectedCity, sortBy, coords]);

  const handleCategoryChange = (catId) => {
    if (catId === currentCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const getCategoryTitle = () => {
    if (!currentCategory) return 'All Care Providers / सभी सेवाएं';
    const found = SERVICE_TYPES.find((s) => s.id === currentCategory);
    return found ? `${found.emoji} ${found.label} (${found.labelHi})` : 'Services Directory';
  };

  return (
    <div className="provider-list-page">
      <div className="provider-list-container">
        {/* Category Header Bar */}
        <div className="provider-list-header">
          <div>
            <h1 className="provider-list-title">{getCategoryTitle()}</h1>
            <p className="provider-list-subtitle">
              Verified pet health, grooming, and training specialists across India
            </p>
          </div>

          <div className="provider-list-sort">
            <label className="sort-label">Sort by / क्रम:</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">⭐ Highest Rated</option>
              <option value="distance">📍 Nearest to Me</option>
              <option value="price">🏷️ Lowest Consultation Fee</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="category-chips-row">
          <button
            className={`filter-pill ${!currentCategory ? 'filter-pill--active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            🐾 All Services
          </button>
          {SERVICE_TYPES.map((service) => (
            <button
              key={service.id}
              className={`filter-pill ${currentCategory === service.id ? 'filter-pill--active' : ''}`}
              onClick={() => handleCategoryChange(service.id)}
            >
              {service.emoji} {service.label}
            </button>
          ))}
        </div>

        {/* City Filter Pills */}
        <div className="city-filter-row">
          <span className="city-filter-label">City / शहर:</span>
          <div className="city-pills-list">
            {CITIES.map((city) => (
              <button
                key={city}
                className={`city-pill ${selectedCity === city ? 'city-pill--active' : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="results-count">
          Showing {providers.length} verified specialists
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="list-loading-state">
            <span className="loading-spinner">🐾</span>
            <p>Fetching verified specialists...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="list-empty-state glass-card">
            <h3>No providers match your criteria</h3>
            <p>Try clearing filters or selecting a different city.</p>
            <button
              className="primary-btn"
              onClick={() => {
                setSelectedCity('All');
                handleCategoryChange('');
              }}
            >
              Reset Filters / फ़िल्टर रीसेट करें
            </button>
          </div>
        ) : (
          <div className="providers-directory-grid">
            {providers.map((p) => (
              <ProviderCard key={p.id || p._id} provider={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}