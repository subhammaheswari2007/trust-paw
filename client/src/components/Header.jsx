import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EasyAssistToggle from './EasyAssistToggle';
import SOSModal from './SOSModal';
import DistanceTracker from './DistanceTracker';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const [showSOS, setShowSOS] = useState(false);
  const [showNearby, setShowNearby] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <button
            className="header__sos-btn"
            onClick={() => setShowSOS(true)}
            aria-label="SOS Emergency"
          >
            🚨 SOS
          </button>

          <button
            className="header__nearby-btn"
            onClick={() => setShowNearby(!showNearby)}
          >
            📍 Nearby
          </button>

          <div className="header__logo" onClick={() => navigate('/')}>
            🐾 TrustPaw
          </div>

          <EasyAssistToggle />

          <button
            className="header__profile-btn"
            onClick={() => navigate('/profile')}
            aria-label="Profile"
          >
            👤
          </button>
        </div>

        {showNearby && (
          <div className="header__nearby-panel">
            <DistanceTracker onClose={() => setShowNearby(false)} />
          </div>
        )}
      </header>

      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
    </>
  );
}
