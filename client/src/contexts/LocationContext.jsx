import { createContext, useState, useEffect, useCallback } from 'react';

export const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        // Default to Mumbai coords for demo
        setCoords({ lat: 19.076, lng: 72.8777 });
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const value = {
    coords,
    error,
    loading,
    requestLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
