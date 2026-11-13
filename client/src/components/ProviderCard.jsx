import { useNavigate } from 'react-router-dom';
import { formatDistance, formatINR } from '../utils/formatters';
import './ProviderCard.css';

export default function ProviderCard({ provider }) {
  const navigate = useNavigate();

  const getPrimaryPricing = () => {
    if (!provider?.pricing) return 'Fee on inquiry';
    const keys = Object.keys(provider.pricing);
    if (keys.length === 0) return 'Rates on request';
    const first = provider.pricing[keys[0]];
    if (first.min && first.max) {
      return `${formatINR(first.min)} – ${formatINR(first.max)}`;
    }
    if (first.min) return `From ${formatINR(first.min)}`;
    return 'Pricing Available';
  };

  const handleClick = () => {
    navigate(`/providers/${provider.id || provider._id}`);
  };

  return (
    <article className="provider-card" onClick={handleClick}>
      <div className="provider-card__media">
        <img
          src={provider.imageUrl || 'https://images.unsplash.com/photo-1628009368231-7bb3cfcb0def?w=400&h=400&fit=crop'}
          alt={provider.name}
          className="provider-card__img"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=400&fit=crop';
          }}
        />
        {provider.isEmergency && (
          <span className="provider-card__emergency-tag">
            <span className="emergency-dot"></span> 24/7 Emergency
          </span>
        )}
      </div>

      <div className="provider-card__content">
        <div className="provider-card__header">
          <div className="provider-card__title-group">
            <span className="provider-card__category">{provider.category?.toUpperCase() || 'VETERINARY'}</span>
            <h4 className="provider-card__name">{provider.name}</h4>
            <span className="provider-card__clinic">{provider.clinicName}</span>
          </div>

          <div className="provider-card__rating" title={`${provider.rating} stars out of 5`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#C98D72" stroke="#C98D72" strokeWidth="1">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className="provider-card__rating-score">{provider.rating}</span>
            <span className="provider-card__rating-reviews">({provider.reviewCount})</span>
          </div>
        </div>

        <div className="provider-card__meta">
          <span className="provider-card__meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
            {provider.yearsExperience}+ Yrs Experience
          </span>
          <span className="provider-card__meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {provider.area ? `${provider.area}, ` : ''}{provider.city}
          </span>
          {provider.distance != null && (
            <span className="provider-card__meta-item provider-card__meta-item--distance">
              {formatDistance(provider.distance)} away
            </span>
          )}
        </div>

        {provider.specializations && provider.specializations.length > 0 && (
          <div className="provider-card__specialties">
            {provider.specializations.slice(0, 3).map((spec, i) => (
              <span key={i} className="provider-card__pill">{spec}</span>
            ))}
          </div>
        )}

        <div className="provider-card__footer">
          <div className="provider-card__pricing">
            <span className="provider-card__price-label">Consultation</span>
            <span className="provider-card__price-value">{getPrimaryPricing()}</span>
          </div>
          <button type="button" className="provider-card__book-btn">
            Book Appointment
          </button>
        </div>
      </div>
    </article>
  );
}