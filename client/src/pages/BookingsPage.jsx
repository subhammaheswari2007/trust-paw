import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { formatDate, formatTime } from '../utils/formatters';
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
            bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            timeSlot: '11:00',
            status: 'confirmed',
            notes: 'Annual booster vaccination & dental inspection',
          },
          {
            id: 'b_demo_2',
            serviceType: 'grooming',
            providerName: 'Royal Paw Spa & Grooming Studio',
            bookingDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
            timeSlot: '15:00',
            status: 'pending',
            notes: 'Full spa bath, anti-flea dip & paw balm',
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
        return <span className="status-badge status-badge--confirmed">✅ Confirmed / स्वीकृत</span>;
      case 'completed':
        return <span className="status-badge status-badge--completed">🏁 Completed / पूर्ण</span>;
      default:
        return <span className="status-badge status-badge--pending">⏳ Pending Confirmation / प्रतीक्षारत</span>;
    }
  };

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <div className="bookings-header">
          <div>
            <h1 className="bookings-title">My Appointments & Bookings</h1>
            <p className="bookings-subtitle">
              आपकी आगामी नियुक्तियां एवं क्लिनिक परामर्श
            </p>
          </div>
          <button className="primary-btn new-booking-btn" onClick={() => navigate('/providers')}>
            + Book New Service / नई सेवा जोड़ें
          </button>
        </div>

        {loading ? (
          <div className="bookings-loading">
            <span className="loading-spinner">🐾</span>
            <p>Loading your appointments...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bookings-empty glass-card glass-card--lg">
            <span className="empty-icon">📅</span>
            <h3>No Appointments Booked Yet</h3>
            <p>अभी तक कोई बुकिंग दर्ज नहीं है। अपने पालतू साथी के लिए आज ही विशेषज्ञ चुनें!</p>
            <button className="primary-btn" onClick={() => navigate('/providers')}>
              Explore Specialists & Clinics →
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id || booking._id} className="booking-item-card glass-card">
                <div className="booking-item-left">
                  <div className="booking-service-icon">
                    {booking.serviceType === 'veterinary' ? '🏥' :
                     booking.serviceType === 'grooming' ? '🛁' :
                     booking.serviceType === 'training' ? '🎓' : '📦'}
                  </div>
                  <div className="booking-details">
                    <div className="booking-status-row">
                      {getStatusBadge(booking.status)}
                      <span className="booking-ref-id">ID: #{String(booking.id).slice(-6)}</span>
                    </div>
                    <h3 className="booking-provider-title">
                      {booking.providerName || 'Care Specialist'}
                    </h3>
                    <div className="booking-schedule-row">
                      <span>📅 {formatDate(booking.bookingDate)}</span>
                      <span>⏰ {formatTime(booking.timeSlot)}</span>
                    </div>
                    {booking.notes && (
                      <p className="booking-notes-text">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="booking-item-actions">
                  <button
                    className="booking-action-btn"
                    onClick={() => alert(`Appointment ID: ${booking.id}\nSupport line: 1800-TRUST-PAW`)}
                  >
                    Need Help / सहायता
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}