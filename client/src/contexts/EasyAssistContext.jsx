import { createContext, useState, useEffect, useCallback } from 'react';

export const EasyAssistContext = createContext(null);

export function EasyAssistProvider({ children }) {
  const [isEasyAssist, setIsEasyAssist] = useState(() => {
    try {
      return localStorage.getItem('trustpaw_easy_assist') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isEasyAssist) {
      document.body.classList.add('easy-assist-mode');
    } else {
      document.body.classList.remove('easy-assist-mode');
    }
    localStorage.setItem('trustpaw_easy_assist', String(isEasyAssist));
  }, [isEasyAssist]);

  const toggleEasyAssist = useCallback(() => {
    setIsEasyAssist((prev) => !prev);
  }, []);

  const value = {
    isEasyAssist,
    toggleEasyAssist,
  };

  return (
    <EasyAssistContext.Provider value={value}>
      {children}
    </EasyAssistContext.Provider>
  );
}
