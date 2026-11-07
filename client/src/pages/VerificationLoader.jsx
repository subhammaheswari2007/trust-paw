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
    const duration = 3500; // 3.5 seconds as configured

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
        }, 300);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [navigate]);

  return (
    <div className="verification-page">
      <div className="verification-card glass-card glass-card--lg">
        <div className="verification-brand">
          <span className="verification-brand__logo">🐾</span>
          <h1 className="verification-brand__name">TrustPaw</h1>
          <span className="verification-brand__badge">Security Verification</span>
        </div>

        <div className="verification-status-box">
          <p className="verification-status-text">{stageText}</p>
          <p className="verification-status-text-hi">{stageTextHi}</p>
        </div>

        {/* Progress Container with sliding TrustPaw logo */}
        <div className="verification-track">
          <div
            className="verification-bar"
            style={{ width: `${progress}%` }}
          >
            {/* Sliding TrustPaw logo pill gliding smoothly at the head of the progress bar */}
            <div className="verification-sliding-logo">
              <span className="sliding-paw">🐾</span>
            </div>
          </div>
        </div>

        <div className="verification-footer">
          <span className="verification-percent">{progress}%</span>
          <span className="verification-lock">🔒 256-bit AES Encrypted</span>
        </div>
      </div>
    </div>
  );
}