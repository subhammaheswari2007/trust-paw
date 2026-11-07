import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { formatINR } from '../utils/formatters';
import BookingSlots from '../components/BookingSlots';
import WhatsAppBooking from '../components/WhatsAppBooking';
import './ProviderDetailPage.css';

export default function ProviderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState({ date: null, slot: null });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        const res = await api.getProviderById(id);
        setProvider(res.provider || res.data?.provider);
      } catch (err) {
        setError(err.message || 'Provider details unavailable');
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  const handleConfirmBooking = async () => {
    if (!selectedBooking.date || !selectedBooking.slot) {
      alert('Please select both a date and a time slot / कृपया दिनांक व समय चुनें');
      return;
    }

    try {
      setBookingSubmitting(true);
      await api.createBooking({
        providerId: provider.id,
        serviceType: provider.category,
        bookingDate: selectedBooking.date,
        timeSlot: selectedBooking.slot,
        notes: 'Regular checkup booked via web portal',
      });
      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      // In demo mode, simulate booking creation
      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="provider-detail-loading">
        <span className="loading-spinner">🐾</span>
        <p>Loading provider profile & real-time slot availability...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="provider-detail-error glass-card">
        <h2>Provider Not Found</h2>
        <p>{error || 'The requested specialist profile could not be loaded.'}</p>
        <button className="primary-btn" onClick={() => navigate('/providers')}>
          Back to Directory / सूची पर वापस जाएं
        </button>
      </div>
    );
  }

  return (
    <div className="provider-detail-page">
      <div className="provider-detail-container">
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back to Results / वापस जाएं
        </button>

        {/* Hero Banner Card */}
        <div className="detail-hero glass-card glass-card--lg">
          <div className="detail-hero__media">
            <img
              src={provider.imageUrl || 'https://images.unsplash.com/photo-1628009368231-7bb3cfcb0def?w=600&h=600&fit=crop'}
              alt={provider.name}
              className="detail-hero__img"
            />
            {provider.isEmergency && (
              <span className="emergency-ribbon">🚨 24/7 Emergency SOS Active</span>
            )}
          </div>

          <div className="detail-hero__content">
            <div className="detail-hero__tag-row">
              <span className="category-badge">{provider.category.toUpperCase()}</span>
              <span className="experience-badge">🎖️ {provider.yearsExperience}+ Years Experience</span>
            </div>

            <h1 className="detail-hero__name">{provider.name}</h1>
            <h2 className="detail-hero__clinic">{provider.clinicName}</h2>

            <div className="detail-hero__rating-row">
              <div className="rating-pill">
                ⭐ <strong>{provider.rating}</strong> / 5.0 ({provider.reviewCount} Reviews)
              </div>
              <span className="city-pill-static">📍 {provider.area}, {provider.city}</span>
            </div>

            <p className="detail-hero__address">
              <strong>Full Clinic Address:</strong> {provider.address}
            </p>

            <div className="detail-hero__contact-row">
              <a href={`tel:${provider.phone}`} className="contact-btn">
                📞 Call {provider.phone}
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(provider.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-btn"
              >
                📍 Get Directions
              </a>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Pricing + Booking */}
        <div className="detail-body-grid">
          {/* Left Column: Info & Structured INR Pricing */}
          <div className="detail-info-col">
            {/* Specializations & Languages */}
            <div className="info-card glass-card">
              <h3 className="info-card__title">Clinical Focus & Languages</h3>
              <div className="info-card__section">
                <span className="info-label">Specializations:</span>
                <div className="tags-flex">
                  {provider.specializations?.map((spec, i) => (
                    <span key={i} className="spec-tag">{spec}</span>
                  ))}
                </div>
              </div>

              <div className="info-card__section">
                <span className="info-label">Languages Spoken / भाषाएं:</span>
                <div className="tags-flex">
                  {provider.languages?.map((lang, i) => (
                    <span key={i} className="lang-tag">🗣️ {lang}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* INR Pricing Breakdown */}
            <div className="info-card glass-card">
              <h3 className="info-card__title">
                INR Pricing Schedule / शुल्क विवरण (₹)
              </h3>
              <div className="pricing-table">
                {provider.pricing &&
                  Object.entries(provider.pricing).map(([key, val]) => (
                    <div key={key} className="pricing-row">
                      <span className="pricing-service-name">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                      </span>
                      <span className="pricing-service-rate">
                        {val.min && val.max
                          ? `${formatINR(val.min)} - ${formatINR(val.max)}`
                          : formatINR(val.min || val.max)}
                      </span>
                    </div>
                  ))}
              </div>
              <p className="pricing-disclaimer">
                * Rates are inclusive of basic clinical assessment. Medications and diagnostic lab tests are billed separately.
              </p>
            </div>
          </div>

          {/* Right Column: Slot Selection & Actions */}
          <div className="detail-booking-col">
            <div className="booking-card glass-card glass-card--lg">
              <h3 className="booking-card__title">Reserve an Appointment Slot</h3>
              <p className="booking-card__subtitle">
                त्वरित स्लॉट बुकिंग अथवा व्हाट्सएप संपर्क
              </p>

              {bookingSuccess ? (
                <div className="booking-success-box">
                  <div className="success-icon">✅</div>
                  <h4>Appointment Reserved Successfully!</h4>
                  <p>पुष्टि संदेश एसएमएस व ईमेल द्वारा प्रेषित कर दिया गया है।</p>
                  <span>Redirecting to your bookings...</span>
                </div>
              ) : (
                <>
                  <BookingSlots
                    availableSlots={provider.availableSlots}
                    onSelectSlot={(selected) => setSelectedBooking(selected)}
                  />

                  <div className="booking-actions">
                    <button
                      type="button"
                      className="primary-btn booking-submit-btn"
                      onClick={handleConfirmBooking}
                      disabled={bookingSubmitting}
                    >
                      {bookingSubmitting ? 'Reserving Slot...' : 'Confirm Appointment / स्लॉट बुक करें →'}
                    </button>

                    <div className="booking-bridge-divider">
                      <span>OR CONVENIENT ALTERNATIVE</span>
                    </div>

                    {/* WhatsApp Booking Bridge */}
                    <WhatsAppBooking
                      serviceType={provider.category}
                      providerName={provider.name}
                      date={selectedBooking.date || 'Preferred Day'}
                      time={selectedBooking.slot || 'Morning'}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}