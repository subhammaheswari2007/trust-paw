import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithEmail } = useAuth();

  const [mode, setMode] = useState('register'); // 'register' or 'login'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      // Redirect to sleek verification loading animation
      navigate('/verifying');
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email OTP Dispatch (Register flow)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Please provide a mandatory 10-digit Indian contact number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const cleanPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '').slice(-10)}`;
      const res = await api.sendOTP(email, cleanPhone);
      
      // Store temp state in sessionStorage for OTP flow
      sessionStorage.setItem('tp_pending_email', email);
      sessionStorage.setItem('tp_pending_phone', cleanPhone);
      sessionStorage.setItem('tp_otp_id', res.otpId || 'demo_otp_id');

      navigate('/verify-otp');
    } catch (err) {
      setError(err.message || 'Failed to dispatch OTP. Check server status.');
    } finally {
      setLoading(false);
    }
  };

  // Handle direct Email + Password Login
  const handleDirectLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginWithEmail(email, password);
      navigate('/verifying');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card glass-card--lg">
        <div className="login-card__header">
          <div className="login-card__logo">🐾 TrustPaw</div>
          <h1 className="login-card__title">
            {mode === 'register' ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="login-card__subtitle">
            भारत का विश्वसनीय पेट केयर प्लेटफ़ॉर्म
          </p>
        </div>

        {error && <div className="login-card__error">{error}</div>}

        {/* Option A: Google Identity Services Pathway */}
        <div className="login-card__google-section">
          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google (गूगल द्वारा लॉगिन)</span>
          </button>
          <span className="google-signin-note">
            ⚡ Secure One-Tap OIDC Authentication / वन-टैप सत्यापन
          </span>
        </div>

        <div className="login-divider">
          <span>OR / अथवा</span>
        </div>

        {/* Option B: Email OTP or Direct Sign-In */}
        {mode === 'register' ? (
          <form className="login-form" onSubmit={handleSendOTP}>
            <div className="form-group">
              <label className="form-label">
                Email Address / ईमेल पता
              </label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Contact Number (Mandatory for SMS/WhatsApp Alerts)
              </label>
              <div className="input-wrapper input-wrapper--phone">
                <span className="input-prefix">🇮🇳 +91</span>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="98765 43210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <span className="form-help">
                We'll send appointment confirmations and SOS notifications here.
              </span>
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? 'Generating Secure OTP...' : 'Send 6-Digit OTP / ओटीपी भेजें →'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleDirectLogin}>
            <div className="form-group">
              <label className="form-label">Email Address / ईमेल पता</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password / पासवर्ड</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In / साइन इन करें →'}
            </button>
          </form>
        )}

        <div className="login-card__toggle-mode">
          {mode === 'register' ? (
            <p>
              Already registered?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => setMode('login')}
              >
                Sign In with Password / पासवर्ड से लॉगिन करें
              </button>
            </p>
          ) : (
            <p>
              Need a new account?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => setMode('register')}
              >
                Register with Email OTP / नया खाता बनाएं
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}