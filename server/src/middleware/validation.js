import { body, query, param } from 'express-validator';
import { INDIAN_PHONE_REGEX, PASSWORD_REGEX, PET_CATEGORIES, PROVIDER_CATEGORIES } from '../utils/constants.js';

// ─── Shared result handler ──────────────────────────────────────────────────

import { validationResult } from 'express-validator';

/**
 * Middleware that halts the request if any preceding validators failed.
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

// ─── Auth validators ────────────────────────────────────────────────────────

export const validateEmailOTP = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .matches(INDIAN_PHONE_REGEX).withMessage('Valid Indian phone number required (10 digits, optional +91 prefix)'),
  handleValidationErrors,
];

export const validateVerifyOTP = [
  body('otpId')
    .notEmpty().withMessage('otpId is required'),
  body('otp')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must be numeric'),
  body('password')
    .matches(PASSWORD_REGEX).withMessage('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character'),
  body('confirmPassword')
    .notEmpty().withMessage('confirmPassword is required'),
  handleValidationErrors,
];

export const validateLogin = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const validateGoogleAuth = [
  body('idToken')
    .notEmpty().withMessage('idToken is required'),
  handleValidationErrors,
];

// ─── Provider validators ────────────────────────────────────────────────────

export const validateProviderQuery = [
  query('category')
    .optional()
    .isIn(PROVIDER_CATEGORIES).withMessage(`category must be one of: ${PROVIDER_CATEGORIES.join(', ')}`),
  query('city')
    .optional()
    .isString(),
  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('lat must be between -90 and 90'),
  query('lng')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('lng must be between -180 and 180'),
  query('sort')
    .optional()
    .isIn(['distance', 'rating', 'price']).withMessage('sort must be one of: distance, rating, price'),
  handleValidationErrors,
];

export const validateEmergencyQuery = [
  query('lat')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('lat must be between -90 and 90'),
  query('lng')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('lng must be between -180 and 180'),
  handleValidationErrors,
];

export const validateProviderId = [
  param('id')
    .notEmpty().withMessage('Provider ID is required'),
  handleValidationErrors,
];

// ─── Booking validators ─────────────────────────────────────────────────────

export const validateCreateBooking = [
  body('providerId')
    .notEmpty().withMessage('providerId is required'),
  body('serviceType')
    .notEmpty().withMessage('serviceType is required'),
  body('bookingDate')
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('bookingDate must be a valid ISO date (YYYY-MM-DD)')
    .optional(false),
  body('bookingDate')
    .notEmpty().withMessage('bookingDate is required'),
  body('timeSlot')
    .notEmpty().withMessage('timeSlot is required')
    .matches(/^\d{2}:\d{2}$/).withMessage('timeSlot must be in HH:MM format'),
  body('petId').optional().isString(),
  body('notes').optional().isString(),
  handleValidationErrors,
];

// ─── Pet validators ─────────────────────────────────────────────────────────

export const validateCreatePet = [
  body('name')
    .notEmpty().withMessage('Pet name is required')
    .isLength({ max: 100 }).withMessage('Pet name must be under 100 characters'),
  body('category')
    .isIn(PET_CATEGORIES).withMessage(`category must be one of: ${PET_CATEGORIES.join(', ')}`),
  body('breed').optional().isString(),
  body('age').optional().isString(),
  handleValidationErrors,
];
