import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import {
  validateEmailOTP,
  validateVerifyOTP,
  validateLogin,
  validateGoogleAuth,
} from '../middleware/validation.js';
import {
  googleAuth,
  emailOtp,
  verifyOtpPassword,
  login,
  getMe,
  logout,
} from '../controllers/authController.js';

const router = Router();

router.post('/google',               authRateLimiter, validateGoogleAuth, googleAuth);
router.post('/email-otp',            authRateLimiter, validateEmailOTP,   emailOtp);
router.post('/verify-otp-password',  authRateLimiter, validateVerifyOTP,  verifyOtpPassword);
router.post('/login',                authRateLimiter, validateLogin,      login);
router.get('/me',                    authenticate,                        getMe);
router.post('/logout',                                                    logout);

export default router;
