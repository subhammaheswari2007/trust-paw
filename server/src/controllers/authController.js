import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { signToken, decodeToken } from '../utils/jwt.js';
import { generateOTP, hashOTP, verifyOTP, otpExpiresAt } from '../utils/otp.js';
import { sendOTPEmail } from '../utils/email.js';
import { JWT_COOKIE_NAME, JWT_COOKIE_MAX_AGE, BCRYPT_ROUNDS } from '../utils/constants.js';
import {
  findUserByEmail,
  findUserById,
  findUserByGoogleId,
  createUser,
  createOTP,
  findOTPById,
  markOTPVerified,
} from '../models/schema.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

function setSessionCookie(res, token) {
  res.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: JWT_COOKIE_MAX_AGE,
  });
}

function sanitiseUser(user) {
  const { password_hash, google_id, ...safe } = user;
  return safe;
}

// ─── POST /api/v1/auth/google ───────────────────────────────────────────────

export async function googleAuth(req, res, next) {
  try {
    const { idToken } = req.body;

    let payload;

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id') {
      // Production mode — verify with Google JWKS
      // Dynamic import to avoid hard dependency
      const { OAuth2Client } = await import('google-auth-library');
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      // Demo mode — decode without verification
      payload = decodeToken(idToken);
      if (!payload) {
        return res.status(400).json({ success: false, message: 'Invalid idToken' });
      }
    }

    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let user = findUserByGoogleId(googleId) || findUserByEmail(email);

    if (!user) {
      user = createUser({
        id: uuidv4(),
        email,
        phone: '',
        name,
        avatarUrl: picture,
        authProvider: 'google',
        googleId,
      });
    }

    const token = signToken({ userId: user.id, email: user.email });
    setSessionCookie(res, token);

    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url } });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/v1/auth/email-otp ───────────────────────────────────────────

export async function emailOtp(req, res, next) {
  try {
    const { email, phone } = req.body;

    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const otpId = uuidv4();

    createOTP({
      id: otpId,
      email,
      phone,
      otpHash,
      expiresAt: otpExpiresAt(),
    });

    // Log OTP prominently in dev
    console.log(`\n🔑 [DEV] OTP for ${email}: ${otp}\n`);

    // Attempt email delivery (logs to console in dev)
    await sendOTPEmail(email, otp);

    res.json({ success: true, message: 'OTP sent', otpId });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/v1/auth/verify-otp-password ──────────────────────────────────

export async function verifyOtpPassword(req, res, next) {
  try {
    const { otpId, otp, password, confirmPassword } = req.body;

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Look up OTP record
    const otpRecord = findOTPById(otpId);
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP ID' });
    }

    // Expiry check
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Already used
    if (otpRecord.verified) {
      return res.status(400).json({ success: false, message: 'OTP already used' });
    }

    // Verify OTP hash
    const isValid = await verifyOTP(otp, otpRecord.otp_hash);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    markOTPVerified(otpId);

    // Hash the password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Check if user already exists (e.g. re-registering)
    let user = findUserByEmail(otpRecord.email);
    if (user) {
      return res.status(409).json({ success: false, message: 'User with this email already exists. Please login.' });
    }

    // Create user
    user = createUser({
      id: uuidv4(),
      email: otpRecord.email,
      phone: otpRecord.phone,
      passwordHash,
      authProvider: 'email',
    });

    const token = signToken({ userId: user.id, email: user.email });
    setSessionCookie(res, token);

    res.status(201).json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/v1/auth/login ────────────────────────────────────────────────

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ success: false, message: 'This account uses Google sign-in. Please login with Google.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken({ userId: user.id, email: user.email });
    setSessionCookie(res, token);

    res.json({ success: true, user: sanitiseUser(user) });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/auth/me ────────────────────────────────────────────────────

export async function getMe(req, res, next) {
  try {
    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/v1/auth/logout ───────────────────────────────────────────────

export async function logout(req, res) {
  res.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ success: true });
}
