import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home', labelHi: 'होम / मुख्य पृष्ठ', icon: '🏠' },
    { to: '/providers', label: 'Services', labelHi: 'सेवाएं और क्लिनिक', icon: '🔍' },
    { to: '/bookings', label: 'Bookings', labelHi: 'मेरी बुकिंग्स', icon: '📅' },
    { to: '/profile', label: 'Profile', labelHi: 'मेरी प्रोफ़ाइल', icon: '👤' },
    { to: '/easy-assist', label: 'Easy Assist', labelHi: 'सुगम सेवा मोड', icon: '👵' },
  ];

  return (
    <aside className="sidebar" aria-label="Desktop Sidebar">
      <div className="sidebar__brand" onClick={() => navigate('/')}>
        <span className="sidebar__logo-icon">🐾</span>
        <div>
          <h2 className="sidebar__brand-name">TrustPaw</h2>
          <span className="sidebar__brand-tag">India's Pet Care</span>
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
            <span className="sidebar__item-icon">{item.icon}</span>
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
            <button className="sidebar__logout-btn" onClick={logout} title="Sign Out / लॉग आउट">
              🚪
            </button>
          </div>
        ) : (
          <button className="sidebar__signin-btn" onClick={() => navigate('/login')}>
            Sign In / साइन इन
          </button>
        )}
      </div>
    </aside>
  );
}