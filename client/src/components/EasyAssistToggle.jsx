import { useContext } from 'react';
import { EasyAssistContext } from '../contexts/EasyAssistContext';
import './EasyAssistToggle.css';

export default function EasyAssistToggle() {
  const { isEasyAssist, toggleEasyAssist } = useContext(EasyAssistContext);

  return (
    <button
      type="button"
      className={`easy-assist-toggle ${isEasyAssist ? 'easy-assist-toggle--active' : ''}`}
      onClick={toggleEasyAssist}
      title={isEasyAssist ? 'Turn off Easy Assist / सुगम सेवा बंद करें' : 'Turn on Easy Assist / सुगम सेवा चालू करें'}
      aria-pressed={isEasyAssist}
    >
      <span className="easy-assist-toggle__dot"></span>
      <span className="easy-assist-toggle__label">सुगम सेवा</span>
      <span className="easy-assist-toggle__sub">Easy Assist</span>
    </button>
  );
}