import { useNavigate } from 'react-router-dom';
import { formatDistance, formatINR } from '../utils/formatters';
import './ProviderCard.css';

export default function ProviderCard({ provider }) {
  const navigate = useNavigate();

  const getPrimaryPricing = () => {
    if (!provider?.pricing) return 'Contact for rates';
    const keys = Object.keys(provider.pricing);
    if (keys.length === 0) return 'Rates on request';
    const first = provider.pricing[keys[0]];
    if (first.min && first.max) {
      return `${formatINR(first.min)} - ${formatINR(first.max)}`;
    }
    if (first.min) return `From ${formatINR(first.min)}`;
    return 'Pricing Available';
  };

  return (
    <div
      className="provider-card glass-card"
      onClick={() => navigate(`/providers/${provider.id || provider._id}`)}
    >
      <div className="provider-card__media">
        <img
          src={provider.imageUrl || 'https://images.unsplash.com/photo-1628009368231-7bb3cfcb0def?w=300&h=300&fit=crop'}
          alt={provider.name}
          className="provider-card__img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=300&fit=crop';
          }}
        />
        {provider.isEmergency && (
          <span className="provider-card__badge-emergency">24/7 SOS</span>
        )}
      </div>

      <div className="provider-card__content">
        <div className="provider-card__header-row">
          <div className="provider-card__name-group">
            <h4 className="provider-card__name">{provider.name}</h4>
            <span className="provider-card__clinic">{provider.clinicName}</span>
          </div>
          <div className="provider-card__rating">
            <span className="provider-card__rating-star">★</span>
            <span className="provider-card__rating-value">{provider.rating}</span>
            <span className="provider-card__rating-count">({provider.reviewCount})</span>
          </div>
        </div>

        <div className="provider-card__meta-tags">
          <span className="provider-card__tag">
            🎖️ {provider.yearsExperience}+ Yrs Exp
          </span>
          <span className="provider-card__tag">
            📍 {provider.area}, {provider.city}
          </span>
          {provider.distance != null && (
            <span className="provider-card__tag provider-card__tag--distance">
              ⚡ {formatDistance(provider.distance)}
            </span>
          )}
        </div>

        {provider.specializations && provider.specializations.length > 0 && (
          <div className="provider-card__specialties">
            {provider.specializations.slice(0, 3).map((spec, i) => (
              <span key={i} className="provider-card__spec-pill">{spec}</span>
            ))}
          </div>
        )}

        <div className="provider-card__footer">
          <div className="provider-card__price-box">
            <span className="provider-card__price-label">Consultation / Session:</span>
            <span className="provider-card__price-amount">{getPrimaryPricing()}</span>
          </div>
          <button className="provider-card__book-btn">
            View & Book →
          </button>
        </div>
      </div>
    </div>
  );
}