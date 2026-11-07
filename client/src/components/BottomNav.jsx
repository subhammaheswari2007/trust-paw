import { NavLink } from 'react-router-dom';
import './BottomNav.css';

export default function BottomNav() {
  const navItems = [
    { to: '/', label: 'Home', labelHi: 'होम', icon: '🏠' },
    { to: '/providers', label: 'Services', labelHi: 'सेवाएं', icon: '🔍' },
    { to: '/bookings', label: 'Bookings', labelHi: 'बुकिंग', icon: '📅' },
    { to: '/profile', label: 'Profile', labelHi: 'प्रोफ़ाइल', icon: '👤' },
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      <div className="bottom-nav__inner">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
            }
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span className="bottom-nav__label">{item.label}</span>
            <span className="bottom-nav__sublabel">{item.labelHi}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}