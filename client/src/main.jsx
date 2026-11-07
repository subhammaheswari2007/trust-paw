import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import { EasyAssistProvider } from './contexts/EasyAssistContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <EasyAssistProvider>
            <App />
          </EasyAssistProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);