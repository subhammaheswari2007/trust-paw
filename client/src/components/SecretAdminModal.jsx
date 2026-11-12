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

        <div className="secret-modal-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h3 className="secret-modal-title">Master Facility & Specialist Admin</h3>
        <p className="secret-modal-subtitle">
          Administration portal for managing clinical directories, practitioner credentials, emergency tags, and phone routing.
        </p>

        <form onSubmit={handleSubmit} className="secret-modal-form">
          <input
            type="password"
            className="secret-input"
            placeholder="Enter admin passcode (e.g. trustpaw2007)..."
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              if (error) setError('');
            }}
            autoFocus
          />

          {error && <div className="secret-error-msg">{error}</div>}

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Verifying Authorization...' : 'Unlock Admin Portal →'}
          </button>
        </form>

        <div className="secret-hint">
          * Authorized administrators & clinic managers only
        </div>
      </div>
    </div>
  );
}