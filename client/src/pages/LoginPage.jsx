import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-mark" onClick={() => navigate('/')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1 2.5 3 4 2-1.5 3-2.5 3-4a3 3 0 0 0-3-3z"/>
              <path d="M19 8a2.5 2.5 0 0 0-2.5 2.5c0 1.2.8 2 2.5 3.5 1.7-1.5 2.5-2.3 2.5-3.5A2.5 2.5 0 0 0 19 8z"/>
              <path d="M5 8a2.5 2.5 0 0 1 2.5 2.5c0 1.2-.8 2-2.5 3.5C3.3 12.5 2.5 11.7 2.5 10.5A2.5 2.5 0 0 1 5 8z"/>
              <path d="M12 11c-3.3 0-6 2.7-6 6a5 5 0 0 0 10 0c0-3.3-2.7-6-4-6z"/>
            </svg>
          </div>
          <h1 className="auth-title">TrustPaw</h1>
          <p className="auth-tagline">
            India's Premier Pet Healthcare & Wellness Network
          </p>
        </div>

        {/* 1-Click Google Sign-in */}
        <button
          type="button"
          className="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>{loading ? 'Signing in with Google...' : 'Continue with Google'}</span>
        </button>

        <div className="auth-divider">
          <span>or continue with email & phone</span>
        </div>

        {/* Mode Switcher */}
        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => {
              setMode('register');
              setError('');
            }}
          >
            Register / नया खाता
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => {
              setMode('login');
              setError('');
            }}
          >
            Sign In / साइन इन
          </button>
        </div>

        {error && <div className="auth-error-banner">{error}</div>}

        {/* Register Flow Form */}
        {mode === 'register' ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                placeholder="petparent@trustpaw.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number (+91) *</label>
              <input
                type="tel"
                required
                placeholder="10-digit Indian Mobile (e.g. 9876543210)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
              <span className="form-hint">Required for direct clinic WhatsApp appointment confirmations</span>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Dispatching OTP...' : 'Send Verification OTP →'}
            </button>
          </form>
        ) : (
          /* Login Flow Form */
          <form onSubmit={handleDirectLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                placeholder="petparent@trustpaw.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Account →'}
            </button>
          </form>
        )}

        <div className="auth-footer-note">
          By continuing, you agree to TrustPaw's Clinical Privacy Standards & Care Terms.
        </div>
      </div>
    </div>
  );
}