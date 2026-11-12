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

  // 5-Click secret trigger state for admin
  const [clickCount, setClickCount] = useState(0);
  const lastClickRef = useRef(0);

  const handleLogoClick = () => {
    const now = Date.now();
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
          {/* Brand Logo with Editorial Serif & Medical Paw Icon */}
          <div
            className="header__brand"
            onClick={handleLogoClick}
            title="TrustPaw — Premier Pet Healthcare & Wellness"
          >
            <div className="header__logo-mark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1 2.5 3 4 2-1.5 3-2.5 3-4a3 3 0 0 0-3-3z"/>
                <path d="M19 8a2.5 2.5 0 0 0-2.5 2.5c0 1.2.8 2 2.5 3.5 1.7-1.5 2.5-2.3 2.5-3.5A2.5 2.5 0 0 0 19 8z"/>
                <path d="M5 8a2.5 2.5 0 0 1 2.5 2.5c0 1.2-.8 2-2.5 3.5C3.3 12.5 2.5 11.7 2.5 10.5A2.5 2.5 0 0 1 5 8z"/>
                <path d="M12 11c-3.3 0-6 2.7-6 6a5 5 0 0 0 10 0c0-3.3-2.7-6-4-6z"/>
              </svg>
            </div>
            <div className="header__brand-text">
              <span className="header__brand-name">TrustPaw</span>
              <span className="header__brand-tag">Pet Healthcare & Wellness</span>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="header__nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/providers"
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              Doctors & Hospitals
            </NavLink>
            <NavLink
              to="/providers?category=grooming"
              className="header__nav-link"
            >
              Grooming & Spa
            </NavLink>
            <NavLink
              to="/providers?category=training"
              className="header__nav-link"
            >
              Training
            </NavLink>
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              Appointments
            </NavLink>
          </nav>

          {/* Right Action Tray */}
          <div className="header__actions">
            <button
              type="button"
              className="header__location-btn"
              onClick={() => navigate('/providers')}
              title="Locate Clinics by City"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Clinics</span>
            </button>

            <button
              type="button"
              className="header__book-cta"
              onClick={() => navigate('/providers')}
            >
              Book Specialist
            </button>

            {user ? (
              <div
                className="header__user-pill"
                onClick={() => navigate('/profile')}
                title="View Account & Pets"
              >
                <div className="header__user-avatar">
                  {user.avatar_url || user.avatar ? (
                    <img src={user.avatar_url || user.avatar} alt={user.name || 'User'} />
                  ) : (
                    <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
                <span className="header__user-name">
                  {user.name ? user.name.split(' ')[0] : 'Account'}
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="header__signin-btn"
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
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="header__mobile-drawer">
            <NavLink to="/" end className="header__mobile-item" onClick={closeMobile}>
              Overview
            </NavLink>
            <NavLink to="/providers" className="header__mobile-item" onClick={closeMobile}>
              Doctors & Hospitals
            </NavLink>
            <NavLink to="/providers?category=grooming" className="header__mobile-item" onClick={closeMobile}>
              Grooming & Spa
            </NavLink>
            <NavLink to="/providers?category=training" className="header__mobile-item" onClick={closeMobile}>
              Behavior & Training
            </NavLink>
            <NavLink to="/bookings" className="header__mobile-item" onClick={closeMobile}>
              My Appointments
            </NavLink>
            <NavLink to="/easy-assist" className="header__mobile-item header__mobile-item--highlight" onClick={closeMobile}>
              सुगम सेवा | Easy Assist
            </NavLink>
            <NavLink to="/profile" className="header__mobile-item" onClick={closeMobile}>
              My Pets & Profile
            </NavLink>

            <div className="header__mobile-footer">
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  closeMobile();
                  navigate('/providers');
                }}
              >
                Book a Specialist
              </button>
              {user && (
                <button
                  type="button"
                  className="header__mobile-logout"
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                >
                  Sign Out
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