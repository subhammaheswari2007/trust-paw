import { useState, useEffect } from 'react';
import { useLocation as useLocationHook } from '../hooks/useLocation';
import * as api from '../services/api';
import { formatDistance } from '../utils/formatters';
import './SOSModal.css';

export default function SOSModal({ onClose }) {
  const { coords } = useLocationHook();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmergency() {
      try {
        const lat = coords?.lat || 19.076;
        const lng = coords?.lng || 72.8777;
        const res = await api.getEmergencyProviders(lat, lng);
        setHospitals(res.data?.providers || res.data || []);
      } catch {
        // Demo fallback data
        setHospitals([
          {
            _id: 'e1',
            name: 'PetVet Emergency Hospital',
            address: '123 MG Road, Andheri West, Mumbai',
            phone: '+912226543210',
            distance: 2.3,
          },
          {
            _id: 'e2',
            name: 'Animal Care 24/7',
            address: '456 Brigade Road, Koramangala, Bengaluru',
            phone: '+918026543210',
            distance: 4.1,
          },
          {
            _id: 'e3',
            name: 'VetCare Emergency Clinic',
            address: '789 Connaught Place, New Delhi',
            phone: '+911126543210',
            distance: 5.8,
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchEmergency();
  }, [coords]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="sos-modal" onClick={handleBackdropClick}>
      <div className="sos-modal__content">
        <button className="sos-modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className="sos-modal__title">
          🚨 Emergency Veterinary Services
        </h2>
        <p className="sos-modal__subtitle">
          आपातकालीन पशु चिकित्सा
        </p>

        {loading ? (
          <div className="sos-modal__loading">Finding nearby hospitals...</div>
        ) : (
          <div className="sos-modal__list">
            {hospitals.map((hospital) => (
              <div key={hospital._id} className="sos-modal__card">
                <h3 className="sos-modal__hospital-name">{hospital.name}</h3>
                <p className="sos-modal__distance">
                  {formatDistance(hospital.distance)} away / {formatDistance(hospital.distance)} दूर
                </p>
                <p className="sos-modal__address">{hospital.address}</p>
                <div className="sos-modal__actions">
                  <a
                    href={`tel:${hospital.phone}`}
                    className="sos-modal__call-btn"
                  >
                    📞 Call Now
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sos-modal__directions-btn"
                  >
                    📍 Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
