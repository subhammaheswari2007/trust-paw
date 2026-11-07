import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation as useLocationHook } from '../hooks/useLocation';
import * as api from '../services/api';
import { formatDistance, formatINR } from '../utils/formatters';
import './DistanceTracker.css';

export default function DistanceTracker({ onClose }) {
  const navigate = useNavigate();
  const { coords } = useLocationHook();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    async function fetchNearby() {
      try {
        const lat = coords?.lat || 19.076;
        const lng = coords?.lng || 72.8777;
        const res = await api.getProviders({
          lat,
          lng,
          sort: 'distance',
          category: selectedFilter === 'all' ? undefined : selectedFilter,
        });
        setProviders(res.providers || res.data?.providers || []);
      } catch (err) {
        console.error('Failed to load nearby providers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNearby();
  }, [coords, selectedFilter]);

  const handleProviderClick = (id) => {
    if (onClose) onClose();
    navigate(`/providers/${id}`);
  };

  const categoryIcons = {
    veterinary: '🏥',
    grooming: '🛁',
    training: '🎓',
    supplies: '📦',
  };

  return (
    <div className="distance-tracker">
      <div className="distance-tracker__header">
        <div className="distance-tracker__title-group">
          <span className="distance-tracker__icon">📍</span>
          <div>
            <h3 className="distance-tracker__title">Nearby Distance Tracker</h3>
            <p className="distance-tracker__subtitle">दूरी ट्रैकर — निकटतम सेवाएं</p>
          </div>
        </div>
        {onClose && (
          <button className="distance-tracker__close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}
      </div>

      <div className="distance-tracker__filters">
        {['all', 'veterinary', 'grooming', 'training', 'supplies'].map((type) => (
          <button
            key={type}
            className={`distance-tracker__filter-chip ${
              selectedFilter === type ? 'distance-tracker__filter-chip--active' : ''
            }`}
            onClick={() => setSelectedFilter(type)}
          >
            {type === 'all' && 'All / सभी'}
            {type === 'veterinary' && '🏥 Vet'}
            {type === 'grooming' && '🛁 Groom'}
            {type === 'training' && '🎓 Train'}
            {type === 'supplies' && '📦 Supplies'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="distance-tracker__loading">Calculating proximity... / दूरी की गणना जारी है...</div>
      ) : providers.length === 0 ? (
        <div className="distance-tracker__empty">No providers found nearby.</div>
      ) : (
        <div className="distance-tracker__list">
          {providers.slice(0, 8).map((provider) => (
            <div
              key={provider.id || provider._id}
              className="distance-tracker__item"
              onClick={() => handleProviderClick(provider.id || provider._id)}
            >
              <div className="distance-tracker__item-icon">
                {categoryIcons[provider.category] || '🐾'}
              </div>
              <div className="distance-tracker__item-info">
                <div className="distance-tracker__item-name-row">
                  <span className="distance-tracker__item-name">{provider.name}</span>
                  {provider.isEmergency && <span className="distance-tracker__emergency-badge">24/7</span>}
                </div>
                <div className="distance-tracker__item-clinic">{provider.clinicName}</div>
                <div className="distance-tracker__item-meta">
                  <span>📍 {provider.area}, {provider.city}</span>
                  {provider.pricing?.consultation && (
                    <span> • {formatINR(provider.pricing.consultation.min)} - {formatINR(provider.pricing.consultation.max)}</span>
                  )}
                </div>
              </div>
              <div className="distance-tracker__item-distance">
                <span className="distance-tracker__distance-value">
                  {formatDistance(provider.distance ?? 2.5)}
                </span>
                <span className="distance-tracker__distance-label">away</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}