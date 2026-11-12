import { getDB } from '../config/db.js';
import { providers as defaultProviders } from '../data/providers.js';

function tryParseJSON(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export function formatProvider(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    clinicName: row.clinic_name || '',
    category: row.category || 'veterinary',
    city: row.city || '',
    area: row.area || '',
    address: row.address || '',
    phone: row.phone || '',
    email: row.email || '',
    rating: Number(row.rating) || 4.5,
    reviewCount: Number(row.review_count) || 0,
    yearsExperience: Number(row.years_experience) || 1,
    specializations: tryParseJSON(row.specializations, []),
    isEmergency: Boolean(row.is_emergency),
    is24x7: Boolean(row.is_24x7),
    lat: Number(row.lat) || 0,
    lng: Number(row.lng) || 0,
    imageUrl: row.image_url || '',
    pricing: tryParseJSON(row.pricing, {}),
    availableSlots: tryParseJSON(row.available_slots, []),
    languages: tryParseJSON(row.languages, []),
    updatedAt: row.updated_at,
  };
}

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

    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      clinic_name TEXT,
      category TEXT NOT NULL,
      city TEXT NOT NULL,
      area TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      rating REAL DEFAULT 4.5,
      review_count INTEGER DEFAULT 0,
      years_experience INTEGER DEFAULT 1,
      specializations TEXT,
      is_emergency INTEGER DEFAULT 0,
      is_24x7 INTEGER DEFAULT 0,
      lat REAL DEFAULT 0,
      lng REAL DEFAULT 0,
      image_url TEXT,
      pricing TEXT,
      available_slots TEXT,
      languages TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed default providers if table is empty
  try {
    const countRow = db.prepare('SELECT COUNT(*) as count FROM providers').get();
    if (!countRow || countRow.count === 0) {
      console.log('🌱 Seeding providers table from initial catalog...');
      const insertStmt = db.prepare(`
        INSERT INTO providers (
          id, name, clinic_name, category, city, area, address, phone, email,
          rating, review_count, years_experience, specializations, is_emergency, is_24x7,
          lat, lng, image_url, pricing, available_slots, languages
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const p of defaultProviders) {
        insertStmt.run(
          p.id,
          p.name,
          p.clinicName || '',
          p.category || 'veterinary',
          p.city || 'Mumbai',
          p.area || '',
          p.address || '',
          p.phone || '',
          p.email || '',
          p.rating || 4.5,
          p.reviewCount || 0,
          p.yearsExperience || 1,
          JSON.stringify(p.specializations || []),
          p.isEmergency ? 1 : 0,
          p.is24x7 ? 1 : 0,
          p.lat || 0,
          p.lng || 0,
          p.imageUrl || '',
          JSON.stringify(p.pricing || {}),
          JSON.stringify(p.availableSlots || []),
          JSON.stringify(p.languages || [])
        );
      }
      console.log(`✅ Providers table populated with ${defaultProviders.length} facilities.`);
    }
  } catch (err) {
    console.error('Error seeding providers:', err.message);
  }

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

// ─── Provider / Facility queries (Admin & Public) ───────────────────────────

export function getAllProviders() {
  const rows = getDB().prepare('SELECT * FROM providers ORDER BY rating DESC, name ASC').all();
  return rows.map(formatProvider);
}

export function findProviderById(id) {
  const row = getDB().prepare('SELECT * FROM providers WHERE id = ?').get(id);
  return formatProvider(row);
}

export function upsertProvider(p) {
  const db = getDB();
  const stmt = db.prepare(`
    INSERT INTO providers (
      id, name, clinic_name, category, city, area, address, phone, email,
      rating, review_count, years_experience, specializations, is_emergency, is_24x7,
      lat, lng, image_url, pricing, available_slots, languages, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now')
    )
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      clinic_name = excluded.clinic_name,
      category = excluded.category,
      city = excluded.city,
      area = excluded.area,
      address = excluded.address,
      phone = excluded.phone,
      email = excluded.email,
      rating = excluded.rating,
      review_count = excluded.review_count,
      years_experience = excluded.years_experience,
      specializations = excluded.specializations,
      is_emergency = excluded.is_emergency,
      is_24x7 = excluded.is_24x7,
      lat = excluded.lat,
      lng = excluded.lng,
      image_url = excluded.image_url,
      pricing = excluded.pricing,
      available_slots = excluded.available_slots,
      languages = excluded.languages,
      updated_at = datetime('now')
  `);

  stmt.run(
    p.id,
    p.name,
    p.clinicName || '',
    p.category || 'veterinary',
    p.city || 'Mumbai',
    p.area || '',
    p.address || '',
    p.phone || '',
    p.email || '',
    Number(p.rating) || 4.5,
    Number(p.reviewCount) || 0,
    Number(p.yearsExperience) || 1,
    typeof p.specializations === 'string' ? p.specializations : JSON.stringify(p.specializations || []),
    p.isEmergency ? 1 : 0,
    p.is24x7 ? 1 : 0,
    Number(p.lat) || 0,
    Number(p.lng) || 0,
    p.imageUrl || '',
    typeof p.pricing === 'string' ? p.pricing : JSON.stringify(p.pricing || {}),
    typeof p.availableSlots === 'string' ? p.availableSlots : JSON.stringify(p.availableSlots || []),
    typeof p.languages === 'string' ? p.languages : JSON.stringify(p.languages || [])
  );

  return findProviderById(p.id);
}

export function deleteProviderById(id) {
  return getDB().prepare('DELETE FROM providers WHERE id = ?').run(id);
}

