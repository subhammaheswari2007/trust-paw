import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import './TTSButton.css';

export default function TTSButton({ text, size = 20 }) {
  const { speak, stop, speaking, supported } = useSpeechSynthesis();

  if (!supported) {
    return (
      <span className="tts-btn tts-btn--disabled" title="Voice narration not supported in this browser">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="1" y1="1" x2="23" y2="23"/>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
        </svg>
      </span>
    );
  }

  const handleClick = (e) => {
    e.stopPropagation();
    if (speaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <button
      type="button"
      className={`tts-btn ${speaking ? 'tts-btn--speaking' : ''}`}
      onClick={handleClick}
      title={speaking ? 'Stop narration / रोकें' : 'Listen aloud / आवाज में सुनें'}
      aria-label={speaking ? 'Stop speech narration' : 'Play voice guidance'}
    >
      {speaking ? (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      )}
      <span className="tts-btn__label">{speaking ? 'Listening...' : 'Listen / सुनें'}</span>
    </button>
  );
}