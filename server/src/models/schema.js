import { getDB } from '../config/db.js';

/**
 * Create all application tables if they don't already exist.
 */
export function initTables() {
  const db = getDB();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT,
      name TEXT,
      avatar_url TEXT,
      auth_provider TEXT DEFAULT 'email',
      google_id TEXT UNIQUE,
      easy_assist_mode INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS otps (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      otp_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      breed TEXT,
      age TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      pet_id TEXT REFERENCES pets(id),
      provider_id TEXT NOT NULL,
      service_type TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  console.log('✅ Database tables initialised');
}

// ─── User queries ────────────────────────────────────────────────────────────

export function findUserByEmail(email) {
  return getDB().prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function findUserById(id) {
  return getDB().prepare('SELECT id, email, phone, name, avatar_url, auth_provider, easy_assist_mode, created_at FROM users WHERE id = ?').get(id);
}

export function findUserByGoogleId(googleId) {
  return getDB().prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
}

export function createUser({ id, email, phone, passwordHash, name, avatarUrl, authProvider, googleId }) {
  const stmt = getDB().prepare(`
    INSERT INTO users (id, email, phone, password_hash, name, avatar_url, auth_provider, google_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, email, phone || '', passwordHash || null, name || null, avatarUrl || null, authProvider || 'email', googleId || null);
  return findUserById(id);
}

// ─── OTP queries ─────────────────────────────────────────────────────────────

export function createOTP({ id, email, phone, otpHash, expiresAt }) {
  const stmt = getDB().prepare(`
    INSERT INTO otps (id, email, phone, otp_hash, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, email, phone, otpHash, expiresAt);
}

export function findOTPById(id) {
  return getDB().prepare('SELECT * FROM otps WHERE id = ?').get(id);
}

export function markOTPVerified(id) {
  getDB().prepare('UPDATE otps SET verified = 1 WHERE id = ?').run(id);
}

// ─── Pet queries ─────────────────────────────────────────────────────────────

export function createPet({ id, userId, name, category, breed, age }) {
  const stmt = getDB().prepare(`
    INSERT INTO pets (id, user_id, name, category, breed, age)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, userId, name, category, breed || null, age || null);
  return getDB().prepare('SELECT * FROM pets WHERE id = ?').get(id);
}

export function findPetsByUserId(userId) {
  return getDB().prepare('SELECT * FROM pets WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

// ─── Booking queries ─────────────────────────────────────────────────────────

export function createBooking({ id, userId, petId, providerId, serviceType, bookingDate, timeSlot, notes }) {
  const stmt = getDB().prepare(`
    INSERT INTO bookings (id, user_id, pet_id, provider_id, service_type, booking_date, time_slot, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, userId, petId || null, providerId, serviceType, bookingDate, timeSlot, notes || null);
  return getDB().prepare('SELECT * FROM bookings WHERE id = ?').get(id);
}

export function findBookingsByUserId(userId) {
  return getDB().prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}
