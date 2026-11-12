import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './SecretAdminModal.css';

export default function SecretAdminModal({ onClose }) {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the secret passcode / कृपया पासवर्ड दर्ज करें');
      return;
    }

    try {
      setLoading(true);
      setError('');
      // Check passcode against backend or local secret
      if (passcode.trim() === 'trustpaw2007') {
        sessionStorage.setItem('trustpaw_admin_token', 'trustpaw2007');
        onClose();
        navigate('/admin');
        return;
      }

      const res = await api.adminVerify(passcode.trim());
      if (res.success) {
        sessionStorage.setItem('trustpaw_admin_token', passcode.trim());
        onClose();
        navigate('/admin');
      } else {
        setError('Incorrect Admin Passcode / अमान्य पासवर्ड');
      }
    } catch (err) {
      setError(err.message || 'Incorrect Admin Passcode / अमान्य पासवर्ड');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="secret-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="secret-modal-card">
        <button className="secret-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <span className="secret-modal-icon">🔐</span>
        <h3 className="secret-modal-title">Master Facility & Doctor Admin</h3>
        <p className="secret-modal-subtitle">
          Secret administration portal for managing clinics, doctors, photos, pricing, and phone numbers.
        </p>

        <form onSubmit={handleSubmit} className="secret-modal-form">
          <div className="secret-input-wrapper">
            <input
              type="password"
              className="secret-input"
              placeholder="Enter secret passcode..."
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          {error && <div className="secret-error-msg">{error}</div>}

          <button type="submit" className="secret-submit-btn" disabled={loading}>
            {loading ? 'Verifying Authorization...' : 'Unlock Admin Portal / एडमिन खोलें →'}
          </button>
        </form>

        <div className="secret-hint">
          * Authorized administrators & clinic managers only
        </div>
      </div>
    </div>
  );
}

