import { useContext } from 'react';
import { EasyAssistContext } from '../contexts/EasyAssistContext';
import './EasyAssistToggle.css';

export default function EasyAssistToggle() {
  const { isEasyAssist, toggleEasyAssist } = useContext(EasyAssistContext);

  return (
    <button
      className={`easy-assist-toggle ${isEasyAssist ? 'easy-assist-toggle--active' : ''}`}
      onClick={toggleEasyAssist}
      title={isEasyAssist ? 'Disable Easy Assist / सुगम सेवा बंद करें' : 'Enable Easy Assist / सुगम सेवा चालू करें'}
    >
      <span className="easy-assist-toggle__label">सुगम सेवा</span>
    </button>
  );
}
