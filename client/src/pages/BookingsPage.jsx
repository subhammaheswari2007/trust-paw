import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { formatDate, formatTime } from '../utils/formatters';
import { cleanWhatsAppNumber } from '../components/WhatsAppBooking';
import './BookingsPage.css';

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const res = await api.getBookings();
        const list = res.bookings || res.data?.bookings || [];
        setBookings(list);
      } catch (err) {
        // Fallback demo bookings
        setBookings([
          {
            id: 'b_demo_1',
            serviceType: 'veterinary',
            providerName: 'Dr. Ananya Sharma (Paws & Claws Clinic)',
            providerPhone: '+919876543210',
            bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            timeSlot: '11:00',
            status: 'confirmed',
            notes: 'Annual booster vaccination & dental health inspection',
          },
          {
            id: 'b_demo_2',
            serviceType: 'grooming',
            providerName: 'Royal Paw Spa & Grooming Studio',
            providerPhone: '+919812345678',
            bookingDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
            timeSlot: '15:00',
            status: 'pending',
            notes: 'Full therapeutic bath, de-shedding & ear cleansing',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="status-badge status-badge--confirmed">
            <span className="status-dot"></span> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="status-badge status-badge--completed">
            Completed
          </span>
        );
      default:
        return (
          <span className="status-badge status-badge--pending">
            <span className="status-dot"></span> Pending Confirmation
          </span>
        );
    }
  };

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        {/* Header Row */}
        <div className="bookings-header-card">
          <div>
            <span className="bookings-eyebrow">Consultation Schedule</span>
            <h1 className="bookings-title">My Appointments & Care Visits</h1>
            <p className="bookings-subtitle">
              आपकी आगामी नियुक्तियां, परामर्श इतिहास एवं क्लिनिक संपर्क
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/providers')}
          >
            + Book New Appointment
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="bookings-loading-card">
            <div className="loading-spinner-circle"></div>
            <p>Loading your appointment history...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty-card">
            <div className="empty-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3>No Appointments Scheduled</h3>
            <p>You do not have any upcoming veterinary or grooming appointments.</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate('/providers')}
            >
              Browse Doctors & Hospitals
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((b) => (
              <div key={b.id || b._id} className="booking-card-item">
                <div className="booking-card-main">
                  <div className="booking-status-row">
                    <span className="booking-service-tag">{b.serviceType?.toUpperCase() || 'CARE VISIT'}</span>
                    {getStatusBadge(b.status)}
                  </div>

                  <h3 className="booking-provider-name">{b.providerName || 'Specialist Consultation'}</h3>
                  {b.notes && <p className="booking-notes">{b.notes}</p>}

                  <div className="booking-time-details">
                    <div className="time-detail-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{formatDate(b.bookingDate)}</span>
                    </div>

                    <div className="time-detail-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>{formatTime(b.timeSlot)}</span>
                    </div>

                    {b.providerPhone && (
                      <div className="time-detail-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <span>{b.providerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="booking-card-actions">
                  {b.providerPhone && (
                    <a
                      href={`https://wa.me/${cleanWhatsAppNumber(b.providerPhone)}?text=${encodeURIComponent(
                        `Hello, I would like to inquire about my TrustPaw appointment #${String(b.id).slice(-6)} on ${b.bookingDate} at ${b.timeSlot}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="booking-wa-btn"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>WhatsApp Clinic</span>
                    </a>
                  )}
                  {b.providerPhone && (
                    <a href={`tel:${b.providerPhone}`} className="booking-call-btn">
                      Call Specialist
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}