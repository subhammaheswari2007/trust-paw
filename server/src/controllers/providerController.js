import {
  getAllProviders,
  findProviderById,
  upsertProvider,
  deleteProviderById,
  getAllSiteSettings,
  setSiteSetting,
} from '../models/schema.js';
import { haversineDistance } from '../utils/haversine.js';

const ADMIN_PASSCODE = process.env.ADMIN_SECRET || 'trustpaw2007';

// ─── GET /api/v1/providers ──────────────────────────────────────────────────

export async function listProviders(req, res, next) {
  try {
    const { category, city, lat, lng, sort } = req.query;

    let results = getAllProviders();

    // Filter by category
    if (category) {
      results = results.filter((p) => p.category === category.toLowerCase());
    }

    // Filter by city (case-insensitive)
    if (city) {
      results = results.filter((p) => p.city.toLowerCase() === city.toLowerCase());
    }

    // Calculate distance if lat/lng provided
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    if (!isNaN(userLat) && !isNaN(userLng)) {
      results = results.map((p) => ({
        ...p,
        distance: Math.round(haversineDistance(userLat, userLng, p.lat, p.lng) * 100) / 100,
      }));
    }

    // Sort
    if (sort === 'distance' && !isNaN(userLat)) {
      results.sort((a, b) => a.distance - b.distance);
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'price') {
      results.sort((a, b) => {
        const aMin = a.pricing ? Object.values(a.pricing)[0]?.min ?? Infinity : Infinity;
        const bMin = b.pricing ? Object.values(b.pricing)[0]?.min ?? Infinity : Infinity;
        return aMin - bMin;
      });
    }

    res.json({ success: true, count: results.length, providers: results });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/providers/emergency ────────────────────────────────────────

export async function emergencyProviders(req, res, next) {
  try {
    const { lat, lng } = req.query;

    const all = getAllProviders();
    let results = all.filter((p) => p.isEmergency && p.is24x7 && p.category === 'veterinary');

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (!isNaN(userLat) && !isNaN(userLng)) {
      results = results.map((p) => ({
        ...p,
        distance: Math.round(haversineDistance(userLat, userLng, p.lat, p.lng) * 100) / 100,
      }));
      results.sort((a, b) => a.distance - b.distance);
    }

    res.json({ success: true, count: results.length, providers: results });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/providers/:id ──────────────────────────────────────────────

export async function getProvider(req, res, next) {
  try {
    const provider = findProviderById(req.params.id);

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    res.json({ success: true, provider });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN: POST /api/v1/providers/admin/verify ─────────────────────────────

export async function adminVerifyPasscode(req, res) {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    return res.json({ success: true, message: 'Admin passcode verified', token: ADMIN_PASSCODE });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin passcode' });
}

// ─── ADMIN: POST /api/v1/providers/admin/save ───────────────────────────────

export async function adminSaveProvider(req, res, next) {
  try {
    const passcode = req.headers['x-admin-passcode'] || req.body.adminPasscode;
    if (passcode !== ADMIN_PASSCODE) {
      return res.status(403).json({ success: false, message: 'Unauthorized admin request' });
    }

    const payload = { ...req.body };
    delete payload.adminPasscode;

    if (!payload.id) {
      payload.id = 'prov_' + Date.now();
    }

    const saved = upsertProvider(payload);
    res.json({ success: true, message: 'Facility / Doctor saved successfully', provider: saved });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN: DELETE /api/v1/providers/admin/:id ──────────────────────────────

export async function adminDeleteProvider(req, res, next) {
  try {
    const passcode = req.headers['x-admin-passcode'] || req.query.adminPasscode;
    if (passcode !== ADMIN_PASSCODE) {
      return res.status(403).json({ success: false, message: 'Unauthorized admin request' });
    }

    deleteProviderById(req.params.id);
    res.json({ success: true, message: 'Facility / Doctor deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// ─── SETTINGS: GET /api/v1/providers/settings ────────────────────────────────

export async function getSettings(req, res, next) {
  try {
    const current = getAllSiteSettings();
    res.json({
      success: true,
      settings: {
        heroImageUrl: current.heroImageUrl || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&h=700&fit=crop',
        sosPhone: current.sosPhone || '+919725671201',
        sosHospitalName: current.sosHospitalName || 'TrustPaw 24/7 National Emergency Trauma Hotline',
        ...current,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN: POST /api/v1/providers/admin/settings ────────────────────────────

export async function adminSaveSettings(req, res, next) {
  try {
    const passcode = req.headers['x-admin-passcode'] || req.body?.adminPasscode;
    if (passcode !== ADMIN_PASSCODE) {
      return res.status(403).json({ success: false, message: 'Unauthorized admin request' });
    }

    const { heroImageUrl, sosPhone, sosHospitalName } = req.body || {};
    if (heroImageUrl !== undefined) setSiteSetting('heroImageUrl', heroImageUrl);
    if (sosPhone !== undefined) setSiteSetting('sosPhone', sosPhone);
    if (sosHospitalName !== undefined) setSiteSetting('sosHospitalName', sosHospitalName);

    const updated = getAllSiteSettings();
    res.json({
      success: true,
      message: 'Site settings updated successfully',
      settings: {
        heroImageUrl: updated.heroImageUrl || heroImageUrl,
        sosPhone: updated.sosPhone || sosPhone,
        sosHospitalName: updated.sosHospitalName || sosHospitalName,
        ...updated,
      },
    });
  } catch (err) {
    next(err);
  }
}


