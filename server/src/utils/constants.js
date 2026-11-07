/**
 * Application-wide constants
 */

export const OTP_EXPIRY_MINUTES = 5;
export const OTP_LENGTH = 6;
export const BCRYPT_ROUNDS = 12;

export const JWT_COOKIE_NAME = 'trustpaw_session';
export const JWT_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_REQUESTS = 5;

export const PROVIDER_CATEGORIES = ['veterinary', 'grooming', 'training', 'supplies'];
export const PET_CATEGORIES = ['dog', 'cat', 'rabbit', 'bird'];
export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export const INDIAN_PHONE_REGEX = /^(\+91)?[6-9]\d{9}$/;

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
