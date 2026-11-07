import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import './TTSButton.css';

export default function TTSButton({ text, size = 28 }) {
  const { speak, stop, speaking, supported } = useSpeechSynthesis();

  if (!supported) {
    return (
      <span
        className="tts-button tts-button--disabled"
        title="Audio not supported on this browser"
        style={{ fontSize: size }}
      >
        🔇
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
      className={`tts-button ${speaking ? 'tts-button--speaking' : ''}`}
      onClick={handleClick}
      title={speaking ? 'Stop speaking' : 'Listen / सुनें'}
      style={{ fontSize: size }}
      type="button"
    >
      {speaking ? '🔊' : '🔈'}
    </button>
  );
}
