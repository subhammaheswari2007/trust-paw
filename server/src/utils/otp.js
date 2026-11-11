import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { OTP_LENGTH, BCRYPT_ROUNDS, OTP_EXPIRY_MINUTES } from './constants.js';

/**
 * Generate a cryptographically secure numeric OTP.
 * @returns {string} OTP string (zero-padded to OTP_LENGTH digits)
 */
export function generateOTP() {
  const max = 10 ** OTP_LENGTH;       // 1 000 000
  const otp = crypto.randomInt(0, max); // 0 – 999 999
  return String(otp).padStart(OTP_LENGTH, '0');
}

/**
 * Hash an OTP using bcrypt.
 * @param {string} otp
 * @returns {Promise<string>} Hashed OTP
 */
export async function hashOTP(otp) {
  return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

/**
 * Compare a plain OTP against its bcrypt hash.
 * @param {string} otp
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verifyOTP(otp, hash) {
  return bcrypt.compare(otp, hash);
}

/**
 * Return an ISO-8601 timestamp OTP_EXPIRY_MINUTES from now.
 * @returns {string}
 */
export function otpExpiresAt() {
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  return expiresAt.toISOString();
}
