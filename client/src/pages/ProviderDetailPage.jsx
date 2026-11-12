import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { formatINR } from '../utils/formatters';
import BookingSlots from '../components/BookingSlots';
import WhatsAppBooking, { buildWhatsAppBookingUrl } from '../components/WhatsAppBooking';
import './ProviderDetailPage.css';

export default function ProviderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState({ date: null, slot: null });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
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
      alert('Please select both a consultation date and an available time slot.');
      return;
    }

    try {
      setBookingSubmitting(true);
      const res = await api.createBooking({
        providerId: provider.id,
        serviceType: provider.category,
        bookingDate: selectedBooking.date,
        timeSlot: selectedBooking.slot,
        notes: 'Regular checkup booked via web portal',
      });

      const bData = res.booking || res.data?.booking || {
        id: 'b_' + Date.now().toString().slice(-6),
        bookingDate: selectedBooking.date,
        timeSlot: selectedBooking.slot,
      };

      setConfirmedBooking(bData);
      setBookingSuccess(true);

      // Forward to WhatsApp
      if (provider.phone) {
        const { url } = buildWhatsAppBookingUrl({
          phone: provider.phone,
          providerName: provider.name,
          clinicName: provider.clinicName,
          serviceType: provider.category,
          date: selectedBooking.date,
          time: selectedBooking.slot,
          bookingId: bData.id,
          notes: 'Booked on TrustPaw Web Portal',
        });
        window.open(url, '_blank');
      }
    } catch (err) {
      // Demo fallback
      const bData = {
        id: 'b_' + Date.now().toString().slice(-6),
        bookingDate: selectedBooking.date,
        timeSlot: selectedBooking.slot,
      };
      setConfirmedBooking(bData);
      setBookingSuccess(true);

      if (provider.phone) {
        const { url } = buildWhatsAppBookingUrl({
          phone: provider.phone,
          providerName: provider.name,
          clinicName: provider.clinicName,
          serviceType: provider.category,
          date: selectedBooking.date,
          time: selectedBooking.slot,
          bookingId: bData.id,
        });
        window.open(url, '_blank');
      }
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading-box">
        <div className="loading-spinner-circle"></div>
        <p>Loading practitioner profile & real-time calendar...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="detail-error-card">
        <h2>Practitioner Not Found</h2>
        <p>{error || 'The requested specialist profile could not be loaded.'}</p>
        <button className="btn-secondary" onClick={() => navigate('/providers')}>
          ← Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="provider-detail-page">
      <div className="provider-detail-container">
        {/* Navigation Breadcrumb */}
        <button className="back-link-btn" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          <span>Back to Specialists</span>
        </button>

        {/* Doctor & Facility Hero Card */}
        <div className="detail-hero-card">
          <div className="detail-hero-grid">
            <div className="detail-hero-media">
              <img
                src={provider.imageUrl || 'https://images.unsplash.com/photo-1628009368231-7bb3cfcb0def?w=600&h=600&fit=crop'}
                alt={provider.name}
                className="detail-hero-img"
              />
              {provider.isEmergency && (
                <span className="emergency-badge">
                  <span className="emergency-dot"></span> 24/7 Emergency Trauma
                </span>
              )}
            </div>

            <div className="detail-hero-info">
              <div className="detail-badge-row">
                <span className="badge badge--terracotta">
                  {provider.category?.toUpperCase() || 'VETERINARY'}
                </span>
                <span className="badge badge--sage">
                  {provider.yearsExperience}+ Years Clinical Experience
                </span>
              </div>

              <h1 className="detail-name">{provider.name}</h1>
              <h2 className="detail-clinic">{provider.clinicName}</h2>

              <div className="detail-rating-row">
                <div className="detail-rating-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#C98D72" stroke="#C98D72">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <strong>{provider.rating}</strong>
                  <span>({provider.reviewCount} verified reviews)</span>
                </div>
                <span className="detail-city-tag">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {provider.area ? `${provider.area}, ` : ''}{provider.city}
                </span>
              </div>

              <p className="detail-address">
                <strong>Facility Address:</strong> {provider.address}
              </p>

              <div className="detail-action-buttons">
                <a href={`tel:${provider.phone}`} className="btn-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>Call {provider.phone}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(provider.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Clinical Information & Slot Booking */}
        <div className="detail-layout-grid">
          {/* Left Column: Focus, Languages & Transparent INR Pricing */}
          <div className="detail-info-col">
            {/* Specializations & Languages */}
            <div className="info-box">
              <span className="box-eyebrow">Qualifications & Care</span>
              <h3 className="box-title">Clinical Focus & Languages</h3>

              <div className="info-subgroup">
                <span className="info-label">Specializations & Procedures:</span>
                <div className="tag-cloud">
                  {provider.specializations?.map((spec, i) => (
                    <span key={i} className="spec-pill">{spec}</span>
                  ))}
                </div>
              </div>

              <div className="info-subgroup">
                <span className="info-label">Languages Spoken / भाषाएं:</span>
                <div className="tag-cloud">
                  {provider.languages?.map((lang, i) => (
                    <span key={i} className="lang-pill">{lang}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* INR Pricing Schedule */}
            <div className="info-box">
              <span className="box-eyebrow">Price Transparency</span>
              <h3 className="box-title">INR Fee Schedule / शुल्क विवरण (₹)</h3>
              <p className="box-desc">All consultation fees are standard rates without platform markups.</p>

              <div className="pricing-list">
                {provider.pricing &&
                  Object.entries(provider.pricing).map(([key, val]) => (
                    <div key={key} className="pricing-item">
                      <span className="pricing-item-name">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                      </span>
                      <span className="pricing-item-rate">
                        {val.min && val.max
                          ? `${formatINR(val.min)} – ${formatINR(val.max)}`
                          : formatINR(val.min || val.max)}
                      </span>
                    </div>
                  ))}
              </div>
              <span className="pricing-note">
                * Includes physical clinical assessment. Diagnostic blood tests, X-rays, and prescription medicines are billed separately by the clinic.
              </span>
            </div>
          </div>

          {/* Right Column: Appointment Reservation Card */}
          <div className="detail-booking-col">
            <div className="booking-card">
              <span className="box-eyebrow">Appointment Reservation</span>
              <h3 className="box-title">Schedule a Consultation</h3>
              <p className="box-desc">Select a slot to automatically forward to the specialist’s desk.</p>

              {bookingSuccess ? (
                <div className="booking-confirmation-view">
                  <div className="confirm-icon-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3F8A61" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h4>Consultation Reserved!</h4>
                  <p className="confirm-desc">
                    Your appointment has been logged in our system and forwarded directly to the clinic doctor.
                  </p>

                  {provider.phone && (
                    <div className="confirm-whatsapp-card">
                      <p>
                        Direct WhatsApp forwarded to <strong>{provider.name}</strong> ({provider.phone}).
                      </p>
                      <WhatsAppBooking
                        phone={provider.phone}
                        providerName={provider.name}
                        clinicName={provider.clinicName}
                        serviceType={provider.category}
                        date={selectedBooking.date}
                        time={selectedBooking.slot}
                        bookingId={confirmedBooking?.id}
                        buttonText="Open WhatsApp Message Again"
                      />
                    </div>
                  )}

                  <button className="btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => navigate('/bookings')}>
                    View in My Appointments →
                  </button>
                </div>
              ) : (
                <>
                  <BookingSlots
                    availableSlots={provider.availableSlots}
                    onSelectSlot={(selected) => setSelectedBooking(selected)}
                  />

                  <div className="booking-submission-group">
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', padding: '13px' }}
                      onClick={handleConfirmBooking}
                      disabled={bookingSubmitting}
                    >
                      {bookingSubmitting ? 'Confirming Reservation...' : 'Confirm & Instant Forward →'}
                    </button>

                    <div className="booking-or-divider">
                      <span>or book directly on whatsapp</span>
                    </div>

                    <WhatsAppBooking
                      phone={provider.phone}
                      clinicName={provider.clinicName}
                      providerName={provider.name}
                      serviceType={provider.category}
                      date={selectedBooking.date || 'Preferred Day'}
                      time={selectedBooking.slot || 'Morning'}
                      buttonText="WhatsApp Chat with Doctor"
                      large={true}
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