const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    cache: 'no-store',
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      ...(options.headers || {}),
    },
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function googleAuth(idToken) {
  return request('/api/v1/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

export function sendOTP(email, phone) {
  return request('/api/v1/auth/email-otp', {
    method: 'POST',
    body: JSON.stringify({ email, phone }),
  });
}

export function verifyOTPAndSetPassword(otpId, otp, password, confirmPassword) {
  return request('/api/v1/auth/verify-otp-password', {
    method: 'POST',
    body: JSON.stringify({ otpId, otp, password, confirmPassword }),
  });
}

export function login(email, password) {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return request('/api/v1/auth/logout', {
    method: 'POST',
  });
}

export function getMe() {
  return request('/api/v1/auth/me');
}

export function getProviders(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '' && value !== 'All') {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  return request(`/api/v1/providers${query ? `?${query}` : ''}`);
}

export function getEmergencyProviders(lat, lng) {
  return request(`/api/v1/providers/emergency?lat=${lat}&lng=${lng}`);
}

export function getProviderById(id) {
  return request(`/api/v1/providers/${id}`);
}

export function createBooking(data) {
  return request('/api/v1/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getBookings() {
  return request('/api/v1/bookings');
}

export function getPets() {
  return request('/api/v1/pets');
}

export function addPet(data) {
  return request('/api/v1/pets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Master Admin API ───────────────────────────────────────────────────────

export function adminVerify(passcode) {
  return request('/api/v1/providers/admin/verify', {
    method: 'POST',
    body: JSON.stringify({ passcode }),
  });
}

export function adminSaveProvider(providerData, passcode) {
  return request('/api/v1/providers/admin/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-passcode': passcode || sessionStorage.getItem('trustpaw_admin_token') || 'trustpaw2007',
    },
    body: typeof providerData === 'string' ? providerData : JSON.stringify(providerData),
  });
}

export function adminDeleteProvider(id, passcode) {
  return request(`/api/v1/providers/admin/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-passcode': passcode || sessionStorage.getItem('trustpaw_admin_token') || 'trustpaw2007',
    },
  });
}

// ─── Site Settings API ──────────────────────────────────────────────────────

export function getSettings() {
  return request('/api/v1/providers/settings').catch(() => {
    const cachedHero = localStorage.getItem('trustpaw_hero_image');
    const heroImageUrl = (cachedHero && !cachedHero.includes('photo-1548767797-d8c844163c4c'))
      ? cachedHero
      : 'https://res.cloudinary.com/qhmx80db/image/upload/v1794515619/WIN_20260623_03_15_58_Pro.jpg';
    return {
      success: true,
      settings: {
        heroImageUrl,
        sosPhone: localStorage.getItem('trustpaw_sos_phone') || '+919725671201',
        sosHospitalName: localStorage.getItem('trustpaw_sos_name') || 'TrustPaw 24/7 National Emergency Trauma Hotline',
      },
    };
  });
}

export function adminSaveSettings(settingsData, passcode) {
  return request('/api/v1/providers/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-passcode': passcode || sessionStorage.getItem('trustpaw_admin_token') || 'trustpaw2007',
    },
    body: typeof settingsData === 'string' ? settingsData : JSON.stringify(settingsData),
  });
}


