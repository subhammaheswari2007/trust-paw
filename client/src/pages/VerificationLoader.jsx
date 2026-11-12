import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerificationLoader.css';

export default function VerificationLoader() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Initiating cryptographic handshake...');
  const [stageTextHi, setStageTextHi] = useState('सुरक्षा हैंडशेक शुरू हो रहा है...');

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2800; // 2.8s smooth verification sequence

    const frame = (currentTime) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 30) {
        setStageText('Cryptographically verifying OIDC credentials...');
        setStageTextHi('पहचान एवं सुरक्षा क्रेडेंशियल्स का सत्यापन...');
      } else if (pct < 65) {
        setStageText('Issuing secure HTTP-only session tokens...');
        setStageTextHi('सुरक्षित सत्र टोकन जारी किए जा रहे हैं...');
      } else if (pct < 95) {
        setStageText('Loading localized care providers & GPS matrix...');
        setStageTextHi('निकटतम पेट केयर क्लिनिक डेटा लोड हो रहा है...');
      } else {
        setStageText('Verification successful! Welcome to TrustPaw.');
        setStageTextHi('सत्यापन सफल! ट्रस्टपॉ में आपका स्वागत है।');
      }

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 200);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [navigate]);

  return (
    <div className="verification-page">
      <div className="verification-card">
        <div className="verification-brand">
          <div className="verification-logo-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3c0 1.5 1 2.5 3 4 2-1.5 3-2.5 3-4a3 3 0 0 0-3-3z"/>
              <path d="M19 8a2.5 2.5 0 0 0-2.5 2.5c0 1.2.8 2 2.5 3.5 1.7-1.5 2.5-2.3 2.5-3.5A2.5 2.5 0 0 0 19 8z"/>
              <path d="M5 8a2.5 2.5 0 0 1 2.5 2.5c0 1.2-.8 2-2.5 3.5C3.3 12.5 2.5 11.7 2.5 10.5A2.5 2.5 0 0 1 5 8z"/>
              <path d="M12 11c-3.3 0-6 2.7-6 6a5 5 0 0 0 10 0c0-3.3-2.7-6-4-6z"/>
            </svg>
          </div>
          <h1 className="verification-brand-name">TrustPaw</h1>
          <span className="verification-badge">Security Verification</span>
        </div>

        <div className="verification-status-box">
          <p className="verification-status-text">{stageText}</p>
          <p className="verification-status-text-hi">{stageTextHi}</p>
        </div>

        {/* Progress bar */}
        <div className="verification-progress-track">
          <div
            className="verification-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="verification-progress-meta">
          <span>Encrypted Session</span>
          <span className="verification-pct">{progress}%</span>
        </div>
      </div>
    </div>
  );
}