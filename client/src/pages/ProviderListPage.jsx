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
  const searchQuery = searchParams.get('q') || '';
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [sortBy, setSortBy] = useState('rating');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      searchParams.set('q', localSearch.trim());
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const displayedProviders = providers.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.clinicName?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q) ||
      (Array.isArray(p.specializations) && p.specializations.some((s) => s.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="provider-list-page">
      <div className="provider-list-container">
        {/* Editorial Directory Header */}
        <div className="directory-header-card">
          <div className="directory-header-content">
            <span className="directory-eyebrow">Directory & Facilities</span>
            <h1 className="directory-title">
              {currentCategory
                ? `${SERVICE_TYPES.find((s) => s.id === currentCategory)?.label || 'Specialists'}`
                : 'Verified Doctors & Healthcare Clinics'}
            </h1>
            <p className="directory-subtitle">
              प्रमाणित पशु चिकित्सक, सर्जन्स, क्लिनिक एवं ग्रूमिंग विशेषज्ञ
            </p>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="directory-controls-bar">
            <form onSubmit={handleSearchSubmit} className="directory-search-form">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="directory-search-icon">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Filter by name, clinic, or specialty..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="directory-search-input"
              />
              {localSearch && (
                <button
                  type="button"
                  className="directory-search-clear"
                  onClick={() => {
                    setLocalSearch('');
                    searchParams.delete('q');
                    setSearchParams(searchParams);
                  }}
                >
                  ✕
                </button>
              )}
            </form>

            <div className="directory-dropdown-group">
              {/* City Filter */}
              <div className="directory-select-wrapper">
                <span className="select-label">City:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="directory-select"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="directory-select-wrapper">
                <span className="select-label">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="directory-select"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest to Me</option>
                  <option value="price">Lowest Consultation Fee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Category Pills */}
          <div className="directory-categories-nav">
            <button
              type="button"
              className={`category-chip ${!currentCategory ? 'category-chip--active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All Services (सभी)
            </button>
            {SERVICE_TYPES.map((service) => {
              const isActive = currentCategory === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`category-chip ${isActive ? 'category-chip--active' : ''}`}
                  onClick={() => handleCategoryChange(service.id)}
                >
                  <span>{service.label}</span>
                  <span className="category-chip__hi">{service.labelHi}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Results Header */}
        <div className="directory-results-meta">
          <span className="results-count">
            Showing <strong>{displayedProviders.length}</strong> verified specialists
            {selectedCity !== 'All' ? ` in ${selectedCity}` : ''}
          </span>
          {searchQuery && (
            <span className="results-filter-tag">
              Matching "{searchQuery}"
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  searchParams.delete('q');
                  setSearchParams(searchParams);
                }}
              >
                ✕
              </button>
            </span>
          )}
        </div>

        {/* Providers Listing Grid */}
        {loading ? (
          <div className="directory-loading-state">
            <div className="loading-spinner-circle"></div>
            <p>Fetching verified specialists across India...</p>
          </div>
        ) : displayedProviders.length === 0 ? (
          <div className="directory-empty-card">
            <div className="empty-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>No Specialists Found</h3>
            <p>We couldn't find any verified practitioners matching your filter criteria.</p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setLocalSearch('');
                setSelectedCity('All');
                setSearchParams({});
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="directory-grid">
            {displayedProviders.map((provider) => (
              <ProviderCard key={provider.id || provider._id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}