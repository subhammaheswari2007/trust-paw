import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './OTPVerifyPage.css';

export default function OTPVerifyPage() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  const email = sessionStorage.getItem('tp_pending_email') || 'your email';
  const phone = sessionStorage.getItem('tp_pending_phone') || '';
  const otpId = sessionStorage.getItem('tp_otp_id');

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (index, value) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = clean;
    setDigits(nextDigits);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (clean && nextDigits.every((d) => d !== '')) {
      const fullOTP = nextDigits.join('');
      sessionStorage.setItem('tp_entered_otp', fullOTP);
      navigate('/set-password');
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const nextDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      nextDigits[i] = pasted[i];
    }
    setDigits(nextDigits);
    if (pasted.length === 6) {
      sessionStorage.setItem('tp_entered_otp', pasted);
      navigate('/set-password');
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const fullOTP = digits.join('');
    if (fullOTP.length !== 6) {
      setError('Please enter all 6 digits of the OTP code');
      return;
    }
    sessionStorage.setItem('tp_entered_otp', fullOTP);
    navigate('/set-password');
  };

  const handleResend = async () => {
    if (timeLeft > 0 || resending) return;
    try {
      setResending(true);
      setError('');
      const res = await api.sendOTP(email, phone);
      if (res.otpId) sessionStorage.setItem('tp_otp_id', res.otpId);
      setTimeLeft(300);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <button
          type="button"
          className="otp-back-btn"
          onClick={() => navigate('/login')}
          aria-label="Back to Login"
        >
          ← Back to Login
        </button>

        <div className="otp-card__header">
          <div className="otp-icon-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="otp-card__title">Verify 6-Digit OTP</h2>
          <p className="otp-card__subtitle">ईमेल एवं एसएमएस सत्यापन कोड</p>
          <p className="otp-card__sent-info">
            Sent to <strong>{email}</strong>
            {phone && <span> & <strong>{phone}</strong></span>}
          </p>
        </div>

        {error && <div className="otp-card__error">{error}</div>}

        <form onSubmit={handleManualSubmit}>
          <div className="otp-input-group" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`otp-digit ${digit ? 'otp-digit--filled' : ''}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="otp-timer-box">
            {timeLeft > 0 ? (
              <span className="otp-timer">
                OTP expires in <strong>{formatTimer(timeLeft)}</strong>
              </span>
            ) : (
              <span className="otp-timer otp-timer--expired">
                OTP has expired. Please request a new one.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary otp-submit-btn"
            disabled={digits.some((d) => d === '')}
          >
            Verify OTP & Continue →
          </button>
        </form>

        <div className="otp-resend-row">
          <span>Didn't receive the verification code? </span>
          <button
            type="button"
            className="otp-resend-btn"
            onClick={handleResend}
            disabled={timeLeft > 0 || resending}
          >
            {resending ? 'Sending...' : 'Resend OTP / पुनः भेजें'}
          </button>
        </div>
      </div>
    </div>
  );
}