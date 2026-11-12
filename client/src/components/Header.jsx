import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SecretAdminModal from './SecretAdminModal';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);

  // 5-Click secret trigger state
  const [clickCount, setClickCount] = useState(0);
  const lastClickRef = useRef(0);

  const handleLogoClick = () => {
    const now = Date.now();
    // If more than 3 seconds elapsed since last click, reset counter
    if (now - lastClickRef.current > 3000) {
      setClickCount(1);
    } else {
      const nextCount = clickCount + 1;
      if (nextCount >= 5) {
        setClickCount(0);
        setShowSecretModal(true);
        lastClickRef.current = 0;
        return;
      }
      setClickCount(nextCount);
    }
    lastClickRef.current = now;
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="header">
        <div className="header__inner">
          {/* Brand Logo (Secret 5-Click Trigger) */}
          <div
            className="header__brand-btn"
            onClick={handleLogoClick}
            title="TrustPaw - Premium Pet Care & Store"
          >
            <span className="header__logo-icon">🐾</span>
            <div className="header__brand-text-col">
              <span className="header__brand-title">TrustPaw</span>
              <span className="header__brand-subtag">Pet Care & Store</span>
            </div>
          </div>

          {/* Desktop & Laptop Navigation Menu */}
          <nav className="header__nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `header__nav-item ${isActive ? 'header__nav-item--active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/providers"
              className={({ isActive }) =>
                `header__nav-item ${isActive ? 'header__nav-item--active' : ''}`
              }
            >
              Doctors & Clinics
            </NavLink>
            <NavLink
              to="/providers?category=grooming"
              className="header__nav-item"
            >
              Spa & Grooming
            </NavLink>
            <NavLink
              to="/providers?category=training"
              className="header__nav-item"
            >
              Training
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `header__nav-item ${isActive ? 'header__nav-item--active' : ''}`
              }
            >
              My Appointments
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="header__right-actions">
            <button
              type="button"
              className="header__city-pill"
              onClick={() => navigate('/providers')}
              title="Filter by City / शहर चुनें"
            >
              <span>📍</span>
              <span>Find Clinics</span>
            </button>

            <button
              type="button"
              className="header__book-btn"
              onClick={() => navigate('/providers')}
            >
              + Book Specialist
            </button>

            {user ? (
              <div
                className="header__user-pill"
                onClick={() => navigate('/profile')}
                title="View Profile / मेरी प्रोफाइल"
              >
                <div className="header__user-avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name || 'User'} />
                  ) : (
                    <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
                <span className="header__user-name">
                  {user.name ? user.name.split(' ')[0] : 'Parent'}
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="header__city-pill"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="header__mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu for Phones */}
        {mobileMenuOpen && (
          <div className="header__mobile-drawer">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`
              }
              onClick={closeMobile}
            >
              <span>🏠</span> Home Dashboard
            </NavLink>
            <NavLink
              to="/providers"
              className={({ isActive }) =>
                `header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`
              }
              onClick={closeMobile}
            >
              <span>🩺</span> Doctors & Clinics
            </NavLink>
            <NavLink
              to="/providers?category=grooming"
              className="header__mobile-link"
              onClick={closeMobile}
            >
              <span>🛁</span> Spa & Grooming
            </NavLink>
            <NavLink
              to="/providers?category=training"
              className="header__mobile-link"
              onClick={closeMobile}
            >
              <span>🎓</span> Pet Training
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`
              }
              onClick={closeMobile}
            >
              <span>📅</span> My Appointments
            </NavLink>
            <NavLink
              to="/easy-assist"
              className="header__mobile-link"
              onClick={closeMobile}
            >
              <span>👵</span> Easy Assist Mode
            </NavLink>
            <NavLink
              to="/profile"
              className="header__mobile-link"
              onClick={closeMobile}
            >
              <span>👤</span> My Profile & Pets
            </NavLink>

            <div className="header__mobile-footer-actions">
              <button
                type="button"
                className="header__book-btn"
                style={{ display: 'inline-flex', flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  closeMobile();
                  navigate('/providers');
                }}
              >
                + Book an Appointment
              </button>
              {user && (
                <button
                  type="button"
                  className="header__city-pill"
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Secret Admin Modal */}
      {showSecretModal && (
        <SecretAdminModal onClose={() => setShowSecretModal(false)} />
      )}
    </>
  );
}
