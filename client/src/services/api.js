const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
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
      'x-admin-passcode': passcode || sessionStorage.getItem('trustpaw_admin_token') || 'trustpaw2007',
    },
    body: JSON.stringify(providerData),
  });
}

export function adminDeleteProvider(id, passcode) {
  return request(`/api/v1/providers/admin/${id}`, {
    method: 'DELETE',
    headers: {
      'x-admin-passcode': passcode || sessionStorage.getItem('trustpaw_admin_token') || 'trustpaw2007',
    },
  });
}

