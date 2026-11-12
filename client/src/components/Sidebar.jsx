import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Overview', labelHi: 'होम / मुख्य पृष्ठ', icon: 'home' },
    { to: '/providers', label: 'Doctors & Clinics', labelHi: 'सेवाएं और क्लिनिक', icon: 'stethoscope' },
    { to: '/bookings', label: 'Appointments', labelHi: 'मेरी नियुक्तियां', icon: 'calendar' },
    { to: '/profile', label: 'Pet Vault & Profile', labelHi: 'मेरी प्रोफ़ाइल', icon: 'user' },
    { to: '/easy-assist', label: 'Easy Assist Mode', labelHi: 'सुगम सेवा मोड', icon: 'heart' },
  ];

  return (
    <aside className="sidebar" aria-label="Desktop Sidebar">
      <div className="sidebar__brand" onClick={() => navigate('/')}>
        <div className="sidebar__logo-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1 2.5 3 4 2-1.5 3-2.5 3-4a3 3 0 0 0-3-3z"/>
            <path d="M19 8a2.5 2.5 0 0 0-2.5 2.5c0 1.2.8 2 2.5 3.5 1.7-1.5 2.5-2.3 2.5-3.5A2.5 2.5 0 0 0 19 8z"/>
            <path d="M5 8a2.5 2.5 0 0 1 2.5 2.5c0 1.2-.8 2-2.5 3.5C3.3 12.5 2.5 11.7 2.5 10.5A2.5 2.5 0 0 1 5 8z"/>
            <path d="M12 11c-3.3 0-6 2.7-6 6a5 5 0 0 0 10 0c0-3.3-2.7-6-4-6z"/>
          </svg>
        </div>
        <div>
          <h2 className="sidebar__brand-name">TrustPaw</h2>
          <span className="sidebar__brand-tag">Pet Healthcare & Wellness</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
            }
          >
            <div className="sidebar__item-text">
              <span className="sidebar__item-label">{item.label}</span>
              <span className="sidebar__item-sublabel">{item.labelHi}</span>
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        {user ? (
          <div className="sidebar__user-profile">
            <div className="sidebar__user-avatar">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name || 'User'} />
              ) : (
                <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="sidebar__user-details">
              <span className="sidebar__user-name">{user.name || 'Pet Parent'}</span>
              <span className="sidebar__user-email">{user.email}</span>
            </div>
            <button className="sidebar__logout-btn" onClick={logout} title="Sign Out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        ) : (
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>
            Sign In / साइन इन
          </button>
        )}
      </div>
    </aside>
  );
}